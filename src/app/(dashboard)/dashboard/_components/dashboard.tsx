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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { Triangle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useRef, useState } from 'react';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PiNoteBlankFill } from 'react-icons/pi';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';
import { NewNoteSection } from '../../notes/_components';
import type { FurtherInfo, Note, Output, ParsedVideoData, Question, VideoItem } from './interfaces';

import { API_KEY } from '@/app/api/v1/gemini-settings';
import { usePersistedId } from '@/hooks';
import ActionCard from './cards/ActionCard';
import SummaryCard from './cards/SummaryCard';
import VideoCard from './cards/VideoCard';
import DiscussionWithAI from './discussion-with-ai';

import { createNote, deleteNote, editNote, getNotes } from '../../../_api-handlers/notes';

import { useQueryState } from 'nuqs';
import { toast } from 'sonner';
import { getOutput } from '../../../_api-handlers';
import FurtherInfoCard from './cards/FurtherInfo';
import QuestionAndAnswer from './cards/QuestionAndAnswer';

export const Dashboard = () => {
  if (!API_KEY) console.error('Missing API key');

  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState(null);
  const [furtherInfoData, setFurtherInfoData] = useState<any[]>([]);
  const [actionItemsData, setActionItemsData] = useState<{} | null>(null);
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

        const noteResponse = await getNotes(myLearningId);
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
      const videoItems = parsedData.items as VideoItem[];
      setVideos(videoItems);
    }

    if (output?.summary) {
      setSummaryData(output.summary as any);
    }

    if (output?.questions) {
      const parsedData = JSON.parse(output.questions) as Question[];
      console.log(parsedData);
      setQuestions(parsedData);
    }

    if (output?.further_info) {
      const parsedData = JSON.parse(output.further_info) as FurtherInfo[];
      setFurtherInfoData(parsedData);
    }

    if (output?.todo_task) {
      const parsedData = output.todo_task;
      setActionItemsData(parsedData ? parsedData : null);
    }
  }, [output]);

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

  const isLaptop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    const { success } = await deleteNote(id);
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
      return;
    }
    try {
      const response = await createNote(mylearning_id);
      if (response && response.data && response.data.body) {
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
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
    setIsLoading(false);
  };

  const handleEdit = async (selectedNote: Note) => {
    setIsLoading(true);
    const id = selectedNote.id;
    const updatedNote = {
      ...selectedNote,
      title: selectedNote.title ? selectedNote.title : 'New Note',
      content: selectedNote.content ? selectedNote.content : 'Start typing here...',
    };
    try {
      const response = await editNote(updatedNote.id, updatedNote.title, updatedNote.content);
      if (response.success) {
        setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
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
            className={`p-2 ${
              isOpen ? 'rounded-l-md' : 'rounded-l-md'
            } bg-navy text-white flex items-center cursor-pointer`}
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
        <section className="relative border-2 border-gray-300 rounded-3xl bg-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="relative inset-0 flex items-center justify-center bg-white bg-opacity-20 z-10 backdrop-blur-sm w-full h-full py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
            </div>
          ) : !dataFetched ? (
            <div className="p-4 text-center">
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
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.name
                        ? 'bg-navy text-white'
                        : 'text-gray-600 hover:bg-gray-300'
                    } ${isLaptop ? 'flex-1' : isTablet ? 'w-1/3' : 'w-1/2'} ${
                      activeTab === tab.name && 'rounded-t-xl'
                    }`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              <div className="p-4 sm:p-6 bg-white rounded-b-3xl min-h-[calc(100vh-300px)]">
                {activeTab === 'summary' && summaryData != null && (
                  <SummaryCard summaryData={summaryData} />
                )}
                {activeTab === 'video' && <VideoCard videos={videos} />}
                {activeTab === 'qna' && questions.length > 0 && (
                  <QuestionAndAnswer questions={questions} />
                )}
                {activeTab === 'further-info' && furtherInfoData != null && (
                  <FurtherInfoCard furtherInfo={furtherInfoData} />
                )}
                {activeTab === 'action-items' && (
                  <ActionCard
                    learningId={mylearning_id}
                    actionItemsData={actionItemsData ? actionItemsData : []}
                  />
                )}
              </div>
            </>
          )}
        </section>
        <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: isDrawerOpen ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 50 }}
            className="flex flex-col items-center w-full"
            ref={drawerRef}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center mb-2 focus:outline-none"
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  >
                    <Triangle className={`w-5 h-5 transform ${isDrawerOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>{isDrawerOpen ? 'Close' : 'Open'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="w-full">
              <DiscussionWithAI learningid={mylearning_id} />
            </div>
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
