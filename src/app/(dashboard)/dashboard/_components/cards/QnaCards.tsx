'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
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
  const [allWrong, setAllWrong] = useState(false);

  useEffect(() => {
    setAllWrong(options.every((option) => !answer.includes(option)));
  }, [options, answer]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;

    if (multipleAnswers) {
      setSelectedOptions((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
      );
    } else {
      setSelectedOptions((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      toast.error('Please select an option before submitting.');
      return;
    }

    const selectedAnswers = selectedOptions.map((index) => options[index]);
    const isCorrect =
      selectedAnswers.every((option) => answer.includes(option)) &&
      selectedAnswers.length === answer.length;

    if (isCorrect) {
      toast.success('Correct!');
    } else if (allWrong && selectedOptions.length === options.length) {
      toast.success('Correct! All options were wrong.');
    } else {
      toast.error('Incorrect. Try again or check the correct answer.');
    }

    setIsAnswered(true);
  };

  const resetQuestion = () => {
    setSelectedOptions([]);
    setIsAnswered(false);
  };

  return (
    <div className="my-7 transition-all duration-300 ease-in-out w-full">
      <div
        className={`flex items-center font-semibold bg-white w-full rounded-t-xl p-2 border border-black ${
          isOpen ? 'border-b-0' : ''
        }`}
      >
        <div>Q{number + 1}: </div>
        <div className="ml-2">{question}</div>
      </div>

      {isOpen && (
        <div className="bg-white w-full rounded-b-xl border border-black border-t-0 overflow-y-auto max-h-[60vh]">
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
          <div className="w-full flex justify-center items-center p-2 space-x-2">
            {!isAnswered && (
              <button
                onClick={handleSubmit}
                className="p-2 bg-navy text-white rounded-md hover:bg-blue-950 transition-colors duration-300"
                disabled={selectedOptions.length === 0}
              >
                Submit
              </button>
            )}
            {isAnswered && (
              <button
                onClick={resetQuestion}
                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-300"
              >
                Try Again
              </button>
            )}
          </div>
          {isAnswered && allWrong && (
            <div className="p-2 text-center text-red-500">
              Note: All given options were incorrect for this question.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QnaCards;
