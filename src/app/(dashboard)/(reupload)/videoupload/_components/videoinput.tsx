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
import { VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';

import { saveOutput } from '../../../../_api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';

import { usePersistedId } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const ReUploadVideo = () => {
  const {
    id: mylearning_id,
    clearId: clearMyLearningId,
    generateNewId,
    setPersistedId,
  } = usePersistedId('mylearning_id');
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
      if (file.size <= 5 * 1024 * 1024) {
        const pathURL = URL.createObjectURL(file);
        setSelectedFile(file);
        setObjectURL(pathURL);
      } else {
        toast.error('File size must be less than 5MB because we are in the testing phase.');
      }
    }
  };

  const handleVideoUpload = async (newLearningId: string) => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('learningid', newLearningId);

      const res = await fetch('/api/v1/extract-transcribe', {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());

      const data = (await res.json()) as any;

      setSelectedFile(null);
      setObjectURL(null);
      setFileType(undefined);

      return data.keywordsArr;
    } catch (err: any) {
      throw new Error('Error when extract transcribe : ' + (err as Error).message);
    }
  };

  const handleUpload = async (input: any, newLearningId: string, uuid: string) => {
    try {
      const response = await saveOutput(input, newLearningId, uuid);
      setPersistedId(newLearningId); // Update the persisted ID
      router.push(`/dashboard?mylearning_id=${newLearningId}`);
    } catch (err: any) {
      throw new Error('Error when save output : ' + (err as Error).message);
    }
  };

  const submitChanges = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const uuid = user?.id;

    if (!uuid) {
      toast.error('Please login to continue');
      return;
    }

    try {
      setIsLoading(true);

      const newLearningId = generateNewId(); // Generate a new ID

      let input;
      if (fileType === 'video') {
        const keyWordsArray = await handleVideoUpload(newLearningId);
        input = keyWordsArray.toString();
      }
      await handleUpload(input, newLearningId, uuid);
    } catch (error) {
      console.error('Error in submitChanges:', error);
      toast.error('Error in submitting changes: ' + (error as Error).message);
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
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setFileType('video')}
                      >
                        <VideoIcon className="w-4 h-4 mr-1" />
                        Video
                      </Button>
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
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 z-50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 " />
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
