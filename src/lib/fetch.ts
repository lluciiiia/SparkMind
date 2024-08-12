import { NoteSchema } from '@/schema';
import type { z } from 'zod';

export function createAPIClient() {
  async function _fetch<T extends z.ZodTypeAny>(
    url: string,
    init: RequestInit,
    type: T,
  ): Promise<{ success: boolean; data: z.infer<T>[] }> {
    const headers = new Headers(init?.headers);

    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
      throw new Error(res.statusText);
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      const result = data.map((item) => type.parse(item));
      return { success: true, data: result };
    } else {
      const result = type.safeParse(data);

      if (!result.success) {
        throw new Error(result.error.message);
      }
      return { success: true, data: [result.data] };
    }
  }

  const getNotes = async () => {
    try {
      const res = await _fetch(
        '/api/v1/notes',
        {
          method: 'GET',
        },
        NoteSchema,
      );
      return res.data;
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw new Error(
        `Error fetching notes: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const getNote = async (id: number) => {
    try {
      const res = await _fetch(
        `/api/v1/notes/${id}`,
        {
          method: 'GET',
        },
        NoteSchema,
      );
      return res.data;
    } catch (error) {
      console.error(`Failed to fetch note with id ${id}:`, error);
      throw new Error(
        `Error fetching note with id ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const createNote = async (note: z.infer<typeof NoteSchema>) => {
    try {
      const res = await _fetch(
        '/api/v1/notes',
        {
          method: 'POST',
          body: JSON.stringify(note),
        },
        NoteSchema,
      );
      return res.data;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw new Error(
        `Error creating note: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const updateNote = async (note: z.infer<typeof NoteSchema>) => {
    try {
      const res = await _fetch(
        `/api/v1/notes/${note.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(note),
        },
        NoteSchema,
      );
      return res.data;
    } catch (error) {
      throw new Error(
        `Error updating note with id ${note.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  const deleteNote = async (note: z.infer<typeof NoteSchema>) => {
    try {
      const res = await _fetch(
        `/api/v1/notes/${note.id}`,
        {
          method: 'DELETE',
          body: JSON.stringify(note),
        },
        NoteSchema,
      );
      return res.data;
    } catch (error) {
      console.error(`Failed to delete note with id ${note.id}:`, error);
      throw new Error(
        `Error deleting note with id ${note.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  };

  return {
    fetch: _fetch,
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
