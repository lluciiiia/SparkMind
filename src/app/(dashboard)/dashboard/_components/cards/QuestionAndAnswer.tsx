import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { memo, useCallback, useRef, useState, useEffect } from 'react';
import { QnaCards } from './QnaCards';

type Props = { questions: any[] };

const QuestionAndAnswer = memo(function QuestionAndAnswer({ questions }: Props) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;
      const itemHeight = 200; // Estimated height of each QnaCard
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(questions.length, Math.ceil((scrollTop + clientHeight) / itemHeight));
      setVisibleRange({ start, end });
    }
  }, [questions.length]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <Card className="w-full h-[calc(100vh-200px)]">
      <CardHeader>
        <CardTitle>Questions and Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4" ref={scrollRef}>
          {questions.length > 0 ? (
            <div style={{ height: `${questions.length * 200}px`, position: 'relative' }}>
              {questions.slice(visibleRange.start, visibleRange.end).map((question, index) => (
                <div
                  key={question.id || index}
                  style={{
                    position: 'absolute',
                    top: `${(visibleRange.start + index) * 200}px`,
                    width: '100%',
                  }}
                >
                  <QnaCards
                    number={visibleRange.start + index + 1}
                    question={question.question}
                    options={question.options}
                    answer={question.answer}
                    multipleAnswers={question.multipleAnswers}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No questions found</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

QuestionAndAnswer.displayName = 'QuestionAndAnswer';

export default QuestionAndAnswer;
