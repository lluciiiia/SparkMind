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
import { useState } from 'react';
import NewInputIcon from '../../../../../public/assets/svgs/new-input-icon';

interface InputModalProps {
  fileType: 'image' | 'video' | 'audio' | 'text' | 'keywords' | undefined;
  setFileType: (fileType: 'image' | 'video' | 'audio' | 'text' | 'keywords' | undefined) => void;
  content: string;
  keywords: string;
  objectURL: string | null;
  handleContentChange: (event: any) => void;
  handleKeywordsChange: (event: any) => void;
  handleVideoFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  submitChanges: () => void;
  isLoading: boolean;
}

export const InputModal = ({
  fileType,
  setFileType,
  content,
  keywords,
  objectURL,
  handleContentChange,
  handleKeywordsChange,
  handleVideoFileChange,
  submitChanges,
  isLoading,
}: InputModalProps) => {
  return (
    <Dialog onOpenChange={() => setFileType(undefined)}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center justify-center">
          <div className="cursor-pointer">
            <NewInputIcon />
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
                onClick={() => setFileType("video")}
                disabled>
                <VideoIcon className="w-4 h-4 mr-1" />
                Video
              </Button> */}
              <Button variant="outline" className="w-full" onClick={() => setFileType('keywords')}>
                <TextIcon className="w-4 h-4 mr-1" />
                Keywords / Topic
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setFileType('text')}>
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
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
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
  );
};
