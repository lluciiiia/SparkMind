'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, HelpCircle, XCircle } from 'lucide-react';
import React, { memo, useState } from 'react';
import { toast } from 'sonner';

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
};

type Props = {
  questions: Question[];
};

const QuestionAndAnswer = memo(function QuestionAndAnswer({ questions }: Props) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, number[]>>({});

  const handleOptionClick = (questionId: string, optionIndex: number) => {
    setAnsweredQuestions((prev) => {
      const currentAnswers = prev[questionId] || [];
      const question = questions.find((q) => q.id === questionId);

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

  const handleSubmit = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
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

  const resetQuestion = (questionId: string) => {
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: [] }));
  };

  // Add this check at the beginning of the component
  if (!Array.isArray(questions)) {
    console.error('Questions prop is not an array:', questions);
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
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.id} className="p-6 border-b border-border last:border-b-0">
                <h3 className="text-lg font-semibold mb-4 text-primary">
                  Question {index + 1}: {question.question}
                </h3>
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = (answeredQuestions[question.id] || []).includes(optionIndex);
                    const isCorrect = question.answer.includes(option);
                    let buttonVariant: 'default' | 'outline' | 'secondary' = 'outline';
                    let icon = null;

                    if (isSelected) {
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
                        className="w-full justify-between"
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
                </div>
                {index < questions.length - 1 && <Separator className="my-6" />}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-muted-foreground">No questions found</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

QuestionAndAnswer.displayName = 'QuestionAndAnswer';

export default QuestionAndAnswer;
