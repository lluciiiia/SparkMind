import { CONCISE_NOTE_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { type NextRequest, NextResponse } from 'next/server';
import { API_KEY, genAI, generationConfig, model, safetySettings } from '../../gemini-settings';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { note } = (await req.json()) as { note: string };

    if (!API_KEY) return new Response('Missing API key', { status: 400 });

    const genModel = genAI.getGenerativeModel({
      model,
      generationConfig,
      safetySettings,
    });

    const prompt = CONCISE_NOTE_SYSTEM_INSTRUCTION + note;

    const geminiRes = await genModel.generateContent(prompt);

    const concisedNote = geminiRes.response.text().trim();
    return NextResponse.json({ status: 200, concisedNote });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: 'Error makeing the note concise',
    });
  }
}
