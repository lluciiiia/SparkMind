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
import { Card } from '@/components/ui/card';
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

import ActionCard from './cards/ActionCard';
import SummaryCard from './cards/SummaryCard';
import VideoCard from './cards/VideoCard';
import DiscussionWithAI from './discussion-with-ai';

import { API_KEY } from '@/app/api/v1/gemini-settings';

import { createNote, deleteNote, editNote, getNotes } from '../../../api-handlers/notes';

import { getOutput } from '../../../api-handlers/api-handler';
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

  const searchParams = useSearchParams();
  const [videos, setVideos] = useState<VideoItem[] | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState(null);
  const [furtherInfoData, setFurtherInfoData] = useState<any[]>([]);
  const [actionItemsData, setActionItemsData] = useState<{} | null>(null);

  const [output, setOutput] = useState<Output | null>(null);
  const myLearningId = searchParams.get('id');

  useEffect(() => {
    const fetchData = async (myLearningId: string) => {
      try {
        const outputResponse = await getOutput(myLearningId);
        setOutput(outputResponse.data.body[0]);

        const noteResponse = await getNotes(myLearningId);

        setNotes(noteResponse.data.body);
      } catch (error) {
        throw new Error('Error fetching data : ' + (error as Error).message);
      }
    };

    if (myLearningId) fetchData(myLearningId);

    return () => {
      console.log('Output retrieved');
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
    const response = await deleteNote(id);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreate = async () => {
    if (!myLearningId) return;
    const response = await createNote(myLearningId);
    const newNote = {
      id: response.data.body[0].id,
      title: response.data.body[0].title,
      content: response.data.body[0].content,
      createdAt: response.data.body[0].created_at,
    };
    setNotes([...notes, newNote]);
    setIsDrawerOpen(false);
  };

  const handleEdit = async (selectedNote: Note) => {
    const id = selectedNote.id;
    const updatedNote = {
      ...selectedNote,
      title: selectedNote.title ? selectedNote.title : 'Undefined',
      content: selectedNote.content,
    };
    const response = await editNote(updatedNote.id, updatedNote.title, updatedNote.content);
    setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
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
          <nav className="flex flex-wrap justify-start border-b border-gray-300 bg-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.name ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-300'
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
                learningId={myLearningId}
                actionItemsData={actionItemsData ? actionItemsData : []}
              />
            )}
          </div>
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
              <DiscussionWithAI learningid={myLearningId} />
            </div>
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
