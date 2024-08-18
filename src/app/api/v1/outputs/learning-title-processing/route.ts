import { DEFAULT_TITLE_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { createClient } from '@/utils/supabase/client';
import dotenv from 'dotenv';
import { type NextRequest, NextResponse } from 'next/server';
import { genAI, generationConfig, model, safetySettings } from '../../gemini-settings';
import { getOutputByLearningId } from '../repository';

dotenv.config();

export async function PATCH(req: NextRequest) {
  try {
    const supabase = createClient();

    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');

    if (!myLearningId) return NextResponse.json({ error: 'Missing myLearningId' }, { status: 400 });

    const output = await getOutputByLearningId(myLearningId);
    if (!output)
      return NextResponse.json({
        status: 404,
        error: 'Error getting output',
      });

    const prompt = DEFAULT_TITLE_SYSTEM_INSTRUCTION + output[0].summary;
    const title = await generateDefaultTitle(prompt);

    const { data, error } = await supabase
      .from('mylearnings')
      .update({ title: title })
      .eq('id', myLearningId);

    if (error) {
      console.error('Error updating the learning title:', error.message);
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
