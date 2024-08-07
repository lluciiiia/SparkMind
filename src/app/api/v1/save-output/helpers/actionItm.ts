import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function saveActionItem(
  todoList: string,
  pageToken: string | null,
  myLearningId: string,
  output: any
) {
  return NextResponse.json({ status: 200, body: "success" });
}
