import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export const runtime = "edge";
export const maxDuration = 60;
export const preferredRegion = "sin1";

export const model = "gemini-1.5-flash";
export const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
export const genAI = new GoogleGenerativeAI(API_KEY || "");
