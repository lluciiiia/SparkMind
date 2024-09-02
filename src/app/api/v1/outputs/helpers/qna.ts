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
  const answers: string[] = [];

  lines.forEach((line) => {
    const questionMatch = line.match(/^\d+\. \*\*(.+?)\*\*/);
    if (questionMatch) {
      if (currentQuestion) {
        questions.push({
          id: currentQuestion.id || questions.length + 1,
          options: currentQuestion.options,
          question: currentQuestion.question,
          answer: currentQuestion.answer,
          multipleAnswers: currentQuestion.answer.length > 1,
        });
      }
      currentQuestion = {
        id: questions.length + 1,
        question: questionMatch[1],
        options: [],
        answer: [],
      };
    } else if (currentQuestion) {
      const optionMatch = line.match(/^([a-d])\) (.+)/);
      if (optionMatch) {
        currentQuestion.options.push(optionMatch[2]);
      } else {
        const answerMatch = line.match(/^\d+\. ([a-d])\)/);
        if (answerMatch) {
          answers.push(line);
        }
      }
    }
  });

  if (currentQuestion) {
    questions.push({
      id: currentQuestion.id || questions.length + 1,
      question: currentQuestion.question,
      options: currentQuestion.options,
      answer: currentQuestion.answer,
      multipleAnswers: currentQuestion.answer.length > 1,
    });
  }

  // Associate answers with questions
  answers.forEach((answerLine, index) => {
    const answerMatch = answerLine.match(/^\d+\. ([a-d])\)/);
    if (answerMatch) {
      const answerIndex = 'abcd'.indexOf(answerMatch[1]);
      if (answerIndex !== -1 && questions[index].options[answerIndex]) {
        questions[index].answer.push(questions[index].options[answerIndex]);
      }
    }
  });

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
    const systemInstruction = QNA_SYSTEM_INSTRUCTION.replace('{{query}}', query);
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
