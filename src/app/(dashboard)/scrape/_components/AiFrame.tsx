import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OutputSchema } from '@/schema';
import { generateText } from 'ai';
import React from 'react';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { marked } from 'marked';



const studyGuidePrompt = (topic: string, websiteData: string): string => `
You are a helpful AI assistant creating a concise and informative study guide on the topic of "${topic}" using information extracted from the provided website content.

## Website Content:

\`\`\`
${websiteData} 
\`\`\`

## Study Guide Requirements:

* **Concise and Focused:**  Prioritize key concepts and essential information for understanding the topic. 
* **Organized Structure:** Divide the content into logical sections (e.g., Introduction, Key Concepts, Examples, Applications, Summary) using headings and subheadings.
* **Clear Language:** Use plain language and avoid jargon where possible.
* **Examples and Illustrations:** When applicable, include illustrative examples to aid understanding.

## Begin generating the study guide:
`;

const AiFrame = async ({
  topic,
  websiteData,
}: {
  topic: string;
  websiteData: string;
}) => {
  const googleGenerativeAI = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  
  const model = googleGenerativeAI('models/gemini-1.5-pro-latest', {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  });
  const { text } = await generateText({
    model: model,
    prompt: studyGuidePrompt(topic, websiteData),
  });
  const htmlContent = await marked(text);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic}</CardTitle>
      </CardHeader>
      <CardContent>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </CardContent>
    </Card>
  );
};

export { AiFrame };
