import { createAPIClient } from '@/lib/fetch';
import type { NoteType } from '@/schema';
import { motion } from 'framer-motion';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { PiNoteBlankFill } from 'react-icons/pi';
import { NewNoteSection } from '.';

export const NewNoteContainer = ({
  isOpen,
  setIsOpen,
  showText,
  notes,
  note,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showText: boolean;
  note: NoteType;
  notes: NoteType[];
}) => {
  return (
    <div className="flex flex-col items-center justify-items-start top-[80px] right-0 rounded-l-md rounded-r-none w-fit border-2 border-red-400">
      <motion.details
        open={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        className="w-full"
        initial={{ width: 30 }}
        animate={{ width: isOpen ? '100%' : 50 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <summary
          className={`left-0 relative p-2 ${
            isOpen ? 'rounded-l-md' : 'rounded-md'
          } bg-blue-400 rounded-r-none w-full flex items-center justify-start ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          {isOpen ? <FaCaretLeft size={24} /> : <FaCaretRight size={24} />}
          <PiNoteBlankFill size={24} />

          {showText && <span>New note</span>}
        </summary>
        <NewNoteSection notes={notes} note={note} />
      </motion.details>
    </div>
  );
};
