import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

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

(async () => {
  const { text } = await generateText({
    model: model,
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });

  console.log(text);
})();