'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Eye, HelpCircle, XCircle } from 'lucide-react';
import React, { memo, useState, useEffect } from 'react';
import { toast } from 'sonner';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
};

type Props = {
  questions: Question[];
};

const QuestionAndAnswer = memo(function QuestionAndAnswer({ questions }: Props) {
  const [processedQuestions, setProcessedQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number[]>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const mergeAnswersWithQuestions = (questions: Question[]): Question[] => {
      const questionMap: Record<number, Question> = {};
      const answerMap: Record<number, string[]> = {};

      questions.forEach((question) => {
        if (question.options.length > 0) {
          questionMap[question.id] = { ...question, answer: [] };
        } else {
          const answerMatch = question.question.match(/^([a-d])\) (.+)/);
          if (answerMatch) {
            const [, letter, answerText] = answerMatch;
            const questionId = question.id - 10;
            if (!answerMap[questionId]) {
              answerMap[questionId] = [];
            }
            answerMap[questionId].push(answerText);
          }
        }
      });

      Object.entries(answerMap).forEach(([questionId, answers]) => {
        const id = Number.parseInt(questionId, 10);
        if (questionMap[id]) {
          questionMap[id].answer = answers;
        }
      });

      return Object.values(questionMap);
    };

    setProcessedQuestions(mergeAnswersWithQuestions(questions));
  }, [questions]);

  const handleOptionClick = (questionId: number, optionIndex: number) => {
    setAnsweredQuestions((prev) => {
      const currentAnswers = prev[questionId] || [];
      const question = processedQuestions.find((q) => q.id === questionId);

      if (question?.multipleAnswers) {
        return {
          ...prev,
          [questionId]: currentAnswers.includes(optionIndex)
            ? currentAnswers.filter((i) => i !== optionIndex)
            : [...currentAnswers, optionIndex],
        };
      } else {
        return { ...prev, [questionId]: [optionIndex] };
      }
    });
  };

  const handleSubmit = (questionId: number) => {
    const question = processedQuestions.find((q) => q.id === questionId);
    const selectedAnswers = answeredQuestions[questionId] || [];

    if (selectedAnswers.length === 0) {
      toast.error('Please select an option before submitting.');
      return;
    }

    const selectedOptions = selectedAnswers.map((index) => question?.options[index]);
    const isCorrect =
      selectedOptions.every((option) => question?.answer.includes(option || '')) &&
      selectedOptions.length === question?.answer.length;

    if (isCorrect) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect. Try again or check the correct answer.');
    }
  };

  const resetQuestion = (questionId: number) => {
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: [] }));
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: false }));
  };

  const revealAnswer = (questionId: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  if (!Array.isArray(questions) || processedQuestions.length === 0) {
    return (
      <Card className="w-full h-[calc(100vh-200px)] bg-background">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No valid questions available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(100vh-200px)] bg-background">
      <CardHeader className="bg-muted sr-only">
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <HelpCircle className="w-6 h-6 mr-2" />
          Questions and Answers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          {processedQuestions.map((question, index) => (
            <div key={question.id} className="p-6 border-b border-border last:border-b-0">
              <h3 className="text-lg font-semibold mb-4 text-primary">
                Question {index + 1}: {question.question}
              </h3>
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => {
                  const isSelected = (answeredQuestions[question.id] || []).includes(optionIndex);
                  const isCorrect = question.answer.includes(option);
                  const isRevealed = revealedAnswers[question.id];
                  let buttonVariant: 'default' | 'outline' | 'secondary' = 'outline';
                  let icon = null;

                  if (isSelected || (isRevealed && isCorrect)) {
                    buttonVariant = 'secondary';
                    icon = isCorrect ? (
                      <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 ml-2 text-red-500" />
                    );
                  }

                  return (
                    <Button
                      key={optionIndex}
                      onClick={() => handleOptionClick(question.id, optionIndex)}
                      variant={buttonVariant}
                      className={`w-full justify-between ${
                        isRevealed && isCorrect ? 'bg-green-100 hover:bg-green-200' : ''
                      }`}
                    >
                      <span>{option}</span>
                      {icon}
                    </Button>
                  );
                })}
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleSubmit(question.id)}
                  className="text-white bg-navy hover:bg-navy/90"
                >
                  Submit
                </Button>
                <Button variant="outline" onClick={() => resetQuestion(question.id)}>
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => revealAnswer(question.id)}
                  className="bg-gray-100 hover:bg-gray-200"
                  disabled={revealedAnswers[question.id]}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Reveal Answer
                </Button>
              </div>
              {revealedAnswers[question.id] && (
                <div className="mt-4 p-3 bg-blue-100 rounded-md">
                  <p className="font-semibold text-blue-800">Correct Answer(s):</p>
                  <ul className="list-disc list-inside text-blue-700">
                    {question.answer.map((ans, i) => (
                      <li key={i}>{ans}</li>
                    ))}
                  </ul>
                </div>
              )}
              {index < processedQuestions.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

QuestionAndAnswer.displayName = 'QuestionAndAnswer';

export default QuestionAndAnswer;
