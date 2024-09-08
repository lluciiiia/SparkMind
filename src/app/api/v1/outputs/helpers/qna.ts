import { QNA_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';

dotenv.config();

const quizSchema = z.array(
  z.object({
    id: z.number().optional(),
    question: z.string(),
    options: z.array(z.string()),
    answer: z.array(z.string()),
    multipleAnswers: z.boolean(),
  }),
);

type QuizItem = z.infer<typeof quizSchema>;

function parseQuizText(text: string): QuizItem[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  const questions: QuizItem[] = [];
  let currentQuestion: CurrentQuestion | null = null;

  lines.forEach((line) => {
    const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push({
          id: currentQuestion.id,
          question: currentQuestion.question,
          options: currentQuestion.options,
          answer: currentQuestion.answer,
          multipleAnswers: currentQuestion.answer.length > 1,
        });
      }
      currentQuestion = {
        id: parseInt(questionMatch[1]),
        question: questionMatch[2],
        options: [],
        answer: [],
      };
    } else if (currentQuestion) {
      const optionMatch = line.match(/^([a-d])\)\s*(.+)/);
      if (optionMatch) {
        currentQuestion.options.push(optionMatch[2]);
      } else if (line.match(/^[a-d]\)$/)) {
        currentQuestion.answer.push(currentQuestion.options[line.charCodeAt(0) - 97]);
      }
    }
  });

  if (currentQuestion) {
    questions.push({
      id: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: currentQuestion.answer,
      multipleAnswers: currentQuestion.answer.length > 1,
    });
  }

  return questions;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string[];
  id: number;
}

interface CurrentQuestion {
  id?: number;
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers?: boolean;
}

function truncateQuery(query: string, maxLength: number = 1000): string {
  if (query.length <= maxLength) return query;
  return query.substring(0, maxLength - 3) + '...';
}

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

export async function saveQuizOutput(query: string, myLearningId: string, output: any) {
  try {
    const truncatedQuery = truncateQuery(query);
    const systemInstruction = QNA_SYSTEM_INSTRUCTION.replace('{{query}}', truncatedQuery);
    const quizData = await fetchQuizData(systemInstruction);
    const supabase = createClient();

    const questionsMap = quizData.map((item) => ({
      id: item.id,
      question: item.question,
      options: item.options,
      answer: item.answer,
      multipleAnswers: item.multipleAnswers,
    }));

    if (!output) {
      const { data, error } = await supabase
        .from('outputs')
        .insert([{ learning_id: myLearningId, questions: questionsMap }])
        .select();

      if (error) {
        throw new Error('Error inserting questions output');
      }
      return { status: 200, data };
    } else {
      const { data, error } = await supabase
        .from('outputs')
        .update([{ questions: questionsMap }])
        .eq('learning_id', myLearningId);

      if (error) {
        throw new Error('Error updating questions output');
      }
      return { status: 200, data };
    }
  } catch (error) {
    console.error('Error fetching or generating questions data:', error);
    return { status: 500, error: 'Error fetching or generating questions data' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, myLearningId, output } = (await req.json()) as {
      query: string;
      myLearningId: string;
      output: any;
    };
    const result = await saveQuizOutput(query, myLearningId, output);
    return NextResponse.json({ status: 200, body: result });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
