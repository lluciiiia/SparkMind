import { DEFAULT_TITLE_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';

dotenv.config();

async function generateDefaultTitle(query: string): Promise<string> {
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

export async function saveDefaultLearningTitle(myLearningId: string, summary: any) {
  try {
    const prompt = DEFAULT_TITLE_SYSTEM_INSTRUCTION + summary;
    const title = await generateDefaultTitle(prompt);

    const supabase = createClient();

    const { data, error } = await supabase
      .from('mylearnings')
      .update({ title: title })
      .eq('id', myLearningId);

    if (error) {
      console.error('Database Error:', error.message);
      return NextResponse.json({ status: 400, body: error.message });
    }

    return NextResponse.json({ status: 200, body: 'success' });
  } catch (error) {
    console.error('Error fetching or generating default learning title:', error);
    return NextResponse.json(
      { error: 'Error fetching or generating default learning title' },
      { status: 500 },
    );
  }
}
