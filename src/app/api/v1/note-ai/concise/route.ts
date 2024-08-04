import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { type NextRequest, NextResponse } from "next/server";

dotenv.config();
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    let concisedNote;
    return NextResponse.json({ status: 200, concisedNote });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error makeing the note concise",
    });
  }
}
