"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaCaretLeft, FaCaretRight, FaPlus } from "react-icons/fa";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Content } from "@radix-ui/react-collapsible";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  // content: z.string().min(1, { message: "Content is required" }),
});

export const NewNoteSection: React.FC<{
  handleCreate: (values: z.infer<typeof schema>) => void;
  notes: z.infer<typeof schema>[];
}> = ({ handleCreate, notes }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<z.infer<
    typeof schema
  > | null>(null);

  const onSubmit = (values: z.infer<typeof schema>) => {
    handleCreate(values);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-items-start rounded-bl-md rounded-r-none w-[calc(100vw-100px)] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] pt-5">
      {/* Button to trigger the modal */}
      <Button
        className="bg-transparent border-dashed border-2 rounded-r-2xl rounded-bl-2xl border-navy w-[75px] h-[75px]"
        onClick={() => setIsModalOpen(true)}>
        <FaPlus size={24} color="#003366" />
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center justify-center bg-navy rounded-lg p-8 w-[700px] h-[400px]">
            <div className="flex justify-between items-center w-full mb-4">
              <span className="text-white text-xl text-bold">Note</span>
              <button
                className="self-end text-white"
                onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full h-full text-white">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormControl>
                      <Input {...field} placeholder="title" />
                    </FormControl>
                  )}
                />
                <div className="flex gap-1">
                  <button className="bg-white text-navy text-sm py-1 px-2 rounded">
                    Grammar
                  </button>
                  <button className="bg-white text-navy text-sm py-1 px-2 rounded">
                    Concise
                  </button>
                  <button className="bg-white text-navy text-sm py-1 px-2 rounded">
                    Revert
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-navy text-sm py-1 px-2 rounded">
                    Save
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      <ScrollArea className="w-full h-[calc(100vh-199px)] pt-5">
        <section className="flex flex-col items-start justify-start gap-10">
          {notes.map((note, i) => (
            <div
              key={i}
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] border-2 border-gray-200 lg:w-[300px] lg:h-[300px] bg-white rounded-r-3xl rounded-bl-3xl cursor-pointer"
              onClick={() => {
                setSelectedNote(note);
                setIsModalOpen(true);
              }}>
              {/* Content of the note */}
              <p className="p-4">{note.title}</p>
              {/* <p className="p-4">{note.content}</p> */}
            </div>
          ))}
        </section>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
