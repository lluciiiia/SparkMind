import { NextRequest, NextResponse } from "next/server";
import { search } from "@/server/services";

export const dynamic = "force-dynamic";

export async function saveFurtherInfoOutput(
  query: string,
  myLearningId: string,
) {
  const response = await search(query);
  return response.items;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");

  if (!topic || typeof topic !== "string") {
    return NextResponse.json(
      { error: "Invalid or missing topic parameter" },
      { status: 400 },
    );
  }

  try {
    const furtherInfo = await saveFurtherInfoOutput(topic, "L");
    return NextResponse.json(furtherInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching or generating further info data:", error);
    return NextResponse.json(
      { error: "Failed to generate further info" },
      { status: 500 },
    );
  }
}
