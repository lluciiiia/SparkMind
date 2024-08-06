'use client';

import { ContentLayout } from '@/components/dashboard/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Triangle } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import { FaCaretLeft, FaCaretRight, FaTimes } from 'react-icons/fa';
import { PiNoteBlankFill } from 'react-icons/pi';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';
import { z } from 'zod';
import { retrieveData } from '../../new/_components/hash-handler';
import {
  type Message,
  type Note,
  Props,
  VideoItem,
  Output,
  ParsedVideoData,
  Question,
  FurtherInfo,
} from "./interfaces";
import { useSearchParams } from "next/navigation";

//discuss with AI Imports
import DiscussionWithAI from "./discussion-with-ai";
import NoteCard from "./note";
import SummaryCard from "./cards/SummaryCard";
import VideoCard from "./cards/VideoCard";
import ActionCard from "./cards/actionCard";

import {
  API_KEY,
  genAI,
  model,
  generationConfig,
  safetySettings,
} from "@/app/api/v1/gemini-settings";

import axios from "axios";
import QuestionAndAnswer from "./cards/QuestionAndAnswer";
import { getOutputResponse } from "./api-handler";
import FurtherInfoCard from "./cards/FurtherInfo";

// import { search } from "../../../../server/services/search-recommendation.service";

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});

export const Dashboard = () => {
  if (!API_KEY) {
    console.error("Missing API key");
  }

  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [input, setInput] = useState<string>('');
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentQue, setFrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();

  const video_id = 'e4fab7ca-3853-444f-bde6-99b309055a22';

  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState(null);
  const [furtherInfoData, setFurtherInfoData] = useState<any[]>([]);

  const [todoList, setTodoList] = useState<any[]>([]);
  const [output, setOutput] = useState<Output | null>(null);
  const myLearningId = searchParams.get("id");

  useEffect(() => {
    const fetchData = async (myLearningId: string) => {
      try {
        const response = await getOutputResponse(myLearningId);
        setOutput(response.data.body[0]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (myLearningId) {
      fetchData(myLearningId);
    }

    return () => {
      console.log("Output retrieved");
    };
  }, []);

  useEffect(() => {
    if (output?.youtube) {
      const parsedData = JSON.parse(output.youtube) as ParsedVideoData;
      const videoItems = parsedData.items as VideoItem[];
      setVideos(videoItems);
    }

    if (output?.summary) {
      setSummaryData(output.summary as any);
    }

    if (output?.questions) {
      const parsedData = JSON.parse(output.questions) as Question[];
      setQuestions(parsedData);
    }

    if (output?.further_info) {
      const parsedData = JSON.parse(output.further_info) as FurtherInfo[];
      setFurtherInfoData(parsedData);
    }
  }, [output]);

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(`/api/v1/getdiscuss?videoid=${video_id}`);
      if (response.status >= 400) {
        alert('Something Went Wrong');
      }
      console.log('this is response : ' + response.data);
      setBasicQuestion(response.data.basicQue);
      setTranscript(response.data.transcript);
    };
    fetchDiscussData();
  }, [video_id]);

  useEffect(() => {
    const Session = genModel.startChat({
      history: [
        {
          role: 'user',
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

  const onSubmit = useCallback(async () => {
    try {
      if (input.trim()) {
        setLoading(true);
        const newMessage: Message = {
          id: Date.now(),
          text: input,
          sender: 'user',
        };
        setResponses((prevResponses) => [...prevResponses, newMessage]);

        const question = `Given the previous transcript, Based on the transcript, answer the user's question if related. If not, provide a general response. And here is the user's question: "${input}"`;

        const chatResponse = await chatSession.sendMessage(question);

        const aiMessage: Message = {
          id: Date.now(),
          text: chatResponse.response.text(),
          sender: 'ai',
        };
        setResponses((prevResponses) => [...prevResponses, aiMessage]);

        setLoading(false);
        setInput('');
      }
    } catch (error) {
      console.log(error);
    }
  }, [input, chatSession]);

  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      const rect = drawerRef.current?.getBoundingClientRect();
      if (
        rect &&
        (e.clientX < rect.left || e.clientX > rect.right) &&
        (e.clientY < rect.top || e.clientY > rect.bottom)
      ) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [drawerRef, isDrawerOpen, isOpen]);

  const tabs = [
    { name: 'summary', label: 'Summary' },
    { name: 'video', label: 'Video recommendation' },
    { name: 'qna', label: 'Q&A' },
    { name: 'further-info', label: 'Further Information' },
    { name: 'action-items', label: 'Action Items' },
  ];

  return (
    <>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative border-2 border-gray-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] bg-gray-200 rounded-3xl mt-[56px]">
          <menu className="flex justify-start border-b border-gray-200 min-h-40px">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  className={`px-6 py-2 cursor-pointer ${
                    activeTab === tab.name
                      ? "bg-navy text-white rounded-t-3xl"
                      : "text-gray"
                  }`}
                  onClick={() => setActiveTab(tab.name)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </menu>
          {[
            { tab: "summary" },
            { tab: "video" },
            { tab: "qna" },
            { tab: "further-info" },
            { tab: "action-items" },
          ].map(
            ({ tab }) =>
              activeTab === tab && (
                <div className="rounded-b-3xl bg-white h-full" key={tab}>
                  {activeTab === tab &&
                    tab === "summary" &&
                    summaryData != null && (
                      <SummaryCard summaryData={summaryData} />
                    )}
                  {activeTab === tab && tab === "video" && (
                    <VideoCard videos={videos} />
                  )}
                  {activeTab === tab &&
                    tab === "qna" &&
                    questions.length > 0 && (
                      <QuestionAndAnswer questions={questions} />
                    )}
                  {activeTab === tab &&
                    tab === "further-info" &&
                    furtherInfoData != null && (
                      <FurtherInfoCard furtherInfo={furtherInfoData} />
                    )}
                  {activeTab != tab && (
                    <Card
                      className={`w-full min-h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] overflow-y-auto rounded-b-3xl`}
                    />
                  )}
                </div>
              )
          )}
        </section>
        <footer className=" w-fit flex-col bottom-0 left-0 right-0 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ y: "90%" }}
            animate={{ y: isDrawerOpen ? 100 : "100%" }}
            transition={{ type: "spring", stiffness: 50 }}
            className={`
                absolute flex flex-col items-center justify-center bottom-6
              `}
            ref={drawerRef}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                    <Triangle
                      className={`w-5 h-5 bottom-0 ${
                        isDrawerOpen ? "rotate-180" : ""
                      }`}
                      fill="black"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  {isDrawerOpen ? "Close" : "Open"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Discuss with AI */}
            <DiscussionWithAI
              responses={responses}
              loading={loading}
              basicQuestion={basicQuestion}
              input={input}
              setInput={setInput}
              frequentQue={frequentQue}
              setFrequentQue={setFrequentQue}
              onSubmit={onSubmit}
              handleDiscussInputChange={handleDiscussInputChange}
            />
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
