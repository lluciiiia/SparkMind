'use client';

import { Card } from "@/components/ui/card";
import LoadingIndicator from "@/components/ui/custom/LoadingIndicator";
import { PlaceholdersAndVanishInput } from "@/components/ui/custom/placeholders-and-vanish-input";
import axios from "axios";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "./interfaces"; // Adjust the path as needed

import { API_KEY, genAI, safetySettings } from "@/app/api/v1/gemini-settings";

interface DiscussionWithAIProps {
  learningid: string | null;
}

const DiscussionWithAI: React.FC<DiscussionWithAIProps> = ({ learningid }) => {
  if (!API_KEY) {
    console.error('Missing Google API key');
  }

  if (!learningid) {
    console.error('Missing Learning Key' + learningid);
  }

  const [input, setInput] = useState<string>("");
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentQue, setFrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    safetySettings,
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  const video_id = learningid;

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(
        `/api/v1/getdiscuss?videoid=${video_id}`,
      );
      if (response.status === 200) {
        console.log('this is response : ' + response.data);
        setBasicQuestion(response.data.basicQue);
        setTranscript(response.data.transcript);
      }
      console.log("Something goes Wrong in Discuss with ai feature");
    };
    fetchDiscussData();
  }, [video_id]);

  useEffect(() => {
    const Session = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: transcript! }],
        },
      ],
    });

    setChatSession(Session);
  }, [transcript]);

  useEffect(() => {
    if (frequentQue === true) {
      onSubmit();
      setFrequentQue(false);
    }
  }, [frequentQue]);

  const handleDiscussInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      try {
        event?.preventDefault();
        if (input.trim()) {
          setLoading(true);
          const newMessage: Message = {
            id: Date.now(),
            text: input,
            sender: "user",
          };
          setResponses((prevResponses) => [...prevResponses, newMessage]);

          const question = `Given the previous transcript, Based on the transcript, answer the user's question if related. If not, provide a general response. And here is the user's question: "${input}"`;

          const chatResponse = await chatSession.sendMessage(question);

          const aiMessage: Message = {
            id: Date.now(),
            text: chatResponse.response.text(),
            sender: "ai",
          };
          setResponses((prevResponses) => [...prevResponses, aiMessage]);

          setLoading(false);
          setInput("");
        }
      } catch (error) {
        console.log(error);
      }
    },
    [input, chatSession],
  );

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
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                onSubmit();
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DiscussionWithAI;
