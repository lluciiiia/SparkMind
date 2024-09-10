'use client';
import { Button } from '@/components/ui/button';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [isAnswered, setIsAnswered] = useState(false);
  const allWrongRef = useRef(false);

  useEffect(() => {
    allWrongRef.current = options.every((option) => !answer.includes(option));
  }, [options, answer]);

  const handleOptionClick = useCallback(
    (index: number) => {
      if (isAnswered) return;

      setSelectedOptions((prev) => {
        if (multipleAnswers) {
          return prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
        } else {
          return prev.includes(index) ? [] : [index];
        }
      });
    },
    [isAnswered, multipleAnswers],
  );

  const handleSubmit = useCallback(() => {
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
    } else if (allWrongRef.current && selectedOptions.length === options.length) {
      toast.success('Correct! All options were wrong.');
    } else {
      toast.error('Incorrect. Try again or check the correct answer.');
    }

    setIsAnswered(true);
  }, [selectedOptions, options, answer]);

  const resetQuestion = useCallback(() => {
    setSelectedOptions([]);
    setIsAnswered(false);
  }, []);

  const memoizedOptions = useMemo(
    () =>
      options.map((item, index) => {
        const isCorrectOption = answer.includes(item);
        const isSelected = selectedOptions.includes(index);
        const isOptionCorrect = isAnswered && isCorrectOption;
        const isOptionIncorrect = isAnswered && !isCorrectOption && isSelected;

        return (
          <Button
            key={index}
            onClick={() => handleOptionClick(index)}
            variant={isSelected ? 'default' : 'outline'}
            className={`mb-2 ${isOptionCorrect ? 'bg-green-500' : ''} ${isOptionIncorrect ? 'bg-red-500' : ''}`}
          >
            {item}
          </Button>
        );
      }),
    [options, answer, selectedOptions, isAnswered, handleOptionClick],
  );

  return (
    <div className="mb-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">
        Question {number}: {question}
      </h3>
      <div className="space-y-2">{memoizedOptions}</div>
      <div className="mt-4 space-x-2">
        <Button onClick={handleSubmit} disabled={isAnswered}>
          Submit
        </Button>
        <Button onClick={resetQuestion} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
};

QnaCards.displayName = 'QnaCards';

export { QnaCards };
