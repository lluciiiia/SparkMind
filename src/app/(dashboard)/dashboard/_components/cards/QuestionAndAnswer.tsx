import Cards from '@/app/(dashboard)/myqna/_components/Cards';
import { Card } from '@/components/ui/card';
import React from 'react';
import QnaCards from './QnaCards';

type Props = { questions: any[] };

export default function QuestionAndAnswer({ questions }: Props) {
  console.log('the questions', questions);
  return (
    <Card className="w-full h-[calc(100vh-56px-64px-20px-24px-56px-48px-40px)] rounded-t-3xl px-4">
      <div className="flex flex-col h-full overflow-y-auto rounded-t-3xl items-center">
        {Array.isArray(questions) && questions.length > 0 ? (
          questions.map((question: any, index) => (
            <QnaCards
              number={index}
              key={question.id || index}
              question={question.question}
              options={question.options}
              answer={question.answer}
              multipleAnswers={question.multipleAnswers}
            />
          ))
        ) : (
          <div className="flex h-full justify-center items-center">
            <p>No questions found</p>
          </div>
        )}
      </div>
    </Card>
  );
}
