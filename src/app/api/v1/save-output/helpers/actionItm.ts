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

  const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    {}
  );

  console.log(JSON.stringify(response.data));

  const supabase = createClient();


  if (!output) {
    const { data, error } = await supabase
      .from("outputs")
      .insert([
        { learning_id: myLearningId, youtube: JSON.stringify(response.data) },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Error inserting youtube output" },
        { status: 500 }
      );
    }
  } else {
    const { data, error } = await supabase
      .from("outputs")
      .update([{ youtube: JSON.stringify(response.data) }])
      .eq("learning_id", myLearningId);

    if (error) {
      return NextResponse.json(
        { error: "Error updating youtube output" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ status: 200, body: "success" });
}