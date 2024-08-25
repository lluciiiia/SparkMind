//Gemini disccusion Recommendation Question

import { SUMMARY_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { extractKeywordsAndQuestions } from '../../extract-transcribe/route';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';
import { fetchSummaryData } from './summary';

interface AIresponse {
  keywords: string[];
  questions: string[];
}

dotenv.config();

export async function saveRecQueOutput(myLearningId: string, topic: string, output: any) {
  try {
    const systemInstruction = SUMMARY_SYSTEM_INSTRUCTION.replace('{{topic}}', topic);
    const response = await fetchSummaryData(systemInstruction);

    const supabase = createClient();

    const relevantData = (await extractKeywordsAndQuestions(response)) as AIresponse;

    let rec_questions = relevantData.questions;

    if (relevantData.questions.length === 0) {
      rec_questions = [];
    }

    if (!output) {
      const { data, error } = await supabase
        .from('outputs')
        .insert([{ learning_id: myLearningId, rec_questions: rec_questions }])
        .select();

      if (error) {
        return NextResponse.json({ error: 'Error inserting summary output' }, { status: 500 });
      }
    } else {
      const { data, error } = await supabase
        .from('outputs')
        .update([{ rec_questions: rec_questions }])
        .eq('learning_id', myLearningId);

      if (error) {
        return NextResponse.json({ error: 'Error updating summary output' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 200, body: 'success' });
  } catch (error) {
    console.error('Error store Recommendation Question data:', error);
    return NextResponse.json(
      { error: 'Error store Recommendation Question data' },
      { status: 500 },
    );
  }
}
