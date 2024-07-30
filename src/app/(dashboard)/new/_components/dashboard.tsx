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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { AudioLinesIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';
import NewInputIcon from '../../../../../public/assets/svgs/new-input-icon';

//Circle Loading Style
import '@/styles/css/Circle-loader.css';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export const NewDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectURL, setObjectURL] = useState<string | null>(null);
  // const [keywords, setKeywords] = useState<[]>([]);
  // const [fetchedTranscript, setFetchedTranscript] = useState('');
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

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const [fileType, setFileType] = useState<'image' | 'video' | 'audio' | 'text'>();

  const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const pathURL = URL.createObjectURL(file);
      setSelectedFile(file);
      setObjectURL(pathURL);
      console.log(objectURL);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/v1/extract-transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      // @ts-ignore trust me bro
      const data = (await res.json()) as any;
      console.log(data);

      //right now not usefull to display the transcript
      // setFetchedTranscript(data.transcription);
      // setKeywords(data.keywordsArr);

      //const value = { 'title': 'Video File' };

      // handleCreate(value);

      //clean up old setState
      setSelectedFile(null);
      setObjectURL(null);
      setFileType(undefined);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitChanges = () => {
    if (fileType === 'video') {
      handleVideoUpload();
    }
  };

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
              <BreadcrumbPage>New</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative flex items-center justify-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          <div className="flex items-center justify-center w-full h-full">
            <Dialog
              onOpenChange={() => {
                setFileType(undefined);
              }}
            >
              <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-center">
                  <div className="cursor-pointer">
                    <NewInputIcon></NewInputIcon>
                  </div>
                  <span className="text-lg mt-4">Upload the files to get started</span>
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-2xl sm:rounded-2xl">
                {!fileType && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Upload files</DialogTitle>
                      <DialogDescription>
                        Choose which type of content you want to upload.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('image')}
                        disabled
                      >
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Image
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('video')}
                      >
                        <VideoIcon className="w-4 h-4 mr-1" />
                        Video
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('audio')}
                        disabled
                      >
                        <AudioLinesIcon className="w-4 h-4 mr-1" />
                        Audio
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('text')}
                      >
                        <TextIcon className="w-4 h-4 mr-1" />
                        Keywords
                      </Button>
                    </div>
                  </>
                )}

                {fileType === 'text' && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Content</Label>
                    <Textarea id="content" placeholder="Write your content here" />
                  </div>
                )}

                {fileType === 'video' && (
                  <>
                    <DialogTitle>Choose Video File</DialogTitle>
                    <input
                      type="file"
                      name="file"
                      accept=".mp4"
                      onChange={handleVideoFileChange}
                      className="rounded-md"
                    />
                  </>
                )}

                {fileType === 'video' && objectURL && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Preview</Label>
                    <div>
                      <video controls src={objectURL}></video>
                    </div>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-20 backdrop-blur-sm">
                        <div className="loader"></div>
                      </div>
                    )}
                  </div>
                )}

                {fileType && (
                  <div className="flex justify-end">
                    <DialogFooter>
                      <Button type="submit" onClick={submitChanges} disabled={isLoading}>
                        {isLoading ? 'Uploading ...' : 'Upload'}
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </ContentLayout>
    </>
  );
};
