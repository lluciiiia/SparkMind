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

import NewInputIcon from '@/../public/assets/svgs/new-input-icon';
import { TextIcon } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useMediaQuery } from 'usehooks-ts';

import { saveOutput } from '../../../../api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';

export const ReUploadText = () => {
  const [myLearningId] = useQueryState('id', { defaultValue: '' });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [showText, setShowText] = useState(false);
  const [content, setContent] = useState('');
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

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const [fileType, setFileType] = useState<'text'>();

  const handleUpload = async (input: any, myLearningId: string) => {
    try {
      setIsLoading(true);
      const response = await saveOutput(input, myLearningId);
      router.push(`/dashboard?id=${myLearningId}`);
    } catch (err: any) {
      throw new Error('Error when handle upload : ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitChanges = async () => {
    if (!myLearningId) return;

    let input;
    if (fileType == 'text') {
      input = content;
    }

    await handleUpload(input, myLearningId);
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
