import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type React from 'react';
import { FaTimes } from 'react-icons/fa';
import type { NoteCardProps } from './interfaces';

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  return (
    <Card key={note.id} className="w-full max-w-md h-auto relative">
      <CardHeader className="w-full flex flex-col items-center justify-start relative">
        <CardTitle className="text-lg font-bold left-0 mr-auto">{note.title}</CardTitle>
        <Button
          className="absolute top-2 right-2"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
        >
          <FaTimes />
        </Button>
      </CardHeader>
      <CardContent className="h-auto overflow-y-auto">
        <CardDescription>
          <Textarea
            placeholder="Enter your prompt"
            className="max-h-[200px] min-h-[100px] h-auto overflow-y-auto resize-y"
            value={note.content}
            readOnly
          />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
