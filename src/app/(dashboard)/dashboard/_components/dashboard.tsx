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

  const isLaptop = useMediaQuery('(min-width: 1023px)');

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
      <div className="flex flex-col items-center justify-items-start absolute top-[80px] right-0 rounded-l-md rounded-r-none z-[100] w-fit">
        <motion.details
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          className="w-full"
          initial={{ width: 30 }}
          animate={{ width: isOpen ? '100%' : 50 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <summary
            className={`left-0 relative p-2 ${
              isOpen ? 'rounded-l-md' : 'rounded-md'
            } bg-navy text-white rounded-r-none w-full flex items-center justify-start ${
              isOpen ? 'justify-start' : 'justify-center'
            }`}
          >
            {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
            <PiNoteBlankFill size={24} />

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
        <Breadcrumb>
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
        <section className="relative border-2 border-gray-400 min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] bg-gray-200 rounded-3xl mt-[56px]">
          <menu className="flex justify-start border-b border-gray-200 min-h-40px">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  type="button"
                  className={`px-6 py-2 cursor-pointer ${
                    activeTab === tab.name ? 'bg-navy text-white rounded-t-3xl' : 'text-gray'
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </menu>
          {[
            { tab: 'summary' },
            { tab: 'video' },
            { tab: 'qna' },
            { tab: 'further-info' },
            { tab: 'action-items' },
          ].map(
            ({ tab }) =>
              activeTab === tab && (
                <div className="rounded-b-3xl bg-white h-full" key={tab}>
                  {activeTab === tab && tab === 'summary' && summaryData != null && (
                    <SummaryCard summaryData={summaryData} />
                  )}
                  {activeTab === tab && tab === 'video' && <VideoCard videos={videos} />}
                  {activeTab === tab && tab === 'qna' && questions.length > 0 && (
                    <QuestionAndAnswer questions={questions} />
                  )}
                  {activeTab === tab && tab === 'further-info' && furtherInfoData != null && (
                    <FurtherInfoCard furtherInfo={furtherInfoData} />
                  )}
                  {activeTab === tab && tab === 'action-items' && (
                    <ActionCard learningId={myLearningId} />
                  )}
                  {activeTab != tab && (
                    <Card
                      className={`w-full min-h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] overflow-y-auto rounded-b-3xl`}
                    />
                  )}
                </div>
              ),
          )}
        </section>
        <footer className=" w-fit flex-col bottom-0 left-0 right-0 mx-auto flex items-center justify-center">
          <motion.div
            initial={{ y: '90%' }}
            animate={{ y: isDrawerOpen ? 100 : '100%' }}
            transition={{ type: 'spring', stiffness: 50 }}
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
                    transition={{ type: 'spring', stiffness: 100 }}
                    className={`w-5 h-5 bottom-0 cursor-pointer mb-2`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDrawerOpen(!isDrawerOpen);
                    }}
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

            {/* Discuss with AI */}
            <DiscussionWithAI learningid={myLearningId} />
          </motion.div>
        </footer>
      </ContentLayout>
    </>
  );
};
