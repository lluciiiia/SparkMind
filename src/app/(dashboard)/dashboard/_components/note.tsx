import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTimes } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { NoteCardProps } from "./interfaces";

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  return (
    <Card key={note.id} className="w-full max-w-md h-auto relative">
      <CardHeader className="w-full flex flex-col items-center justify-start relative">
        <CardTitle className="text-lg font-bold left-0 mr-auto">
          {note.title}
        </CardTitle>
        <Button
          className="absolute top-2 right-2"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}>
          <FaTimes />
        </Button>
      </CardHeader>
      <CardContent className="h-auto overflow-y-auto">
        <CardDescription>
          <Textarea
            placeholder="Enter your prompt"
            className="w-full max-h-60 overflow-y-auto resize-y mt-2"
            value={note.content}
            readOnly
          />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
