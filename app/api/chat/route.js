import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_API_KEY;

if (!googleApiKey || !supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  throw new Error('Missing required environment variables');
}

const genAI = new GoogleGenerativeAI(googleApiKey);
const supabase = createClient(supabaseUrl, supabaseKey);

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: 'embedding-001',
  apiKey: googleApiKey,
});

// Function to filter and format calendar events
function filterAndFormatEvents(events, month) {
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate.getMonth() === month - 1; 
  });

  return filteredEvents.map(event => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    return `${event.title} on ${startDate.toLocaleDateString()} from ${startDate.toLocaleTimeString()} to ${endDate.toLocaleTimeString()} at ${event.location}`;
  }).join('\n');
}

async function fetchSupabaseData() {
  try {
    const { data, error } = await supabase.from('events').select('*');
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    console.log('Fetched Supabase data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return [];
  }
}

// Function to load and process PDFs along with Supabase data
async function loadAndProcessData() {
  try {
    // Load PDF data
    const pdfDirectory = path.join(process.cwd(), 'public', 'pdfs');
    const pdfFiles = await fs.readdir(pdfDirectory);

    let allDocs = [];
    for (const file of pdfFiles) {
      if (path.extname(file).toLowerCase() === '.pdf') {
        const filePath = path.join(pdfDirectory, file);
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        
        const validDocs = docs
          .map((doc) => ({
            pageContent: doc.pageContent || '',
            metadata: { ...doc.metadata, source: 'PDF', filename: file },
          }))
          .filter((doc) => doc.pageContent.trim() !== ''); // Remove empty content
        allDocs = allDocs.concat(validDocs);
      }
    }

    console.log('Loaded PDF documents:', allDocs.length);

    // Fetch Supabase data and combine with PDF documents
    const supabaseDocs = await fetchSupabaseData();
    console.log('Fetched Supabase documents:', supabaseDocs.length);

    const combinedDocs = allDocs.concat(supabaseDocs.map(item => ({
      pageContent: `${item.title} - ${item.location} - ${new Date(item.start).toLocaleString()}`,
      metadata: { source: 'Supabase', id: item.id },
    })));
    console.log('Total combined documents:', combinedDocs.length);

    // Ensure documents are not empty before splitting
    if (combinedDocs.length === 0) {
      throw new Error('No valid documents to process.');
    }

    // Split documents into chunks
    const splitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(combinedDocs);
    console.log('Split documents:', splitDocs.length);

    return await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  } catch (error) {
    console.error('Error loading and processing data:', error);
    return null;
  }
}

// Load the vector store once when the server starts
let vectorStore = null;
loadAndProcessData()
  .then((vs) => {
    vectorStore = vs;
    console.log('Data processed and vector store created');
  })
  .catch((error) => {
    console.error('Failed to create vector store:', error);
  });

// Function to perform a web search
async function webSearch(query) {
  try {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);
    const searchResults = $('.g')
      .map((i, el) => {
        const title = $(el).find('.r').text();
        const snippet = $(el).find('.s').text();
        return `${title}\n${snippet}`;
      })
      .get()
      .join('\n\n');
    return searchResults.slice(0, 1000); 
  } catch (error) {
    console.error('Error performing web search:', error);
    return '';
  }
}

// Function to fetch a summary from Wikipedia
async function wikipediaSearch(query) {
  try {
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    return response.data.extract || '';
  } catch (error) {
    console.error('Error fetching Wikipedia summary:', error);
    return '';
  }
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    const isCalendarQuery = lastMessage.content.toLowerCase().includes('calendar') || 
                            lastMessage.content.toLowerCase().includes('events');
    const isBusOrRouteQuery = lastMessage.content.toLowerCase().includes('bus') || 
                              lastMessage.content.toLowerCase().includes('route');

    let context = '';
    if (isCalendarQuery) {
      const events = await fetchSupabaseData();
      const month = 9; // September
      context = filterAndFormatEvents(events, month);
    } else if (vectorStore) {
      const relevantDocs = await vectorStore.similaritySearch(lastMessage.content, 5);
      context = relevantDocs.map((doc) => doc.pageContent).join('\n');
    } else {
      console.warn('Vector store not initialized');
    }

    // If it's a bus or route query and we don't have sufficient context from PDFs
    if (isBusOrRouteQuery && (!context || context.length < 500)) {
      console.log('Insufficient bus/route information from PDFs, fetching additional information');
      const webResults = await webSearch(`Mangalore ${lastMessage.content}`);
      context += `\n\n${webResults}`;
    }

    // For non-bus/route queries, add Wikipedia results if context is still insufficient
    if (!isBusOrRouteQuery && (!context || context.length < 500)) {
      console.log('Insufficient general context, fetching additional information');
      const wikiResults = await wikipediaSearch('Mangalore');
      context += `\n\n${wikiResults}`;
    }

    const generalInfo = `
Mangalore is a major port city on the west coast of India. It is located between the Arabian Sea and the Western Ghats mountain range.
Key facts about Mangalore:
- Population: Approximately 600,000
- Language: Kannada, Tulu, Konkani, and English are widely spoken
- Climate: Tropical monsoon climate
- Economy: Port-based economy, IT, and education are major sectors
- Nearby cities: Udupi (60 km north), Kasaragod (50 km south)
- Transportation: Well-connected by road, rail, air, and sea

Udupi is a city about 60 km north of Mangalore, famous for its Krishna Temple and cuisine.
Common modes of transport between Mangalore and nearby cities:
- Buses (public and private)
- Trains
- Taxis and car rentals
`;

    context += '\n' + generalInfo;

    const greeting = 'Hello! How can I assist you today?';

    let prompt;
    if (isCalendarQuery) {
      prompt = `${greeting} You are an AI assistant specialized in providing information about events in Mangalore city. Here are the events for September:

${context}

User's question: ${lastMessage.content}

Please provide a helpful and informative response about these events:`;
    } else {
      prompt = `${greeting} You are an AI assistant specialized in providing information about Mangalore city and nearby areas. Use the following context to answer the user's question. If the specific information isn't available, use your general knowledge about the area to provide a helpful response. Always maintain a confident and informative tone.

Context: ${context}

User's question: ${lastMessage.content}

Please provide a helpful and informative response:`;
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const formattedHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessageStream([{ text: prompt }]);
    const stream = GoogleGenerativeAIStream(result);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response('An error occurred while processing your request', { status: 500 });
  }
}