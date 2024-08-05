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
import { useSearchParams } from 'next/navigation';
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
  Transcript,
  type VideoItem,
  type VideoResponse,
} from './interfaces';

import LoadingIndicator from '@/components/ui/custom/LoadingIndicator';
import { PlaceholdersAndVanishInput } from '@/components/ui/custom/placeholders-and-vanish-input';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

const schema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
});

export const Dashboard = () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY as string;

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
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
  const [frequentQue, setfrequentQue] = useState<boolean>(false);

  const [basicQuestion, setBasicQuestion] = useState<[]>([]);
  const [transcript, setTranscript] = useState<string | undefined>();

  const video_id = 'e4fab7ca-3853-444f-bde6-99b309055a22';

  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [summaryData, setSummaryData] = useState(null);

  useEffect(() => {
    const youtubeHash = searchParams.get('youtubeHash');
    const summaryHash = searchParams.get('summaryHash');

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
      const response = await axios.get(`/api/v1/getdiscuss?videoid=${video_id}`);
      if (response.status >= 400) {
        alert('Something Went Wrong');
      }
      console.log('this is response : ' + response.data);
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

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreate = (values: z.infer<typeof schema>) => {
    const newNote = {
      id: Date.now().toString(),
      title: values.title,
      content: '',
      createdAt: new Date(),
    };
    setNotes([...notes, newNote]);
    setIsDrawerOpen(false);
  };

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
        <section
          className={`
            flex flex-row items-center justify-start
          `}
        >
          <div>
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
            <motion.section
              initial={{ height: 'calc(100vh-56px-64px-20px-24px-56px-48px)' }}
              animate={{
                height: isDrawerOpen
                  ? 'calc(100vh-56px-64px-20px-24px-56px-48px-200px)'
                  : 'calc(100vh-56px-64px-20px-24px-56px-48px)',
              }}
              transition={{ type: 'spring', stiffness: 100 }}
              className={`
                  relative border-2 border-gray-400 
                  rounded-md mt-[56px]
                `}
            >
              <menu className="flex justify-start ml-4 border-b border-gray-200">
                {tabs.map((tab) => (
                  <li key={tab.name}>
                    <button
                      className={`px-4 py-2 cursor-pointer ${
                        activeTab === tab.name ? 'border-b-2 border-blue-500' : ''
                      }`}
                      onClick={() => setActiveTab(tab.name)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </menu>
              <div className="p-4">
                {[
                  { tab: 'summary', color: 'bg-blue-400' },
                  { tab: 'video', color: 'bg-red-400' },
                  { tab: 'qna', color: 'bg-green-400' },
                  { tab: 'further-info', color: 'bg-purple-400' },
                  { tab: 'action-items', color: 'bg-black-400' },
                ].map(
                  ({
                    tab,
                    color,
                  }: {
                    tab: string;
                    color: string;
                  }) =>
                    activeTab === tab && (
                      <div className="h-200" key={tab}>
                        {activeTab === tab && tab === 'video' ? (
                          <Card className={`w-full h-200 ${color} mb-4`}>
                            <div>
                              {Array.isArray(videos) && videos.length > 0 ? (
                                videos.map((video) => (
                                  <div
                                    key={video.id.videoId}
                                    className="flex flex-row items-center my-4 mr-8"
                                  >
                                    <div className="flex flex-col">
                                      <h3 className="max-w-lg break-words">
                                        Title: {video.snippet.title}
                                      </h3>
                                      <p className="max-w-lg mt-4 break-words">
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
                                      className="my-4"
                                    ></iframe>
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
                    ),
                )}
              </div>
              {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {notes.map((note) => (
                  <Card key={note.id} className="relative w-full h-auto max-w-md">
                    <CardHeader className="relative flex flex-col items-center justify-start w-full">
                      <CardTitle className="left-0 mr-auto text-lg font-bold">{note.title}</CardTitle>
                      <Button
                        className="absolute top-2 right-2"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(note.id)}
                      >
                        <FaTimes />
                      </Button>
                    </CardHeader>
                    <CardContent className="h-auto overflow-y-auto">
                      <CardDescription>
                        <Textarea
                          placeholder="Enter your prompt"
                          className="w-full mt-2 overflow-y-auto resize-y max-h-60"
                        >
                          {note.content}
                        </Textarea>
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </section> */}
            </motion.section>
            <motion.footer
              className={`relative left-0 right-0 flex flex-col items-center justify-center mx-auto w-fit h-fit bottom-0`}
            >
              <motion.div
                initial={{ y: '90%' }}
                animate={{ y: isDrawerOpen ? 100 : '100%' }}
                transition={{ type: 'spring', stiffness: 50 }}
                className={`
                flex flex-col items-center justify-center relative
              `}
                ref={drawerRef}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                        className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                      >
                        <Triangle
                          className={`w-5 h-5 bottom-0 ${isDrawerOpen ? 'rotate-180' : ''}`}
                          fill="black"
                        />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>{isDrawerOpen ? 'Close' : 'Open'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Card
                  className={`bottom-0 left-0 right-0  shadow-lg mx-auto ${
                    !isLaptop ? 'w-[700px] h-[400px]' : 'w-[1000px] h-[600px] rounded-t-lg'
                  }`}
                >
                  <menu className="flex justify-start ml-4 border-b border-gray-200">
                    <li>
                      <p className={'px-4 py-2'}>Discussion with Gemini AI</p>
                    </li>
                  </menu>
                  <div className="flex flex-col items-center w-full h-full">
                    <div className="flex flex-col w-full max-w-4xl px-4 mt-3 mb-4 overflow-y-scroll h-4/5 no-scrollbar">
                      {responses.map((response, index) =>
                        response.sender === 'user' ? (
                          <div className="flex justify-end mb-4">
                            <div className={'p-2 rounded bg-blue-500 inline-block'}>
                              {response.text}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start mb-4" key={index}>
                            <div
                              className={
                                'p-2 text-black dark:text-white rounded bg-[#e6e6e6] dark:bg-gray-700 inline-block'
                              }
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {response.text}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ),
                      )}
                      {loading === true ? (
                        <div className="flex justify-start mb-4">
                          <div className={'p-2 rounded bg-gray-700 inline-block'}>
                            <LoadingIndicator />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="sticky bottom-0 h-2/5 w-full max-w-4xl bg-[#e6e6e6] dark:bg-[#1e293b] p-4 flex flex-col items-center rounded-lg">
                      <div className="flex flex-row overflow-x-auto no-scrollbar">
                        {basicQuestion.map((que, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInput(que);
                              setfrequentQue(true);
                            }}
                            className="flex-shrink-0 p-2 mx-4 bg-gray-600 rounded-lg"
                          >
                            {que}
                          </button>
                        ))}
                      </div>
                      <div className="w-3/5 mt-4">
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
            </motion.footer>
          </div>
          {/* <NewNoteContainer
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showText={showText}
            handleCreate={handleCreate}
            notes={notes}
          /> */}
        </section>
      </ContentLayout>
    </>
  );
};
