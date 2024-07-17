import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type React from 'react';
import { FaCaretLeft, FaCaretRight, FaPlus } from 'react-icons/fa';

export const NewNoteSection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-items-start rounded-bl-md rounded-r-none w-[calc(100vw-100px)] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] pt-5">
      <Button className="bg-transparent border-dashed border-2 border-blue-500 rounded-r-md rounded-bl-md w-[75px] h-[75px] mr-auto">
        <FaPlus size={24} color="#60a5fa" />
      </Button>
      <ScrollArea className="w-full h-[calc(100vh-199px)] pt-5">
        <section className="flex flex-col items-start justify-start gap-10">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="w-[250px] h-[250px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px] bg-blue-400 rounded-r-3xl rounded-bl-3xl"
            >
              {i}
            </div>
          ))}
        </section>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
