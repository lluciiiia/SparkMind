"use client";
import React, { useState } from "react";

type Props = {
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
};

const Cards: React.FC<Props> = ({
  question,
  options,
  answer,
  multipleAnswers,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

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
    alert(isCorrect ? "Correct!" : "Incorrect, try again.");
  };

  return (
    <div className="my-7">
      <div className="flex font-semibold bg-gray-400 w-full rounded-tl-none rounded-bl-none rounded-br-none mb-1 p-1 rounded-md items-center">
        <div>Q: </div>
        <div className="ml-2">{question}</div>
      </div>
      <div className="bg-gray-400 w-full rounded-md rounded-tl-none rounded-tr-none">
        <div className="p-1">
          {options.map((item, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(index)}
              className={`flex font-medium cursor-pointer p-2 rounded-md ${
                selectedOptions.includes(index)
                  ? "bg-cyan-500 text-white"
                  : "hover:bg-gray-300"
              }`}
            >
              <div>{String.fromCharCode(index + 65)}: </div>
              <div className="ml-2">{item}</div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-end p-1">
          {selectedOptions.length > 0 && (
            <button
              onClick={handleSubmit}
              className="mt-2 p-2 bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cards;
