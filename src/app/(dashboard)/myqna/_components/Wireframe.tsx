import React from "react";
import Cards from "./Cards";

type Props = {
  quiz: any[];
};

export default function Wireframe({ quiz }: Props) {
  return (
    <div className="items-center justify-center h-[80%] overflow-y-scroll">
      {quiz.map((item, index) => (
        <Cards
          number={index}
          key={item.id || index}
          question={item.question}
          options={item.options}
          answer={item.answer}
          multipleAnswers={item.multipleAnswers}
        />
      ))}
    </div>
  );
}
