"use client";

import React, { useEffect, useCallback } from "react";
import { ContentLayout } from "@/components/dashboard/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Triangle } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { FaCaretLeft, FaCaretRight, FaTimes } from "react-icons/fa";
import { PiNoteBlankFill } from "react-icons/pi";
import { useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";
import { z } from "zod";
import { NewNoteSection } from "./new-note";
import {
  Transcript,
  Message,
  Props,
  Note,
  VideoItem,
  VideoResponse,
} from "./interfaces";
import { retrieveData } from "../../new/_components/hash-handler";
import { useSearchParams } from "next/navigation";

//discuss with AI Imports
import { PlaceholdersAndVanishInput } from "@/components/ui/custom/placeholders-and-vanish-input";
import LoadingIndicator from "@/components/ui/custom/LoadingIndicator";
import DiscussionWithAI from "./discussion-with-ai";
import NoteCard from "./note";
import VideoCard from "./cards/video-recommendation";
import ActionCard from "./cards/actionCard";

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import {
  API_KEY,
  genAI,
  model,
  generationConfig,
  safetySettings,
} from "@/app/api/v1/gemini-settings";

import axios from "axios";
import QuestionAndAnswer from "./cards/QuestionAndAnswer";
import { create } from "domain";
import { buildQuiz } from "@/app/api/v1/create-quiz/route";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const Dashboard = () => {
  //const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY as string;
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
  const [activeTab, setActiveTab] = useState("summary");
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [input, setInput] = useState<string>("");
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentQue, setFrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();

  //Todo change video id to dynamic
  const video_id = "cfa0784f-d23c-4430-99b6-7851508c5fdf";

  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState(null);

  const [todoList, setTodoList] = useState<any[]>([]);

  useEffect(() => {
    console.log("THE SEARCH PARAMS", searchParams);
    const youtubeHash = searchParams.get("youtubeHash");
    const summaryHash = searchParams.get("summaryHash");
    const input = searchParams.get("input");
    console.log("in[itt", input);
    console.log("THE YOUTUBE HASH", youtubeHash);

    if (youtubeHash) {
      const data = retrieveData(youtubeHash) as VideoResponse;

      if (data) {
        setVideos(data.data.body);
      }
    }

    if (summaryHash) {
      const data = retrieveData(summaryHash);
      setSummaryData(data as any);
    }

    if (input) {
      console.log("THE INPUT", input);
      createQuiz(input);
    }

    

  }, [searchParams]);

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(
        `/api/v1/getdiscuss?videoid=${video_id}`,
      );
      if (response.status === 500) {
        alert("Something Went Wrong");
      }
      console.log("this is response : " + response.data);
      setBasicQuestion(response.data.basicQue);
      console.log("the BASIC QUESTIONS", response.data.basicQue);
      setTranscript(response.data.transcript);
      console.log(response);
    };
    fetchDiscussData();
  }, [video_id]);

  useEffect(() => {
    const Session = genModel.startChat({
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

  const createQuiz = async (query: string) => {
    console.log("THE QUERY", query);
    buildQuiz(query).then((quiz) => {
      console.log("THE QUIZ", quiz);
      if (quiz) {
        setQuestions(quiz);
      }
    });
  };

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
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [drawerRef, isDrawerOpen, isOpen]);

  const isLaptop = useMediaQuery("(min-width: 1023px)");

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreate = (values: z.infer<typeof schema>) => {
    const newNote = {
      id: Date.now().toString(),
      title: values.title,
      content: "",
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    setIsDrawerOpen(false);
  };

  const tabs = [
    { name: "summary", label: "Summary" },
    { name: "video", label: "Video recommendation" },
    { name: "qna", label: "Q&A" },
    { name: "further-info", label: "Further Information" },
    { name: "action-items", label: "Action Items" },
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <motion.details
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          className="w-full"
          initial={{ width: 30 }}
          animate={{ width: isOpen ? "100%" : 50 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <summary
            className={`left-0 relative p-2 ${isOpen ? "rounded-l-md" : "rounded-md"
              } bg-navy text-white rounded-r-none w-full flex items-center justify-start ${isOpen ? "justify-start" : "justify-center"
              }`}
          >
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />

            {showText && <span className="ml-4">New note</span>}
          </summary>
          <NewNoteSection handleCreate={handleCreate} notes={notes} />
        </motion.details>
      </div>
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
                  className={`px-6 py-2 cursor-pointer ${activeTab === tab.name
                    ? "bg-navy text-white rounded-t-3xl"
                    : "text-gray"
                    }`}
                  onClick={() => setActiveTab(tab.name)}
                >
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
                <div className="rounded-t-3xl bg-white h-full" key={tab}>
                  {activeTab === tab && tab === "video" && (
                    <VideoCard videos={videos} />
                  )}
                  {activeTab === tab && tab === "qna" && (
                    <QuestionAndAnswer questions={questions} />
                  )}{" "}
                  {activeTab === tab && tab === "action-items" && (
                    <ActionCard videos={videos} />
                  )}
                  {activeTab != tab && (
                    <Card
                      className={`w-full min-h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] overflow-y-auto rounded-t-3xl`}
                    />
                  )}
                </div>
              ),
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
            ref={drawerRef}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  >
                    <Triangle
                      className={`w-5 h-5 bottom-0 ${isDrawerOpen ? "rotate-180" : ""
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
