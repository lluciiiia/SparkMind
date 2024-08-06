'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoadingIndicator from '@/components/ui/custom/LoadingIndicator';
import { PlaceholdersAndVanishInput } from '@/components/ui/custom/placeholders-and-vanish-input';
import { Textarea } from '@/components/ui/textarea';
import type React from 'react';
import { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from './interfaces'; // Adjust the path as needed

interface DiscussionWithAIProps {
  responses: Message[];
  loading: boolean;
  basicQuestion: string[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  frequentQue: boolean;
  setFrequentQue: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
  handleDiscussInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DiscussionWithAI: React.FC<DiscussionWithAIProps> = ({
  responses,
  loading,
  basicQuestion,
  input,
  setInput,
  frequentQue,
  setFrequentQue,
  onSubmit,
  handleDiscussInputChange,
}) => {
  return (
    <Card className="bottom-0 left-0 right-0 shadow-lg mx-auto w-[1000px] h-[600px] rounded-t-lg dark:border-1 dark:border-gray-200">
      <menu className="flex justify-start border-b border-gray-200 ml-4">
        <li>
          <button className="px-4 py-2">Discussion with Gemini AI</button>
        </li>
      </menu>
      <div className="h-full w-full flex flex-col items-center">
        <div className="flex flex-col mt-3 mb-4 w-full max-w-4xl px-4 h-4/5 overflow-y-scroll no-scrollbar">
          {responses.map((response, index) =>
            response.sender === 'user' ? (
              <div className="mb-4 flex justify-end" key={index}>
                <div className="p-2 rounded bg-gray-200 inline-block dark:text-black">
                  {response.text}
                </div>
              </div>
            ) : (
              <div className="mb-4 flex justify-start" key={index}>
                <div className="p-2 text-black dark:text-white rounded bg-gray-400 inline-block">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{response.text}</ReactMarkdown>
                </div>
              </div>
            ),
          )}
          {loading && (
            <div className="mb-4 flex justify-start">
              <div className="p-4 rounded bg-navy inline-block">
                <LoadingIndicator />
              </div>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 h-2/5 w-full max-w-4xl p-4 flex flex-col items-center rounded-t-lg mb-8">
          <div className="flex flex-row overflow-x-auto no-scrollbar">
            {basicQuestion !== undefined &&
              basicQuestion.map((que, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInput(que);
                    setFrequentQue(true);
                  }}
                  className="bg-gray-200 mx-4 rounded-lg p-2 flex-shrink-0 dark:text-black"
                >
                  {que}
                </button>
              ))}
          </div>
          <div className="mt-4 w-3/5 ">
            <PlaceholdersAndVanishInput
              placeholders={[]}
              onChange={handleDiscussInputChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiscussionWithAI;
