import axios from "axios";
import { createClient } from "@/utils/supabase/client";

import { type NextRequest, NextResponse } from "next/server";
import { saveYoutubeOutput } from "./helpers/youtube";
import { saveSummaryOutput } from "./helpers/summary";
import { saveQuizOutput } from "./helpers/qna";
import { saveFurtherInfoOutput } from "./helpers/further-info";

export const dynamic = "force-dynamic";
const supabase = createClient();

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

    const { data: myLearning, error: myLearningError } = await getMyLearningById(myLearningId);
    if (!myLearning)
      return NextResponse.json({
        status: 404,
        error: "No learning found",
      });

    if (myLearningError) {
      console.log("myLearningError: ", myLearningError);
      return NextResponse.json(
        { error: "Error getting my learning" },
        { status: 500 }
      );
    }

    const { data: output, error: outputError } = await getOutputByLearningId(myLearningId);
    if (outputError) {
      console.log("outputError: ", outputError);
      return NextResponse.json(
        { error: "Error getting output" },
        { status: 500 }
      );
    }

    const youtubeResponse = await saveYoutubeOutput(
      myLearning[0].input,
      pageToken,
      myLearningId,
      output
    );

    if (youtubeResponse.status != 200)
      return NextResponse.json({ status: youtubeResponse.status });

    const ActionItmResponse = await saveActionItem(
      myLearning[0].input,
      pageToken,
      myLearningId,
      output
    );

    if (ActionItmResponse.status != 200)
      return NextResponse.json({ status: ActionItmResponse.status });

    const summaryResponse = await saveSummaryOutput(
      myLearningId,
      myLearning[0].input,
      output
    );

    if (summaryResponse.status != 200)
      return NextResponse.json({ status: summaryResponse.status });

    const quizResponse = await saveQuizOutput(
      myLearning[0].input,
      myLearningId,
      output
    );

    if (quizResponse.status != 200)
      return NextResponse.json({ status: quizResponse.status });

    const furtherInfoResponse = await saveFurtherInfoOutput(
      myLearning[0].input,
      myLearningId,
      output
    );

    if (furtherInfoResponse.status != 200)
      return NextResponse.json({ status: furtherInfoResponse.status });

    
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
  return await supabase
    .from("mylearnings")
    .select("id, input")
    .eq("id", id);
}

async function getOutputByLearningId(learningId: string) {
  return await supabase
    .from("outputs")
    .select("id")
    .eq("id", learningId);
}
