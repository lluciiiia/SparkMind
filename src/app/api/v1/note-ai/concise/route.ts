import { type NextRequest, NextResponse } from "next/server";
import {
  API_KEY,
  genAI,
  model,
  generationConfig,
  safetySettings,
} from "../../gemini-settings";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { note } = (await req.json()) as { note: string };

    if (!API_KEY) return new Response("Missing API key", { status: 400 });

    const genModel = genAI.getGenerativeModel({
      model,
      generationConfig,
      safetySettings,
    });

    const prompt = systemInstruction + note;

    const geminiRes = await genModel.generateContent(prompt);

    let concisedNote;
    return NextResponse.json({ status: 200, concisedNote });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error makeing the note concise",
    });
  }
}

const systemInstruction = `Task: Make the given text more concise while preserving its original meaning and essential information. Ensure clarity and maintain the tone and style of the original text.
Text: `;
