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
import { FileIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';

import { saveOutput } from '../../../../_api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';
import { usePersistedId } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

export const ReUploadText = () => {
  toast.info('Support for files is temporarily unavailable');
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const handleUpload = async (file: File, newLearningId: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('myLearningId', newLearningId);

      const response = await fetch('/api/v1/upload-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = (await response.json()) as any;
      if (data.id) {
        setPersistedId(newLearningId); // Update the persisted ID
        router.push(`/dashboard?mylearning_id=${newLearningId}`);
        toast.success('File uploaded successfully');
      } else {
        toast.error('Invalid response from server, or file upload is temporarily unavailable');
      }
    } catch (err: any) {
      console.error('Error when handling upload:', err);
      toast.error(err.message || 'An error occurred during upload');
    } finally {
      setIsLoading(false);
    }
  };

  const submitChanges = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    const newLearningId = generateNewId(); // Generate a new ID
    await handleUpload(selectedFile, newLearningId);
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
              <BreadcrumbPage>Text</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <section className="relative flex items-center justify-center min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] rounded-md mt-[56px]">
          <div className="flex items-center justify-center w-full h-full">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-center">
                  <div className="cursor-pointer">
                    <NewInputIcon></NewInputIcon>
                  </div>
                  <span className="text-lg mt-4">Upload the files to get started</span>
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-2xl sm:rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Text File</DialogTitle>
                  <DialogDescription>
                    Choose a text file (.txt, .doc, .docx, etc.) to upload.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                  <Label htmlFor="file-upload">Select File</Label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-500">Selected file: {selectedFile.name}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={submitChanges}
                    disabled={isLoading || !selectedFile}
                  >
                    {isLoading ? 'Uploading ...' : 'Upload'}
                  </Button>
                </DialogFooter>

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-20 z-50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
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
