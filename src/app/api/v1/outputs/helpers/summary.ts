import { SUMMARY_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';

dotenv.config();

export async function fetchSummaryData(query: string): Promise<string> {
  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });
  const result = await genModel.generateContent(query);
  const response = result.response;
  const text = await response.text();
  return text;
}

export async function saveSummaryOutput(myLearningId: string, topic: string, output: any) {
  try {
    const systemInstruction = SUMMARY_SYSTEM_INSTRUCTION.replace('{{topic}}', topic);
    const response = await fetchSummaryData(systemInstruction);

    const supabase = createClient();

    if (!output) {
      const { data, error } = await supabase
        .from('outputs')
        .insert([{ learning_id: myLearningId, summary: JSON.stringify(response) }])
        .select();

      if (error) {
        return NextResponse.json({ error: 'Error inserting summary output' }, { status: 500 });
      }
    } else {
      const { data, error } = await supabase
        .from('outputs')
        .update([{ summary: response }])
        .eq('learning_id', myLearningId);

      if (error) {
        return NextResponse.json({ error: 'Error updating summary output' }, { status: 500 });
      }
    }

    return NextResponse.json({ status: 200, body: 'success' });
  } catch (error) {
    console.error('Error fetching or generating summary data:', error);
    return NextResponse.json(
      { error: 'Error fetching or generating summary data' },
      { status: 500 },
    );
  }
}
