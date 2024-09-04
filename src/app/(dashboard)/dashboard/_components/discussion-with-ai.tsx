'use client';

import { API_KEY, genAI, safetySettings } from '@/app/api/v1/gemini-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { Bot, Check, Copy, Loader2, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

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
  const [responses, setResponses, removeResponses] = useLocalStorage<Message[]>(
    `chat-responses-${learningid}`,
    [],
  );
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [basicQuestions, setBasicQuestions] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
      setIsLoadingQuestions(true);
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
      } finally {
        setIsLoadingQuestions(false);
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
    [input, chatSession, setResponses],
  );

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <Card className="flex flex-col h-full bg-background/30 backdrop-blur-md border border-border rounded-xl shadow-lg overflow-hidden">
      <CardHeader className="bg-muted/50 backdrop-blur-sm border-b border-border py-2 sr-only">
        <CardTitle className="text-sm text-foreground">Discussion with Gemini AI</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col">
        <ScrollArea className="flex-grow h-[calc(100vh-300px)]">
          <div className="p-4 space-y-4 min-h-full mt-5">
            {responses.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No messages yet. Start a conversation!
              </div>
            )}
            {responses.map((response) => (
              <div
                key={response.id}
                className={`flex ${response.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] text-sm ${
                    response.sender === 'user'
                      ? 'bg-primary dark:text-navy text-white'
                      : 'bg-secondary text-secondary-foreground'
                  } relative group`}
                >
                  {response.sender === 'user' ? (
                    <User className="inline-block mr-2 h-4 w-4" />
                  ) : (
                    <Bot className="inline-block mr-2 h-4 w-4" />
                  )}
                  <ReactMarkdown className="inline" remarkPlugins={[remarkGfm]}>
                    {response.text}
                  </ReactMarkdown>
                  {response.sender === 'ai' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(response.text, response.id)}
                    >
                      {copiedId === response.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-border bg-muted/50 backdrop-blur-sm">
          <ScrollArea className="h-20 mb-4">
            <div className="flex flex-wrap gap-2">
              {isLoadingQuestions ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="ml-2 text-primary text-sm">Loading questions...</span>
                </div>
              ) : basicQuestions.length > 0 ? (
                basicQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs bg-background text-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    {question}
                  </Button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No suggested questions available.
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-grow bg-background text-foreground placeholder-muted-foreground"
            />
            <Button
              type="submit"
              size="sm"
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Sending...' : <Send className="h-4 w-4" />}
            </Button>
          </form>
          <Button
            onClick={removeResponses}
            size="sm"
            variant="outline"
            className="mt-4 w-full text-sm"
          >
            Clear Chat History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscussionWithAI;
