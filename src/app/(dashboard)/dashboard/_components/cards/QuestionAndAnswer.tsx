import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import QnaCards from './QnaCards';

type Props = { questions: any[] };

export default function QuestionAndAnswer({ questions }: Props) {
  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Questions and Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {questions.length > 0 ? (
            questions.map((question: any, index) => (
              <QnaCards
                number={index + 1}
                key={question.id || index}
                question={question.question}
                options={question.options}
                answer={question.answer}
                multipleAnswers={question.multipleAnswers}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">No questions found</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
