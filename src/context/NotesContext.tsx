import type { NoteType } from '@/schema';
import type React from 'react';
import { createContext, useContext, useState } from 'react';

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
  return <NotesContext.Provider value={{ notes, setNotes }}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
