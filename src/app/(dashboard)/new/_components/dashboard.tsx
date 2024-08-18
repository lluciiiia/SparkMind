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
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';

import { processDefaultTitle, saveOutput } from '../../../api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { InputModal } from './InputModal';

export const NewDashboard = () => {
  const searchParams = useSearchParams();
  const myLearningId = searchParams.get('id');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [_showText, setShowText] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleContentChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleKeywordsChange = (event: any) => {
    setKeywords(event.target.value);
  };

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'text' | 'keywords'>();

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const pathURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setObjectURL(pathURL);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (myLearningId !== null) {
        formData.append('learningid', myLearningId);
      }

      const res = await fetch('/api/v1/extract-transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      // @ts-ignore trust me bro
      const data = (await res.json()) as any;
      console.log(data);

      // right now not usefull to display the transcript
      // setFetchedTranscript(data.transcription);
      // setKeywords(data.keywordsArr);

      //const value = { 'title': 'Video File' };

      // handleCreate(value);

      //clean up old setState
      setSelectedFile(null);
      setObjectURL(null);
      setFileType(undefined);

      return data.keywordsArr;
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUpload = async (input: any, myLearningId: string) => {
    try {
      await saveOutput(input, myLearningId);
      await processDefaultTitle(myLearningId);

      router.push(`/dashboard?id=${myLearningId}`);
    } catch (err: any) {
      console.error(err);
    }
  };

  const submitChanges = async () => {
    try {
      setIsLoading(true);

      if (!myLearningId) return;

      let input;
      if (fileType === 'video') {
        const keyWordsArray = await handleVideoUpload();
        input = keyWordsArray.toString();
      } else if (fileType == 'text') {
        input = content;
      } else if (fileType == 'keywords') {
        input = keywords;
      }

      await handleUpload(input, myLearningId);
    } catch (err) {
      throw new Error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContentLayout title="Dashboard">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative flex items-center justify-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          <div className="flex items-center justify-center w-full h-full">
            <InputModal
              fileType={fileType}
              setFileType={setFileType}
              isLoading={isLoading}
              submitChanges={submitChanges}
              objectURL={objectURL}
              content={content}
              handleContentChange={handleContentChange}
              keywords={keywords}
              handleKeywordsChange={handleKeywordsChange}
              handleVideoFileChange={handleVideoFileChange}
            />
          </div>
        </section>
      </ContentLayout>
    </>
  );
};
