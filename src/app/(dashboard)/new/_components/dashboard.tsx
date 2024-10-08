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

import { TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';
import NewInputIcon from '../../../../../public/assets/svgs/new-input-icon';

import { toast } from 'sonner';
import { processDefaultTitle, saveOutput } from '../../../_api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';
import { usePersistedId } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export const NewDashboard = () => {
  const { id: mylearning_id, clearId: clearMyLearningId } = usePersistedId('mylearning_id');

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
      if (mylearning_id !== null) {
        formData.append('learningid', mylearning_id);
      }

      const res = await fetch('/api/v1/extract-transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      // @ts-ignore trust me bro
      const data = (await res.json()) as any;
      // console.log(data);

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

  const handleUpload = async (input: any, myLearningId: string, uuid: string) => {
    try {
      await saveOutput(input, myLearningId, uuid);
      await processDefaultTitle(myLearningId);

      router.push(`/dashboard?mylearning_id=${myLearningId}`);
    } catch (err: any) {
      console.error(err);
    }
  };

  const submitChanges = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const uuid = user?.id;

    if (!uuid) {
      toast.error('Error extracting uuid');
      return;
    }

    try {
      setIsLoading(true);

      if (!mylearning_id) return;

      let input;
      if (fileType === 'video') {
        const keyWordsArray = await handleVideoUpload();
        input = keyWordsArray.toString();
      } else if (fileType == 'text') {
        input = content;
      } else if (fileType == 'keywords') {
        input = keywords;
      }

      await handleUpload(input, mylearning_id, uuid);
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
                  <span className="mt-4 text-lg">Upload the files to get started</span>
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
                        disabled
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
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('keywords')}
                      >
                        <TextIcon className="w-4 h-4 mr-1" />
                        Keywords / Topic
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('text')}
                      >
                        <TextIcon className="w-4 h-4 mr-1" />
                        Text
                      </Button>
                    </div>
                  </>
                )}

                {fileType === 'text' && (
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your content here"
                      value={content}
                      onChange={handleContentChange}
                    />
                  </div>
                )}

                {fileType === 'keywords' && (
                  <div className="grid gap-2">
                    <Label htmlFor="keywords">Keywords / Topic</Label>
                    <Textarea
                      id="keywords"
                      placeholder="Write your keywords / topic here"
                      value={keywords}
                      className="max-h-[200px] min-h-[100px] h-auto overflow-y-auto resize-y"
                      onChange={handleKeywordsChange}
                    />
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
                      <div className="absolute inset-0 flex items-center justify-center  bg-opacity-20 z-50 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 " />
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
