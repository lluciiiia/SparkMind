import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export const RecentLearnings = () => {
  return (
    <section
      className={`flex flex-col gap-4`}
    >
      <header
        className={`flex justify-between items-center`}
      >
        <h2
          className={`text-2xl font-bold`}
        >
          Recent Learnings
        </h2>
      </header>
      <article
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2`}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <RecentLearningsItem 
            key={index}
            index={index}
          />
        ))}
      </article>
    </section>
  )
}

const RecentLearningsItem = ({ index }: { index: number | string}) => {
  return (
    <Card
      className={`w-full h-[150px] sm:h-[200px] md:h-[250px] flex items-center justify-center`}
    >
      <CardHeader>
        <CardTitle>
          {`Learning ${index}`}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}