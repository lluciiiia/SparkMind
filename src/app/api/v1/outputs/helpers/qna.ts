import { QNA_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';

dotenv.config();

interface QuestionItem {
  id?: number;
  question: string;
  options: string[];
  answer: string[];
  multipleAnswers: boolean;
}

interface CurrentQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string[];
}

function parseQuizText(text: string): QuestionItem[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);
  const questions: QuestionItem[] = [];
  let currentQuestion: CurrentQuestion | null = null;
  let parsingAnswers = false;

  lines.forEach((line) => {
    if (line.startsWith('## Answer Key:')) {
      parsingAnswers = true;
      return;
    }

    if (!parsingAnswers) {
      const questionMatch = line.match(/^(\d+)\.\s*\*\*(.+)\*\*$/);
      if (questionMatch) {
        if (currentQuestion) {
          questions.push({
            id: (currentQuestion as CurrentQuestion).id,
            question: (currentQuestion as CurrentQuestion).question,
            options: (currentQuestion as CurrentQuestion).options,
            answer: (currentQuestion as CurrentQuestion).answer,
            multipleAnswers: (currentQuestion as CurrentQuestion).answer.length > 1,
          });
        }
        currentQuestion = {
          id: Number.parseInt(questionMatch[1]),
          question: questionMatch[2],
          options: [],
          answer: [],
        };
      } else if (currentQuestion) {
        const optionMatch = line.match(/^([a-d])\)\s*(.+)$/);
        if (optionMatch) {
          currentQuestion.options.push(optionMatch[2]);
        }
      }
    } else {
      const answerMatch = line.match(/^(\d+)\.\s*\*\*([a-d])\)\s*(.+)\*\*$/);
      if (answerMatch && questions[Number(answerMatch[1]) - 1]) {
        const questionIndex = Number(answerMatch[1]) - 1;
        const answerIndex = answerMatch[2].charCodeAt(0) - 97;
        questions[questionIndex].answer = [questions[questionIndex].options[answerIndex]];
      }
    }
  });

  if (currentQuestion) {
    questions.push({
      id: (currentQuestion as CurrentQuestion).id,
      question: (currentQuestion as CurrentQuestion).question,
      options: (currentQuestion as CurrentQuestion).options,
      answer: (currentQuestion as CurrentQuestion).answer,
      multipleAnswers: (currentQuestion as CurrentQuestion).answer.length > 1,
    });
  }

  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    answer: q.answer,
    multipleAnswers: q.answer.length > 1,
  }));
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string[];
  id: number;
}

function truncateQuery(query: string, maxLength = 1000): string {
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
  console.log('text', text);
  const parsedData = parseQuizText(text);
  console.log('parsedData', JSON.stringify(parsedData, null, 2));
  return parsedData;
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
