import type { NoteType } from '@/schema';
import { createClient } from '@/utils/supabase/client';
import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type NotesContextType = {
  notes: NoteType[];
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>;
};

const NotesContext = createContext<NotesContextType>({
  notes: [],
  setNotes: () => {},
});

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from('notes').select('*');

      if (error) {
        console.error('Error fetching notes:', error);
      } else {
        setNotes(data);
      }
    };

    fetchNotes();
  }, [supabase]);

  return <NotesContext.Provider value={{ notes, setNotes }}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
