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
