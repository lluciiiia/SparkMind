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

import { saveOutput } from '../../../../_api-handlers/api-handler';
import '@/styles/css/Circle-loader.css';
import { createMyLearning } from '@/app/api/v1/outputs/repository';
import { usePersistedId } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const ReUploadKeyword = () => {
  const {
    id: mylearning_id,
    clearId: clearMyLearningId,
    generateNewId,
    setPersistedId,
  } = usePersistedId('mylearning_id');
  const supabase = createClient();
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

  const handleContentChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleKeywordsChange = (event: any) => {
    setKeywords(event.target.value);
  };

  const isLaptop = useMediaQuery('(min-width: 1023px)');

  const [fileType, setFileType] = useState<'keywords'>();

  const handleUpload = async (input: any, title: string, newLearningId: string) => {
    if (!input || input.trim() === '') {
      toast.error('Input cannot be empty');
      return;
    }

    try {
      setIsLoading(true);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        toast.error('Your session has expired. Please sign in again.');
        router.push('/signin/password_signin');
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        toast.error('Failed to get user information. Please try again.');
        return;
      }

      const response = await saveOutput(input, newLearningId, userData.user.id, title);
      if (response && response.id) {
        toast.success('Resource created successfully');
        setPersistedId(newLearningId); // Update the persisted ID
      } else {
        toast.error('Failed to create resource');
      }
    } catch (err: any) {
      console.error('Error in handleUpload:', err);
      toast.error(`Error when saving output: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitChanges = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error('User authentication failed. Please log in and try again.');
        return;
      }

      const newLearningId = generateNewId(); // Generate a new ID

      if (fileType == 'keywords') {
        if (!keywords.trim()) {
          toast.error('Keywords cannot be empty');
          return;
        }
        const input = keywords;
        const title = `Keywords: ${keywords.slice(0, 30)}...`;
        await handleUpload(input, title, newLearningId);
      } else {
        toast.error('Please select a file type');
        return;
      }

      // Redirect to the dashboard with the new ID
      router.push(`/dashboard?mylearning_id=${newLearningId}`);
    } catch (err: any) {
      console.error('Error in submitChanges:', err);
      toast.error(`Error when submitting changes: ${err.message}`);
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
                        onClick={() => setFileType('keywords')}
                      >
                        <TextIcon className="w-4 h-4 mr-1" />
                        Keywords / Topic
                      </Button>
                    </div>
                  </>
                )}

                {fileType === 'keywords' && (
                  <div className="grid gap-2">
                    <Label htmlFor="keywords">Keywords / Topic</Label>
                    <Textarea
                      id="keywords"
                      placeholder="Write your keywords / topic here"
                      value={keywords}
                      onChange={handleKeywordsChange}
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
