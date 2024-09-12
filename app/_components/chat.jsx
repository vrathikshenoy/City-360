'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: 'api/chat',
    onError: (e) => {
      console.log(e);
    },
  });

  const chatParent = useRef(null);

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col w-full h-screen bg-white pt-8">
      <header className="px-6 py-4 border-b w-full max-w-3xl mx-auto bg-gray-50 shadow-sm">
        <h1 className="text-3xl font-semibold text-center text-gray-800">Travel/Tour Guide</h1>
      </header>

      <section className="p-6">
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto items-center gap-3">
          <Input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="Ask me anything..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            type="submit"
          >
            Send
          </Button>
        </form>
      </section>

      <section className="container px-0 pb-10 flex flex-col flex-grow gap-4 mx-auto max-w-3xl">
        <ul ref={chatParent} className="p-4 flex-grow bg-gray-50 rounded-lg overflow-y-auto flex flex-col gap-4 shadow-inner">
          <AnimatePresence>
            {messages.map((m, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div
                  className={`rounded-lg p-3 shadow-md ${
                    m.role === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-200 text-gray-800'
                  } max-w-[70%]`}
                >
                  <p>{m.content}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>
    </main>
  );
}
