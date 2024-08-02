"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
}

const Cards: React.FC<Props> = ({
  question,
  options,
  answer,
  multipleAnswers,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctOptions, setCorrectOptions] = useState<Set<number>>(new Set());
  const [incorrectOptions, setIncorrectOptions] = useState<Set<number>>(
    new Set(),
  );

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
    const isCorrect = selectedOptions.every((index) =>
      answer.includes(options[index]),
    );

    if (isCorrect) {
      toast.success("Correct!");
      setCorrectOptions(new Set(selectedOptions));
    } else {
      toast.error("Incorrect, try again.");
      setIncorrectOptions(new Set(selectedOptions));
    }

    setIsAnswered(true);
  };

  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="my-7 transition-all duration-300 ease-in-out">
      <div
        className={`flex items-center font-semibold bg-gray-700 w-full rounded-t-md mb-1 p-2 cursor-pointer ${
          isOpen ? "rounded-b-none" : "rounded-b-md"
        }`}
        onClick={toggleCard}
      >
        <div>Q: </div>
        <div className="ml-2">{question}</div>
        <div
          className={`ml-auto transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
      <div
        className={`bg-gray-700 w-full rounded-b-md overflow-hidden transition-max-height duration-500 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-2">
          {options.map((item, index) => {
            const isCorrectOption = answer.includes(item);
            const isSelected = selectedOptions.includes(index);
            const isOptionCorrect = isAnswered && isCorrectOption && isSelected;
            const isOptionIncorrect =
              isAnswered && !isCorrectOption && isSelected;

            return (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`flex font-medium cursor-pointer p-2 rounded-md transition-colors duration-300 ${
                  isOptionCorrect
                    ? "bg-green-500 text-white"
                    : isOptionIncorrect
                    ? "bg-red-500 text-white"
                    : isSelected
                    ? "bg-cyan-500 text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                <div>{String.fromCharCode(index + 65)}: </div>
                <div className="ml-2">{item}</div>
              </div>
            );
          })}
        </div>
        {selectedOptions.length > 0 && (
          <div className="w-full flex justify-end p-2">
            <button
              onClick={handleSubmit}
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
