import axios from "axios";
import { createClient } from "@/utils/supabase/client";

import { type NextRequest, NextResponse } from "next/server";
import { saveYoutubeOutput } from "../youtube/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get("id");
    const pageToken = url.searchParams.get("pageToken");

    if (!myLearningId) {
      return NextResponse.json(
        { error: "Error extracting myLearningId" },
        { status: 400 }
      );
    }

    const myLearning = await getMyLearningById(myLearningId);
    if (!myLearning)
      return NextResponse.json({
        status: 404,
        error: "Error getting my learning",
      });

    const youtubeResponse = await saveYoutubeOutput(
      myLearning[0].input,
      pageToken,
      myLearningId
    );

    if (youtubeResponse.status != 200)
      return NextResponse.json({ status: youtubeResponse.status });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error saving output in DB:", error);
    return NextResponse.json(
      { error: "Failed to save output in DB" },
      { status: 500 }
    );
  }
}

async function getMyLearningById(id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("mylearnings")
    .select("id, input")
    .eq("id", id);

  return data;
}
