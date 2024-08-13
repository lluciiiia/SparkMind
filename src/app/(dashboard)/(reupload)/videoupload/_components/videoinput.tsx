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

import NewInputIcon from '@/../public/assets/svgs/new-input-icon';
import { AudioLinesIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';

import { getYoutubeResponse, saveOutput } from '@/app/api-handler';
//Circle Loading Style
import '@/styles/css/Circle-loader.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


//ffmpeg import
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { fileTypeFromBuffer } from "file-type";

export const ReUploadVideo = () => {
  const searchParams = useSearchParams();
  const myLearningId = searchParams.get('id');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [objectURL, setObjectURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ffmpeg = useRef<FFmpeg | null>(null);
  const currentFSls = useRef<string[]>([]);
  const [href, setHref] = useState("");
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

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

  const [fileType, setFileType] = useState<'video'>();

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
      if (ffmpeg.current && isFFmpegLoaded) {

        console.log('FFmpeg is loaded, starting the process...');

        ffmpeg.current.FS("writeFile", selectedFile.name, await fetchFile(selectedFile));

        currentFSls.current = ffmpeg.current.FS("readdir", ".");
        console.log("start executing the command");

        await ffmpeg.current.run(
          '-i',
          selectedFile.name,
          'output.wav'
        );

        console.log('Command execution completed.');
        const FSls = ffmpeg.current.FS("readdir", ".");
        const outputFiles = FSls.filter((i) => !currentFSls.current.includes(i));

        if (outputFiles.length === 1) {
          const data = ffmpeg.current.FS("readFile", outputFiles[0]);

          const objectURL = URL.createObjectURL(
            new Blob([new Uint8Array(data.buffer)], { type: 'audio/wav' })
          );
          setHref(objectURL);
          console.log(objectURL + "objectURL");
        }
      }
      else {
        console.error('FFmpeg is not loaded or not available.');
      }

      // const formData = new FormData();
      // formData.append('file', setHref.toString());
      // if (myLearningId !== null) {
      //   formData.append('learningid', myLearningId);
      // }

      // const res = await fetch('/api/v1/extract-transcribe', {
      //   method: 'PATCH',
      //   body: formData,
      // });

      // if (!res.ok) throw new Error(await res.text());

      // // @ts-ignore trust me bro
      // const data = (await res.json()) as any;

      //clean up old setState
      setSelectedFile(null);
      setObjectURL(null);
      setFileType(undefined);

      //return data.keywordsArr;
      return ['fdsfds'];
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      ffmpeg.current = createFFmpeg({
        log: true,
        corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
      });

      try {
        ffmpeg.current.setProgress(({ ratio }) => {
          console.log(ratio);
        });
        console.log("Loading FFmpeg...");
        await ffmpeg.current.load();
        setIsFFmpegLoaded(true);  // Mark FFmpeg as loaded
        console.log("FFmpeg loaded successfully.");
      } catch (err) {
        console.error('Error loading FFmpeg:', (err as Error).message);
      }
    })();
  }, []);

  const handleUpload = async (input: any, myLearningId: string) => {
    try {
      const response = await saveOutput(input, myLearningId);
      router.push(`/dashboard?id=${myLearningId}`);
    } catch (err: any) {
      console.error(err);
    }
  };

  const submitChanges = async () => {
    if (!myLearningId) return;

    try {
      setIsLoading(true);

      let input;
      if (fileType === 'video') {
        const keyWordsArray = await handleVideoUpload() as string[];
        input = keyWordsArray.toString();
      }
      await handleUpload(input, myLearningId);
    } catch (error) {
      console.log('error in submitChanges' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContentLayout title="Upload">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="">Upload</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Video</BreadcrumbPage>
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
                      {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType("image")}
                        disabled>
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Image
                      </Button> */}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('video')}
                      >
                        <VideoIcon className="w-4 h-4 mr-1" />
                        Video
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType("audio")}
                        disabled>
                        <AudioLinesIcon className="w-4 h-4 mr-1" />
                        Audio
                      </Button> */}
                    </div>
                  </>
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

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-20 backdrop-blur-sm">
                    <div className="Circleloader"></div>
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
