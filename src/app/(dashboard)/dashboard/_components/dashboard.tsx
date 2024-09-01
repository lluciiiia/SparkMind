'use client';

import { notes as NotesMethods, getOutput } from '@/app/_api-handlers';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePersistedId } from '@/hooks';
import { format } from 'date-fns'; // Make sure to install date-fns if not already
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PiNoteBlankFill } from 'react-icons/pi';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';
import { NewNoteSection } from '../../notes/_components';
import ActionCard from './cards/ActionCard';
import FurtherInfoCard from './cards/FurtherInfo';
import QuestionAndAnswer from './cards/QuestionAndAnswer';
import SummaryCard from './cards/SummaryCard';
import VideoCard from './cards/VideoCard';
import DiscussionWithAI from './discussion-with-ai';

import type { FurtherInfo, Note, Output, ParsedVideoData, Question, VideoItem } from './interfaces';

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [furtherInfoData, setFurtherInfoData] = useState<FurtherInfo[]>([]);
  const [actionItemsData, setActionItemsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<Output | null>(null);
  const { id: mylearning_id, clearId: clearMyLearningId } = usePersistedId('mylearning_id');

  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [fetchTimeout, setFetchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const MAX_FETCH_ATTEMPTS = 3;
  const FETCH_RETRY_DELAY = 10000;

  useEffect(() => {
    const fetchData = async (myLearningId: string) => {
      if (dataFetched || fetchAttempts >= MAX_FETCH_ATTEMPTS) return;

      try {
        setIsLoading(true);
        const outputResponse = await getOutput(myLearningId);
        if (
          outputResponse.data &&
          outputResponse.data.body &&
          outputResponse.data.body.length > 0
        ) {
          setOutput(outputResponse.data.body[0]);
          setDataFetched(true);
        } else if (fetchAttempts < MAX_FETCH_ATTEMPTS - 1) {
          const newTimeout = setTimeout(() => {
            setFetchAttempts((prev) => prev + 1);
          }, FETCH_RETRY_DELAY);
          setFetchTimeout(newTimeout as NodeJS.Timeout);
        } else {
          toast.error('No output data available after multiple attempts');
        }

        const noteResponse = await NotesMethods.getNotes(myLearningId);
        setNotes(noteResponse.data || []);

        if (noteResponse.data.length === 0 && !dataFetched) {
          toast.info('No notes found for this learning ID, creating a new one');
          handleCreate();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (fetchAttempts < MAX_FETCH_ATTEMPTS - 1) {
          const newTimeout = setTimeout(() => {
            setFetchAttempts((prev) => prev + 1);
          }, FETCH_RETRY_DELAY);
          setFetchTimeout(newTimeout as NodeJS.Timeout);
        } else {
          toast.error('Failed to fetch data after multiple attempts. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (mylearning_id && !dataFetched) {
      fetchData(mylearning_id);
    } else if (!mylearning_id) {
      toast.error('No learning ID available. Please select a learning resource.');
    }

    return () => {
      if (fetchTimeout) {
        clearTimeout(fetchTimeout);
      }
    };
  }, [mylearning_id, fetchAttempts, dataFetched]);

  useEffect(() => {
    if (output?.youtube) {
      const parsedData = JSON.parse(output.youtube) as ParsedVideoData;
      setVideos(parsedData.items);
    }

    if (output?.summary) {
      setSummaryData(output.summary as any);
    }

    if (output?.questions) {
      const parsedQuestions = JSON.parse(output.questions) as Question[];
      setQuestions(parsedQuestions);
    }

    if (output?.further_info) {
      const parsedFurtherInfo = JSON.parse(output.further_info) as FurtherInfo[];
      setFurtherInfoData(parsedFurtherInfo);
    }

    if (output?.todo_task) {
      const parsedActionItems = output.todo_task;
      setActionItemsData(parsedActionItems);
    }
  }, [output]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowText(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLaptop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const { success } = await NotesMethods.deleteNote(id);
    if (success) {
      setNotes(notes.filter((note) => note.id !== id));
    } else {
      toast.error('Failed to delete note. Please try again.');
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    setIsLoading(true);
    if (!mylearning_id) {
      toast.error('No learning ID available');
      setIsLoading(false);
      return;
    }
    try {
      const response = await NotesMethods.createNote(mylearning_id);
      if (response.error) {
        toast.error(response.error);
      } else if (response && response.data && response.data.body) {
        const newNote = {
          id: response.data.body.id,
          title: response.data.body.title,
          content: response.data.body.content,
          createdAt: response.data.body.created_at,
        };
        setNotes((prevNotes) => [...prevNotes, newNote]);
        toast.success('Note created successfully');
      } else {
        toast.error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
    setIsLoading(false);
  };

  const handleEdit = async (selectedNote: Note) => {
    setIsLoading(true);
    const updatedNote = {
      ...selectedNote,
      title: selectedNote.title || 'New Note',
      content: selectedNote.content || 'Start typing here...',
    };
    try {
      const response = await NotesMethods.editNote(
        updatedNote.id,
        updatedNote.title,
        updatedNote.content,
      );
      if (response.success) {
        setNotes(notes.map((note) => (note.id === selectedNote.id ? updatedNote : note)));
        setIsDrawerOpen(false);
      } else {
        toast.error('Failed to edit note. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to edit note. Please try again.');
    }
    setIsLoading(false);
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
      <div className="fixed top-20 right-0 z-50">
        <motion.details
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          className="w-full"
          initial={{ width: 30 }}
          animate={{ width: isOpen ? 'auto' : 50 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <summary
            className={`p-2 ${isOpen ? 'rounded-l-md' : 'rounded-l-md'} bg-navy text-white flex items-center cursor-pointer`}
          >
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} className="ml-2" />
            {showText && <span className="ml-4">New note</span>}
          </summary>
          <NewNoteSection
            handleCreate={handleCreate}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            notes={notes}
          />
        </motion.details>
      </div>
      <ContentLayout title="Dashboard">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section
          ref={contentRef}
          className="relative border-2 border-gray-300 rounded-3xl bg-gray-100 overflow-hidden mb-24"
        >
          {isLoading ? (
            <div className="relative inset-0 flex items-center justify-center bg-white bg-opacity-20 z-10 backdrop-blur-sm w-full h-full py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
            </div>
          ) : !dataFetched ? (
            <div className="p-4 text-center text-navy">
              {fetchAttempts >= MAX_FETCH_ATTEMPTS
                ? 'Failed to load data. Please try again later.'
                : 'Attempting to fetch data...'}
            </div>
          ) : (
            <>
              <nav className="flex flex-wrap justify-start border-b border-gray-300 bg-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    type="button"
                    className={`
                      px-4 py-2 text-sm font-medium transition-colors duration-200
                      ${activeTab === tab.name ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-300'}
                      ${isLaptop ? 'flex-1' : isTablet ? 'w-1/3' : 'w-1/2'}
                      ${activeTab === tab.name ? 'rounded-t-xl' : ''}
                    `.trim()}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 sm:p-6 bg-white rounded-b-3xl min-h-[calc(100vh-300px)]">
                {activeTab === 'summary' && summaryData && (
                  <SummaryCard summaryData={summaryData} />
                )}
                {activeTab === 'video' && <VideoCard videos={videos} />}
                {activeTab === 'qna' && Array.isArray(questions) && questions.length > 0 && (
                  <QuestionAndAnswer questions={questions} />
                )}
                {activeTab === 'further-info' && furtherInfoData.length > 0 && (
                  <FurtherInfoCard furtherInfo={furtherInfoData} />
                )}
                {activeTab === 'action-items' && (
                  <ActionCard learningId={mylearning_id} actionItemsData={actionItemsData || []} />
                )}
              </div>
            </>
          )}
        </section>
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-none mx-auto">
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-none shadow-lg rounded-t-xl overflow-hidden mx-auto"
                style={{
                  width: contentRef.current ? contentRef.current.offsetWidth : '100%',
                  left: contentRef.current ? contentRef.current.offsetLeft : 0,
                  maxHeight: 'calc(100vh - 100px)',
                }}
                ref={drawerRef}
              >
                <div className="bg-none">
                  <DiscussionWithAI learningid={mylearning_id} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center pb-2 pt-2 bg-none rounded-t-xl shadow-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-navy text-white hover:bg-navy/90"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  >
                    {isDrawerOpen ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                    <span className="sr-only">{isDrawerOpen ? 'Close drawer' : 'Open drawer'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isDrawerOpen ? 'Close' : 'Open'} Discussion with Gemini AI
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </footer>
      </ContentLayout>
    </>
  );
};

export default Dashboard;
