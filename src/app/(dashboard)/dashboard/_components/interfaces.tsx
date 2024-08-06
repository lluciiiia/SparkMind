export interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export interface Transcript {
  id: number;
  text: string;
}

export interface Props {
  transcript: Transcript[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
  };
}

export interface ParsedVideoData {
  items: VideoItem[];
}

export interface Output {
  youtube: string;
  summary: string;
  questions: string;
}

export interface VideoCardProps {
  videos: VideoItem[] | null;
}

export interface NoteCardProps {
  note: {
    id: string;
    title: string;
    content: string;
  };
  onDelete: (id: string) => void;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
}
