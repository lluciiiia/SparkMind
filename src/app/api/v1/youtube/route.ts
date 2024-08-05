import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function saveYoutubeOutput(
  query: string,
  pageToken: string | null,
  myLearningId: string
) {
  const apiKey = process.env.GOOGLE_YOUTUBE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "API key is missing" }, { status: 500 });
  }

  const params: {
    part: string;
    q: string;
    type: string;
    maxResults: number;
    key: string;
    pageToken?: string;
  } = {
    part: "snippet",
    q: query,
    type: "video",
    maxResults: 10,
    key: apiKey,
  };

  if (pageToken) {
    params.pageToken = pageToken;
  }

  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/search",
    { params }
  );

  console.log(JSON.stringify(response.data));

  const supabase = createClient();

  const { data: learningData, error: learningError } = await supabase
    .from("mylearnings")
    .select("id")
    .eq("id", myLearningId);

  if (learningError) {
    console.log("learningError: ", learningError);
    return NextResponse.json(
      { error: "Error getting my learning" },
      { status: 500 }
    );
  }

  if (!learningData) {
    return NextResponse.json({ error: "No learning found" }, { status: 404 });
  }

  const { data: outputData, error: outputError } = await supabase
    .from("outputs")
    .select("id")
    .eq("id", myLearningId);



  if (outputError) {
    console.log("outputError: ", learningError);
    return NextResponse.json(
      { error: "Error getting my learning" },
      { status: 500 }
    );
  }

  if (!outputData) {
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
