import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';
const hi = process.env.NEXT_PUBLIC_GOOGLE_API_KEY; 

const genAI = new GoogleGenerativeAI(hi);

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: 'embedding-001',
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

async function loadAndProcessPDFs() {
  try {
    const pdfDirectory = path.join(process.cwd(), 'public', 'pdfs');
    const pdfFiles = await fs.readdir(pdfDirectory);
    
    let allDocs = [];
    for (const file of pdfFiles) {
      if (path.extname(file).toLowerCase() === '.pdf') {
        const filePath = path.join(pdfDirectory, file);
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        allDocs = allDocs.concat(docs);
      }
    }

    const splitter = new CharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.splitDocuments(allDocs);
    return await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
  } catch (error) {
    console.error('Error loading and processing PDFs:', error);
    return null;
  }
}

// Load the vector store once when the server starts
let vectorStore = null;
loadAndProcessPDFs()
  .then((vs) => {
    vectorStore = vs;
    console.log('PDFs processed and vector store created');
  })
  .catch((error) => {
    console.error('Failed to create vector store:', error);
  });

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
    return searchResults.slice(0, 1000); // Limit to first 1000 characters
  } catch (error) {
    console.error('Error performing web search:', error);
    return '';
  }
}

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

    let context = '';
    if (vectorStore) {
      const relevantDocs = await vectorStore.similaritySearch(lastMessage.content, 5);
      context = relevantDocs.map((doc) => doc.pageContent).join('\n');
    }

    if (!context || context.length < 500) {
      const webResults = await webSearch(`Mangalore ${lastMessage.content}`);
      const wikiResults = await wikipediaSearch('Mangalore');
      context += `\n\n${webResults}\n\n${wikiResults}`;
    }

    const greeting = 'Hello! How can I assist you today?';

    const prompt = `${greeting} You are an AI assistant specialized in providing information about Mangalore city. Use the following context to answer the user's question. If the context doesn't contain relevant information, use your general knowledge about Mangalore, but make it clear when you're doing so.

Context: ${context ? context : 'No specific information found in the provided documents.'}

User's question: ${lastMessage.content}

Please provide a helpful and informative response:`;

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
    return new Response('Something went wrong', { status: 500 });
  }
}