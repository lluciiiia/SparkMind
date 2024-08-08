'use client';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
  question: string;
  number: number;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
}

const QnaCards: React.FC<Props> = ({ question, options, answer, multipleAnswers, number }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (index: number) => {
    if (multipleAnswers) {
      setSelectedOptions((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index],
      );
    } else {
      if (selectedOptions.includes(index)) {
        setSelectedOptions([]);
      } else {
        setSelectedOptions([index]);
      }
    }
  };

  const handleSubmit = () => {
    const isCorrect = selectedOptions.every((index) => answer.includes(options[index]));

    if (isCorrect) {
      toast.success('Correct!');
    } else {
      toast.error('Incorrect, try again.');
    }

    setIsAnswered(true);
  };

  return (
    <div className="my-7 transition-all duration-300 ease-in-out w-full ">
      <div
        className={`flex items-center font-semibold bg-white w-full rounded-t-xl p-2 border border-black border-b-0 ${
          isOpen ? 'rounded-b-none' : 'rounded-b-md'
        }`}
      >
        <div>Q{number + 1}: </div>
        <div className="ml-2">{question}</div>
      </div>

      <div
        className={`bg-white w-full rounded-b-xl overflow-hidden transition-max-height duration-500 border border-black rounded-bl-none ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-2">
          {options.map((item, index) => {
            const isCorrectOption = answer.includes(item);
            const isSelected = selectedOptions.includes(index);
            const isOptionCorrect = isAnswered && isCorrectOption && isSelected;
            const isOptionIncorrect = isAnswered && !isCorrectOption && isSelected;

            return (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`flex font-medium cursor-pointer p-2 rounded-md transition-colors duration-300 ${
                  isOptionCorrect
                    ? 'bg-green-500 text-white'
                    : isOptionIncorrect
                      ? 'bg-red-500 text-white'
                      : isSelected
                        ? 'bg-navy text-white'
                        : 'hover:bg-gray-300'
                }`}
              >
                <div>{String.fromCharCode(index + 65)}: </div>
                <div className="ml-2">{item}</div>
              </div>
            );
          })}
        </div>
        {selectedOptions.length > 0 && (
          <div className="w-full flex justify-center items-center p-2">
            <button
              onClick={handleSubmit}
              className="p-2 bg-navy text-white rounded-md hover:bg-blue-950 transition-colors duration-300"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QnaCards;
