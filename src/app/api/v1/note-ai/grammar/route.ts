import { type NextRequest, NextResponse } from "next/server";

import { API_KEY, genAI } from "../../gemini-settings";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { note } = (await req.json()) as { note: string };

    if (!API_KEY) return new Response("Missing API key", { status: 400 });

    let correctedNote;
    return NextResponse.json({ status: 200, correctedNote });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error correcting grammar of the note",
    });
  }
}

const systemInstruction = `Task: Correct the grammar of the given text.
Text: `;
