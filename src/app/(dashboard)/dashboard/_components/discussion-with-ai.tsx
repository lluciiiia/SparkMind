'use client';

import { API_KEY, genAI, safetySettings } from '@/app/api/v1/gemini-settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Bot, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface DiscussionWithAIProps {
  learningid: string | null;
}

const DiscussionWithAI: React.FC<DiscussionWithAIProps> = ({ learningid }) => {
  const [input, setInput] = useState<string>('');
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [basicQuestions, setBasicQuestions] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!API_KEY) {
      console.error('Missing Google API key');
      toast.error('API key is missing. Please check your configuration.');
    }

    if (!learningid) {
      console.error('Missing Learning ID');
      toast.error('Learning ID is missing. Please select a learning resource.');
    }
  }, []);

  useEffect(() => {
    const fetchDiscussData = async () => {
      try {
        const response = await axios.get(`/api/v1/discussions?videoid=${learningid}`);
        if (response.status === 200) {
          setBasicQuestions(response.data.basicQue);
          setTranscript(response.data.transcript);
        } else {
          throw new Error('Failed to fetch discussion data');
        }
      } catch (error) {
        console.error('Error fetching discussion data:', error);
        toast.error('Failed to load discussion data. Please try again later.');
      }
    };
    if (learningid) {
      fetchDiscussData();
    }
  }, [learningid]);

  useEffect(() => {
    if (transcript) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro',
        safetySettings,
      });
      const session = model.startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        },
        history: [
          {
            role: 'user',
            parts: [{ text: transcript }],
          },
        ],
      });
      setChatSession(session);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [responses]);

  const handleSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      if (!input.trim() || !chatSession) return;

      setLoading(true);
      const newMessage: Message = { id: Date.now(), text: input, sender: 'user' };
      setResponses((prev) => [...prev, newMessage]);
      setInput('');

      try {
        const question = `Based on the transcript or summary, answer the user's question if related. If not, provide a general response: "${input}"`;
        const chatResponse = await chatSession.sendMessage(question);
        const aiMessage: Message = {
          id: Date.now(),
          text: await chatResponse.response.text(),
          sender: 'ai',
        };
        setResponses((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error in AI response:', error);
        toast.error('Failed to get AI response. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [input, chatSession],
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg shadow-md">
      <div className="bg-navy text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">Discussion with Gemini AI</h2>
      </div>
      <ScrollArea className="flex-grow mb-4 p-4">
        {responses.map((response) => (
          <div
            key={response.id}
            className={`mb-4 flex ${response.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] ${
                response.sender === 'user'
                  ? 'bg-navy text-white'
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              {response.sender === 'user' ? (
                <User className="inline-block mr-2 h-4 w-4" />
              ) : (
                <Bot className="inline-block mr-2 h-4 w-4" />
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{response.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="p-4 bg-white border-t border-gray-200">
        <ScrollArea className="whitespace-nowrap mb-4">
          <div className="flex space-x-2">
            {basicQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(question)}
                className="text-xs flex-shrink-0 bg-gray-100 text-navy hover:bg-navy hover:text-white"
              >
                {question}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow mr-2 border-gray-300 focus:border-navy focus:ring-navy"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-navy text-white hover:bg-navy/90"
          >
            {loading ? 'Sending...' : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionWithAI;
