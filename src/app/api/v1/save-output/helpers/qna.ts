import { createClient } from '@/utils/supabase/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generationConfig, model, safetySettings } from '../../gemini-settings';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Define the Zod schema
const quizSchema = z.array(
  z.object({
    id: z.number(),
    question: z.string(),
    options: z.array(z.string()),
    answer: z.array(z.string()),
    multipleAnswers: z.boolean(),
  }),
);

// Function to convert plain text quiz data into an array of objects
function parseQuizText(text: string) {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  const questions: any[] = [];
  const answers: string[] = [];
  let currentQuestion: { question: string; options: string[] } | null = null as {
    question: string;
    options: string[];
  } | null;

  lines.forEach((line) => {
    const questionMatch = line.match(/^\d+\. \*\*(.+?)\*\*/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push({
          id: questions.length + 1,
          question: currentQuestion.question,
          options: currentQuestion.options,
          answer: [],
          multipleAnswers: false,
        });
      }
      currentQuestion = { question: questionMatch[1], options: [] };
    } else if (currentQuestion) {
      const optionMatch = line.match(/^[a-d]\) (.+)/);
      if (optionMatch) {
        currentQuestion.options.push(optionMatch[1]);
      }
    }

    const answerMatch = line.match(/^\d+\. (\w)\)/);
    if (answerMatch) {
      answers.push(answerMatch[1]);
    }
  });

  if (currentQuestion) {
    questions.push({
      id: questions.length + 1,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: [],
      multipleAnswers: false,
    });
  }

  questions.forEach((question, index) => {
    const answerIndex = 'abcd'.indexOf(answers[index]);
    if (answerIndex !== -1) {
      question.answer = [question.options[answerIndex]];
    }
  });

  return questions;
}

// Example function to simulate fetching data from the Google Gemini API
async function fetchQuizData(query: string) {
  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });
  const result = await genModel.generateContent(query);
  const response = result.response;
  const text = await response.text();

  const parsedData = parseQuizText(text);
  return quizSchema.parse(parsedData);
}

// Example function to build the quiz based on the query
export async function saveQuizOutput(query: string, myLearningId: string, output: any) {
  try {
    const systemInstruction = SYSTEM_INSTRUCTION.replace('{{query}}', query);
    const quizData = await fetchQuizData(systemInstruction);
    const supabase = createClient();

    // Example format to build the quiz
    const quiz = quizData.map((item, index) => ({
      id: index + 1,
      question: item.question,
      options: item.options,
      answer: item.answer,
      multipleAnswers: item.multipleAnswers,
    }));
    const halfLength = quiz.length / 2;
    const questions = quiz.slice(0, halfLength);
    const answers = quiz.slice(halfLength);

    const questionsMap = questions.map((question, index) => {
      if (answers[index]) {
        const answerText = answers[index].question.split(') ')[1]; // Extract the answer text
        const answerIndex = question.options.findIndex((option) => option === answerText);
        if (answerIndex !== -1) {
          question.answer.push(question.options[answerIndex]);
        }
      }
      return question;
    });

    if (!output) {
      const { data, error } = await supabase
        .from('outputs')
        .insert([{ learning_id: myLearningId, questions: questionsMap }])
        .select();

      if (error) {
        return NextResponse.json({ error: 'Error inserting questions output' }, { status: 500 });
      }
    } else {
      const { data, error } = await supabase
        .from('outputs')
        .update([{ questions: questionsMap }])
        .eq('learning_id', myLearningId);

      if (error) {
        return NextResponse.json({ error: 'Error updating questions output' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 200, body: 'success' });
  } catch (error) {
    console.error('Error fetching or generating questions data:', error);
    return NextResponse.json(
      { error: 'Error fetching or generating questions data' },
      { status: 500 },
    );
  }
}

const SYSTEM_INSTRUCTION = `
Please generate 10 quiz questions about "{{query}}". Format the output exactly as follows:

## {{query}} Quiz:

**Instructions:** Choose the best answer for each question.

1. **Question 1?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

2. **Question 2?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

...

10. **Question 10?**
    a) Option A
    b) Option B
    c) Option C
    d) Option D

## Answer Key:

1. **a) Option A**
2. **b) Option B**
...
10. **d) Option D**
`;
