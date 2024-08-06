"use client";
import { buildQuiz } from "@/app/api/v1/create-quiz/route";
import React, { useState } from "react";
import Wireframe from "./Wireframe";
import { ModeToggle } from "@/providers";

type Props = {};

function QuizGenerator({}: Props) {
  const [query, setQuery] = useState("");
  const [quizData, setQuizData] = useState<any>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createQuiz = async (query: string) => {
    setIsLoading(true);
    setQuery("");
    setQuizTitle("");

    buildQuiz(query)
      .then((quiz) => {
        if (quiz) {
          setQuizData(quiz);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setQuizTitle(`${query} Quiz`);
      });
  };
  const resetQuiz = () => {
    setQuizData([]);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createQuiz(query);
  };

  return (
    <div>
      {quizData.length > 0 && (
        <div className="flex justify-between items-center my-4">
          <div className="flex-grow text-center">
            <h1 className="text-2xl font-bold">{quizTitle}</h1>
          </div>
          <div className="ml-auto">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-300"
            >
              Reset Quiz
            </button>
          </div>
        </div>
      )}
      {quizData.length == 0 && !isLoading && (
        <div className="flex items-center justify-center min-h-[20vh]">
          <div className=" p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Quiz Generator
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-1">
              <input
                type="text"
                value={query}
                maxLength={25}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a Topic"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className=" flex justify-end bottom-2 right-2 text-gray-600 text-xs">
                {`${query.length}/${25} characters`}
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition mt-2"
              >
                Generate Quiz
              </button>
            </form>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="mt-4 text-center text-gray-500">Loading...</div>
      )}

      {!isLoading && quizData.length > 0 ? (
        <div className=" overflow-y-scroll h-screen">
          <Wireframe quiz={quizData} />
        </div>
      ) : null}
    </div>
  );
}

export default QuizGenerator;