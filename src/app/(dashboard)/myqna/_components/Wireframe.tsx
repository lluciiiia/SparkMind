import React from "react";
import Cards from "./Cards";
import { data } from "./mockData.js";

type Props = {};

export default function Wireframe({}: Props) {
  return (
    <div className="items-center justify-center h-[80%] overflow-y-scroll">
      {data.map((item, index) => (
        <Cards
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
