"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FaPlus } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { Note } from "./interfaces";
import { getGrammarNote, getConciseNote } from "@/app/api-handler";

export const NewNoteSection: React.FC<{
  handleCreate: () => void;
  handleEdit: (values: Note) => void;
  handleDelete: (id: string) => void;
  notes: Note[];
}> = ({ handleCreate, handleEdit, handleDelete, notes }) => {
  const form = useForm<Note>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note>();

  useEffect(() => {
    if (selectedNote) {
      form.reset({
        title: selectedNote.title,
        content: selectedNote.content,
      });
    }
  }, [selectedNote, form]);

  const onSubmit = (values: Note) => {
    if (!selectedNote) return;

    const updatedNote = { ...selectedNote, ...values };
    handleEdit(updatedNote);
    setIsModalOpen(false);
  };

  const handleGrammar = async (content: string) => {
    const response = await getGrammarNote(content);
    form.setValue("content", response.data.correctedNote);
  };

  const handleConcise = async (content: string) => {
    const response = await getConciseNote(content);
    form.setValue("content", response.data.concisedNote);
  };

  return (
    <div className="flex flex-col items-center justify-items-start rounded-bl-md rounded-r-none w-[calc(100vw-100px)] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] pt-5">
      {/* Button to trigger the modal */}
      <Button
        className="bg-transparent border-dashed border-2 rounded-r-2xl rounded-bl-2xl border-navy w-[75px] h-[75px]"
        onClick={() => {
          handleCreate();
        }}>
        <FaPlus size={24} color="#003366" />
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col bg-navy rounded-lg p-8 w-[700px] h-[400px]">
            {/* Header with title and close button */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-white text-xl font-bold">Note</span>
              <button
                className="text-white"
                onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
            {/* Form content */}
            <div className="flex flex-col flex-grow">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4 h-full text-white">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Title"
                          rows={1}
                          className="w-full p-2 bg-transparent text-white rounded"
                        />
                      </FormControl>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormControl>
                        <textarea
                          {...field}
                          placeholder="Content"
                          rows={7}
                          className="w-full p-2 bg-transparent text-white rounded overflow-y-auto resize-none"
                        />
                      </FormControl>
                    )}
                  />
                  {/* Action buttons at the bottom */}
                  <div className="flex gap-2 mt-auto">
                    <button
                      type="button"
                      className="bg-white text-navy text-sm py-1 px-2 rounded"
                      onClick={() => {
                        const content = form.watch("content");
                        handleGrammar(content);
                      }}>
                      Grammar
                    </button>
                    <button
                      type="button"
                      className="bg-white text-navy text-sm py-1 px-2 rounded"
                      onClick={() => {
                        const content = form.watch("content");
                        handleConcise(content);
                      }}>
                      Concise
                    </button>
                    <button
                      type="submit"
                      className="bg-white text-navy text-sm py-1 px-2 rounded ml-auto">
                      Save
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="w-full h-[calc(100vh-199px)] pt-5">
        <section className="flex flex-col items-start justify-start gap-10">
          {notes.map((note, i) => (
            <div
              key={i}
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] border-2 border-gray-200 lg:w-[300px] lg:h-[300px] bg-white rounded-r-3xl rounded-bl-3xl overflow-hidden">
              {/* Content of the note */}
              <div className="p-4 overflow-hidden">
                <div className="flex">
                  <p className="text-xl font-bold truncate">{note.title}</p>
                  <div
                    className="ml-auto cursor-pointer"
                    style={{
                      position: "relative",
                      width: "30px",
                      height: "30px",
                    }}
                    onClick={() => {
                      handleDelete(note.id);
                    }}>
                    <Image
                      src={`/assets/svgs/x_icon.svg`}
                      alt={`Cancel Icon`}
                      fill
                      objectFit={`contain`}
                    />
                  </div>
                </div>
                <div
                  className="h-[230px] cursor-pointer"
                  onClick={() => {
                    setSelectedNote(note);
                    setIsModalOpen(true);
                  }}>
                  <p className="text-lg text-gray-700 overflow-hidden break-words ">
                    {note.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
