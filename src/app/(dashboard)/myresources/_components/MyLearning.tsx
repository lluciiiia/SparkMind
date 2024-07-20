import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

export const MyLearning = () => {
  return (
    <section className={`flex flex-col gap-4`}>
      <header className={`flex items-center justify-between`}>
        <h2 className={`text-2xl font-bold`}>My Learning</h2>
      </header>
      <article
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-x-auto grid-flow-dense`}
      >
        <div className={`flex items-center justify-center`}>
          <Button className="bg-transparent border-dashed border-2 border-blue-500 rounded-r-md rounded-bl-md w-[150px] h-[150px] mx-auto hover:bg-transparent hover:border-blue-500 hover:text-blue-500">
            <FaPlus size={24} color="#60a5fa" />
          </Button>
        </div>
        {Array.from({ length: 10 }, (_, index) => (
          <LearningCard key={index} index={index} />
        ))}
      </article>
    </section>
  );
};

const LearningCard = ({
  index,
}: {
  index: string | number;
}) => {
  return (
    <Card className={`w-full h-[150px] sm:h-[200px] md:h-[250px] flex items-center justify-center`}>
      <CardHeader>
        <CardTitle>{index}</CardTitle>
      </CardHeader>
    </Card>
  );
};
