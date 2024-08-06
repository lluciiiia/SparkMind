'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type React from 'react';
import { FaPlus } from 'react-icons/fa';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createAPIClient } from '@/lib';
import type { NoteType } from '@/schema';

const api = createAPIClient();

export const NewNoteSection: React.FC<{
  note: NoteType;
  notes: NoteType[];
}> = ({ notes, note }) => {
  const createNote = async (note: NoteType) => {
    try {
      await api.createNote(note);
    } catch (error) {
      throw new Error(
        `Error creating note: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const onSubmit = async (note: NoteType) => {
    createNote(note);
  };

  return (
    <div className="flex flex-col items-center justify-items-start rounded-bl-md rounded-r-none w-[calc(100vw-100px)] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] pt-5">
      <Dialog>
        <DialogTrigger>
          <Button className="bg-transparent border-dashed border-2 rounded-r-2xl rounded-bl-2xl border-navy w-[75px] h-[75px]">
            <FaPlus size={24} color="#003366" />
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center justify-center bg-navy rounded-lg p-8 w-[700px] h-[400px]">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="bg-transparent border-dashed border-2 border-white rounded-lg w-[150px] h-[100px] flex items-center justify-center">
              <FaPlus
                size={24}
                color="#ffffff"
                onClick={() => {
                  onSubmit({
                    title: note.title,
                    uuid: note.uuid,
                    content: note.content,
                    created_at: note.created_at,
                    updated_at: note.updated_at,
                  });
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ScrollArea className="w-full h-[calc(100vh-199px)] pt-5">
        <section className="flex flex-col items-start justify-start gap-10">
          {notes.map((_, i) => (
            <article
              key={i}
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] border-2 border-gray-200 lg:w-[300px] lg:h-[300px] bg-white rounded-r-3xl rounded-bl-3xl"
            ></article>
          ))}
        </section>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
