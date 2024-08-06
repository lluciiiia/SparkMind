import { createClient } from "@/utils/supabase/client";
import dotenv from "dotenv";
import { NextResponse } from "next/server";
import {
  genAI,
  model,
  generationConfig,
  safetySettings,
} from "../../gemini-settings";

dotenv.config();

const SYSTEM_INSTRUCTION = `
Please generate a comprehensive summary about "{{topic}}". Your summary should be detailed and well-organized. Follow the Markdown format below:

## Title: <title>

**Summary:**

1. **<Title of Paragraph 1>**
   <Content of Paragraph 1>

2. **<Title of Paragraph 2>**
   <Content of Paragraph 2>

3. **<Title of Paragraph 3>**
   <Content of Paragraph 3>

...

n. **<Title of Last Paragraph>**
   <Content of Last Paragraph>

Ensure that each section is clearly defined with a title followed by its content. Each title should be in bold and followed by its corresponding content. Use a numbered list for the paragraphs to maintain the order.
`;

// Function to fetch summary data from the Google Generative AI
async function fetchSummaryData(query: string): Promise<string> {
  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });
  const result = await genModel.generateContent(query);
  const response = result.response;
  const text = await response.text();
  console.log("Generated text:", text);
  return text;
}

export async function saveSummaryOutput(myLearningId: string, topic: string) {
  try {
    const systemInstruction = SYSTEM_INSTRUCTION.replace("{{topic}}", topic);
    const response = await fetchSummaryData(systemInstruction);

    const supabase = createClient();

    const { data: learningData, error: learningError } = await supabase
      .from("mylearnings")
      .select("id")
      .eq("id", myLearningId);

    if (learningError) {
      console.error("learningError:", learningError);
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
      console.error("outputError:", outputError);
      return NextResponse.json(
        { error: "Error getting output" },
        { status: 500 }
      );
    }

    if (!outputData) {
      const { data, error } = await supabase
        .from("outputs")
        .insert([{ learning_id: myLearningId, summary: JSON.stringify(response) }])
        .select();

      if (error) {
        return NextResponse.json(
          { error: "Error inserting summary output" },
          { status: 500 }
        );
      }
    } else {
      const { data, error } = await supabase
        .from("outputs")
        .update([{ summary: JSON.stringify(response) }])
        .eq("learning_id", myLearningId);

      if (error) {
        return NextResponse.json(
          { error: "Error updating summary output" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ status: 200, body: "success" });
  } catch (error) {
    console.error("Error fetching or generating summary data:", error);
    return NextResponse.json(
      { error: "Error fetching or generating summary data" },
      { status: 500 }
    );
  }
}
