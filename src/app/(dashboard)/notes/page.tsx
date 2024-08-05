'use client';

import { createAPIClient } from '@/lib';
import { NoteSchema, type NoteType } from '@/schema';
import React, { useEffect, useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';
import type { z } from 'zod';
import { useSessionStorage } from 'usehooks-ts';
import { useNotes } from '@/context';
import { createClient } from '@/utils/supabase/client';

const NotesPage = async () => {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser()

  console.log(user);

  const { notes, setNotes } = useNotes();

  useIsomorphicLayoutEffect(() => {
    const api = createAPIClient();
    const fetchNotes = async () => {
      const res = await api.fetch('/api/v1/notes', { method: 'GET' }, NoteSchema);
      // @ts-ignore
      const notes_ = res.data as z.infer<typeof NoteSchema>[];
      setNotes(notes_);
    };
    fetchNotes();
  }, []);
  return (
    <article id={`${user?.id}`}>

    </article>
  );
};

export default NotesPage;