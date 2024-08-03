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

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const Dashboard = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY as string;

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
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
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const youtubeHash = searchParams.get("youtubeHash");
    const summaryHash = searchParams.get("summaryHash");

    if (youtubeHash) {
      const data = retrieveData(youtubeHash) as VideoResponse;
      setVideos(data.data.body);
    }

    if (summaryHash) {
      const data = retrieveData(summaryHash);
      setSummaryData(data as any);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(
        `/api/v1/getdiscuss?videoid=${video_id}`
      );
      if (response.status === 500) {
        alert("Something Went Wrong");
      }
      console.log("this is response : " + response.data);
      setBasicQuestion(response.data.basicQue);
      setTranscript(response.data.transcript);
      console.log(response);
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
          transition={{ type: "spring", stiffness: 100 }}>
          <summary
            className={`left-0 relative p-2 ${
              isOpen ? "rounded-l-md" : "rounded-md"
            } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${
              isOpen ? "justify-start" : "justify-center"
            }`}>
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />

            {showText && <span>New note</span>}
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
        <section className="relative border-2 border-gray-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          <menu className="flex justify-start border-b border-gray-200 ml-4">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  className={`px-4 py-2 cursor-pointer ${
                    activeTab === tab.name ? "border-b-2 border-blue-500" : ""
                  }`}
                  onClick={() => setActiveTab(tab.name)}>
                  {tab.label}
                </button>
              </li>
            ))}
          </menu>
          <div className="p-4">
            {[
              { tab: "summary", color: "bg-blue-400" },
              { tab: "video", color: "bg-red-400" },
              { tab: "qna", color: "bg-green-400" },
              { tab: "further-info", color: "bg-purple-400" },
              { tab: "action-items", color: "bg-black-400" },
            ].map(
              ({ tab, color }) =>
                activeTab === tab && (
                  <div className="h-200" key={tab}>
                    {activeTab === tab && tab === "video" ? (
                      <Card className={`w-full h-200 ${color} mb-4`}>
                        {/* Render video content if the tab is "video" */}
                        <div>
                          {Array.isArray(videos) && videos.length > 0 ? (
                            videos.map((video) => (
                              <div
                                key={video.id.videoId}
                                className="my-4 flex flex-row items-center mr-8">
                                <div className="flex flex-col">
                                  <h3 className="break-words max-w-lg">
                                    Title: {video.snippet.title}
                                  </h3>
                                  <p className="break-words max-w-lg mt-4">
                                    Description: {video.snippet.description}
                                  </p>
                                </div>
                                <iframe
                                  width="250"
                                  height="160"
                                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="my-4"></iframe>
                              </div>
                            ))
                          ) : (
                            <p>No videos found</p>
                          )}
                        </div>
                      </Card>
                    ) : (
                      <Card className={`w-full h-[200px] ${color} mb-4`} />
                    )}
                  </div>
                )
            )}
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className="w-full max-w-md h-auto relative">
                <CardHeader className="w-full flex flex-col items-center justify-start relative">
                  <CardTitle className="text-lg font-bold left-0 mr-auto">
                    {note.title}
                  </CardTitle>
                  <Button
                    className="absolute top-2 right-2"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(note.id)}>
                    <FaTimes />
                  </Button>
                </CardHeader>
                <CardContent className="h-auto overflow-y-auto">
                  <CardDescription>
                    <Textarea
                      placeholder="Enter your prompt"
                      className="w-full max-h-60 overflow-y-auto resize-y mt-2">
                      {note.content}
                    </Textarea>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </section>
        </section>
        <footer className=" absolute w-fit flex-col bottom-0 left-0 right-0 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ y: "90%" }}
            animate={{ y: isDrawerOpen ? 100 : "100%" }}
            transition={{ type: "spring", stiffness: 50 }}
            className={`
                flex flex-col items-center justify-center
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
