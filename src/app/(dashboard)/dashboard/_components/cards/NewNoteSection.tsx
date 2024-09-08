'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import { getConciseNote, getGrammarNote } from '../../../../_api-handlers/notes';
import type { Note } from '../../../dashboard/_components/interfaces';

export const NewNoteSection: React.FC<{
  handleCreate: () => Promise<void>;
  handleEdit: (values: Note) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  notes: Note[];
}> = ({ handleCreate, handleEdit, handleDelete, notes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [isRevertEnabled, setIsRevertEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const form = useForm<Note>();

  useEffect(() => {
    if (selectedNote) {
      form.reset({
        title: selectedNote.title,
        content: selectedNote.content,
      });
      setOriginalContent(selectedNote.content);
      setIsRevertEnabled(false);
    }
  }, [selectedNote, form]);

  const onSubmit = async (values: Note) => {
    if (!selectedNote) return;
    setIsLoading(true);
    try {
      const updatedNote = { ...selectedNote, ...values };
      await handleEdit(updatedNote);
      setIsModalOpen(false);
      toast.success('Note updated successfully');
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrammar = async (content: string) => {
    setIsLoading(true);
    try {
      const response = await getGrammarNote(content);
      setOriginalContent(form.getValues('content'));
      form.setValue('content', response.data.correctedNote);
      setIsRevertEnabled(true);
    } catch (error) {
      toast.error('Failed to correct grammar');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConcise = async (content: string) => {
    setIsLoading(true);
    try {
      const response = await getConciseNote(content);
      setOriginalContent(form.getValues('content'));
      form.setValue('content', response.data.concisedNote);
      setIsRevertEnabled(true);
    } catch (error) {
      toast.error('Failed to make note concise');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    if (originalContent !== null) {
      form.setValue('content', originalContent);
      setIsRevertEnabled(false);
    }
  };

  const handleCreateNote = async () => {
    setIsCreating(true);
    try {
      const result = (await handleCreate()) as any;
      if (result && result.success) {
        toast.success('New note created');
      } else {
        console.warn('Note creation response unclear:', result);
        toast.info('Note may have been created. Please refresh to check.');
      }
    } catch (error) {
      console.error('Error in note creation:', error);
      toast.error('An error occurred while creating the note');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setIsDeleting(id);
    try {
      await handleDelete(id);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    } finally {
      setIsDeleting(null);
    }
  };

  const renderNoteCard = useCallback(
    (note: Note) => (
      <motion.div
        key={note.id}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-navy rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold truncate flex-1 mr-2 text-white">
              {note.title || 'New Note'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteNote(note.id)}
              disabled={isDeleting === note.id}
            >
              {isDeleting === note.id ? (
                <Skeleton className="h-5 w-5 rounded-full" />
              ) : (
                <Trash2 className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
          <div
            className="flex-1 overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedNote(note);
              setIsModalOpen(true);
            }}
          >
            <p className="text-sm text-muted-foreground break-words line-clamp-4">
              {note.content || 'Start typing...'}
            </p>
          </div>
        </div>
      </motion.div>
    ),
    [isDeleting, handleDeleteNote],
  );

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto pt-5 px-4">
      <Button
        className="mb-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        onClick={handleCreateNote}
        disabled={isCreating}
      >
        {isCreating ? <Skeleton className="h-6 w-6 rounded-full" /> : <FaPlus size={20} />}
      </Button>

      <ScrollArea className="w-full h-[calc(100vh-200px)] pr-4">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>{notes.map(renderNoteCard)}</AnimatePresence>
        </motion.div>
        {notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-muted-foreground py-8"
          >
            No notes yet. Click the "+" button to create one!
          </motion.div>
        )}
      </ScrollArea>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Title" className="w-full" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Content"
                        rows={7}
                        className="w-full resize-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap justify-between gap-2">
                <div className="space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleGrammar(form.getValues('content'))}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    Grammar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleConcise(form.getValues('content'))}
                    disabled={isLoading}
                    className="text-sm"
                  >
                    Concise
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRevert}
                    disabled={!isRevertEnabled || isLoading}
                    className="text-sm"
                  >
                    Revert
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};