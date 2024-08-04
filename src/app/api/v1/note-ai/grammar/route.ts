import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { type NextRequest, NextResponse } from "next/server";

dotenv.config();

export const runtime = "edge";
export const maxDuration = 60;
export const preferredRegion = "sin1";

const model = "gemini-1.5-flash";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

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
