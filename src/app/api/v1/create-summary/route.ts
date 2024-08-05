import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
console.log("the key", process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);
const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || "",
);

// Define the Zod schema for the summary response
const summarySchema = z.object({
  title: z.string(),
  summary: z.array(
    z.object({
      title: z.string(),
      data: z.string(),
    }),
  ),
});

// Function to fetch summary data from the Google Generative AI
async function fetchSummaryData(query: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(query);
  const response = result.response;
  const text = await response.text();
  console.log("the text", text);
  return text;
}

export async function buildSummary(topic: string) {
  try {
    const prompt = `
    Please generate a comprehensive summary about "${topic}". Your summary should be detailed and well-organized. Follow the Markdown format below:

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

    const response = await fetchSummaryData(prompt);

    // // Extract the main title and the summary content
    // const titleMatch = response.match(/## Title: (.+)/);
    // const summaryMatch = response.match(/\*\*Summary:\*\*\n\n([\s\S]+)/);

    // if (!titleMatch || !summaryMatch) {
    //   throw new Error("Invalid format in AI response");
    // }

    // const mainTitle = titleMatch[1];
    // const summaryText = summaryMatch[1].trim();

    // // Split the summary text into paragraphs with titles and data
    // const paragraphs = [];
    // const lines = summaryText.split("\n");

    // let currentParagraph = { title: "", data: "" };

    // lines.forEach((line) => {
    //   const titleMatch = line.match(/\*\*(.+?)\*\*/);
    //   if (titleMatch) {
    //     // If there's already a paragraph being constructed, push it to the array
    //     if (currentParagraph.title) {
    //       paragraphs.push({ ...currentParagraph });
    //     }
    //     // Start a new paragraph
    //     currentParagraph = { title: titleMatch[1], data: "" };
    //   } else {
    //     // Continue the current paragraph
    //     currentParagraph.data += (currentParagraph.data ? " " : "") + line;
    //   }
    // });

    // // Push the last paragraph if it exists
    // if (currentParagraph.title) {
    //   paragraphs.push({ ...currentParagraph });
    // }

    // const parsedData = {
    //   title: mainTitle,
    //   summary: paragraphs,
    // };

    // const validatedData = summarySchema.parse(parsedData);

    return response;
  } catch (error) {
    console.error("Error fetching or generating summary data:", error);
    return null;
  }
}
// Example usage
async function main() {
  const summaryData = await buildSummary("engineer");
  if (summaryData) {
    console.log("data:", summaryData);
  } else {
    console.log("Failed to generate summary.");
  }
}

main();
