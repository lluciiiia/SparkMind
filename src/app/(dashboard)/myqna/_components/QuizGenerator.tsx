"use client";
import { buildQuiz } from "@/app/api/v1/create-quiz/route";
import React, { useState } from "react";
import Wireframe from "./Wireframe";
import { ModeToggle } from "@/providers";

type Props = {};

function QuizGenerator({}: Props) {
  const [query, setQuery] = useState("");
  const [quizData, setQuizData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createQuiz = async (query: string) => {
    setIsLoading(true);
    setQuery("");

    buildQuiz(query)
      .then((quiz) => {
        if (quiz) {
          setQuizData(quiz);
        }
      })
      .finally(() => {
        setIsLoading(false);
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
        <div className="flex justify-end items-center my-4">
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition duration-300"
          >
            Reset Quiz
          </button>
        </div>
      )}
      {quizData.length == 0 && !isLoading && (
        <div className="flex items-center justify-center min-h-[20vh]">
          <div className=" p-6 rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Quiz Generator
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a topic"
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition"
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
