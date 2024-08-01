"use client";

import React, { useEffect, useCallback } from 'react';
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


//discuss with AI Imports
import { PlaceholdersAndVanishInput } from '@/components/ui/custom/placeholders-and-vanish-input';
import LoadingIndicator from '@/components/ui/custom/LoadingIndicator';

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

interface Transcript {
  id: number;
  text: string;
}

interface Message {
  id: number,
  text: string;
  sender: 'user' | 'ai';
}

interface Props {
  transcript: Transcript[];
}

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

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


  const [input, setInput] = useState<string>('');
  const [responses, setResponses] = useState<Message[]>([]);
  const [chatSession, setChatSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [frequentQue, setfrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();


  //Todo change video id to dynamic 
  const video_id = 'cfa0784f-d23c-4430-99b6-7851508c5fdf';

  useEffect(() => {
    const fetchDiscussData = async () => {
      const response = await axios.get(`/api/v1/getdiscuss?videoid=${video_id}`);
      if (response.status === 500) {
        alert('Something Goes Wrong');
      }
      console.log("this is response : " + response.data);
      setBasicQuestion(response.data.basicQue);
      setTranscript(response.data.transcript);
      console.log(response);
    }
    fetchDiscussData();
  }, [video_id]);

  useEffect(() => {
    const Session = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: transcript! }
          ]
        }
      ],
    });

    setChatSession(Session);

  }, [transcript]);

  useEffect(() => {
    if (frequentQue === true) {
      onSubmit();
      setfrequentQue(false);
    }
  }, [frequentQue]);

  const handleDiscussInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = useCallback(async () => {
    try {
      if (input.trim()) {

        setLoading(true);
        const newMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setResponses(prevResponses => [...prevResponses, newMessage]);

        const question = `Given the previous transcript, Based on the transcript, answer the user's question if related. If not, provide a general response. And here is the user's question: "${input}"`;

        const chatResponse = await chatSession.sendMessage(question);

        const aiMessage: Message = { id: Date.now(), text: chatResponse.response.text(), sender: 'ai' };
        setResponses(prevResponses => [...prevResponses, aiMessage]);

        setLoading(false);
        setInput('');
      }
    }
    catch (error) {
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

  const [fileType, setFileType] = useState<
    "image" | "video" | "audio" | "text"
  >();

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
            className={`left-0 relative p-2 ${isOpen ? "rounded-l-md" : "rounded-md"
              } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${isOpen ? "justify-start" : "justify-center"
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
            <li>
              <button
                className={`px-4 py-2 cursor-pointer ${activeTab === "summary" ? "border-b-2 border-blue-500" : ""
                  }`}
                onClick={() => setActiveTab("summary")}>
                Summary
              </button>
            </li>
            <li>
              <button
                className={`px-4 py-2 cursor-pointer ${activeTab === "video" ? "border-b-2 border-blue-500" : ""
                  }`}
                onClick={() => setActiveTab("video")}>
                Video recommendation
              </button>
            </li>
            <li>
              <button
                className={`px-4 py-2 cursor-pointer ${activeTab === "qna" ? "border-b-2 border-blue-500" : ""
                  }`}
                onClick={() => setActiveTab("qna")}>
                Q&A
              </button>
            </li>
            <li>
              <button
                className={`px-4 py-2 cursor-pointer ${activeTab === "further-info"
                  ? "border-b-2 border-blue-500"
                  : ""
                  }`}
                onClick={() => setActiveTab("further-info")}>
                Further Information
              </button>
            </li>
            <li>
              <button
                className={`px-4 py-2 cursor-pointer ${activeTab === "action-items"
                  ? "border-b-2 border-blue-500"
                  : ""
                  }`}
                onClick={() => setActiveTab("action-items")}>
                Action Items
              </button>
            </li>
          </menu>
          <div className="p-4">
            {activeTab === "summary" && (
              <div className="h-200">
                <Card className="w-full h-[200px] bg-blue-400 mb-4"></Card>
              </div>
            )}
            {activeTab === "video" && (
              <div className="h-200">
                <Card className="w-full h-[200px] bg-red-400 mb-4"></Card>
              </div>
            )}
            {activeTab === "qna" && (
              <div className="h-200">
                <Card className="w-full h-[200px] bg-green-400 mb-4"></Card>
              </div>
            )}
            {activeTab === "further-info" && (
              <div className="h-200">
                <Card className="w-full h-[200px] bg-purple-400 mb-4"></Card>
              </div>
            )}
            {activeTab === "action-items" && (
              <div className="h-200">
                <Card className="w-full h-[200px] bg-black-400 mb-4"></Card>
              </div>
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
            <Card
              className={`bottom-0 left-0 right-0  shadow-lg mx-auto ${!isLaptop
                ? "w-[700px] h-[400px]"
                : "w-[1000px] h-[600px] rounded-t-lg"
                }`}>
              <menu className="flex justify-start border-b border-gray-200 ml-4">
                <li>
                  <button className={"px-4 py-2"}>Discussion with Gemini AI</button>
                </li>
              </menu>
              <div className='h-full w-full flex flex-col items-center'>
                <div className="flex flex-col mt-3 mb-4  w-full max-w-4xl px-4 h-4/5 overflow-y-scroll no-scrollbar">
                  {responses.map((response, index) => (
                    response.sender === 'user' ?
                      (
                        <div className='mb-4 flex justify-end'>
                          <div className={"p-2 rounded bg-blue-500 inline-block"}>
                            {response.text}
                          </div>
                        </div>
                      ) : (
                        <div className='mb-4 flex justify-start' key={index}>
                          <div className={"p-2 text-black dark:text-white rounded bg-[#e6e6e6] dark:bg-gray-700 inline-block"}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {response.text}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )
                  ))}
                  {loading === true ? (
                    <div className='mb-4 flex justify-start'>
                      <div className={"p-2 rounded bg-gray-700 inline-block"}>
                        <LoadingIndicator />
                      </div>
                    </div>
                  ) : (<></>)
                  }
                </div>
                <div className='sticky bottom-0 h-2/5 w-full max-w-4xl bg-[#e6e6e6] dark:bg-[#1e293b] p-4 flex flex-col items-center rounded-t-lg'>
                  <div className='flex flex-row overflow-x-auto no-scrollbar'>
                    {basicQuestion.map((que, index) => (
                      <button key={index} onClick={() => {
                        setInput(que);
                        setfrequentQue(true);
                      }} className='bg-gray-600 mx-4 rounded-lg p-2 flex-shrink-0'>{que}</button>
                    ))}
                  </div>
                  <div className='mt-4 w-3/5'>
                    <PlaceholdersAndVanishInput
                      placeholders={[]}
                      onChange={handleDiscussInputChange}
                      onSubmit={onSubmit}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
