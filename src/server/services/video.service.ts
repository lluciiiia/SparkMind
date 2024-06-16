import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/files';

const API_KEY = (process.env.Gemini_API as string) || '';
const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

async function uploadToGemini(filePath: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath),
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files: any[]) {
  console.log('Waiting for file processing...');
  for (const name of files.map((file: any) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === 'PROCESSING') {
      process.stdout.write('.');
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== 'ACTIVE') {
      throw new Error(`File ${file.name} failed to process`);
    }
  }
  console.log('...all files ready\n');
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const generationConfig: {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  responseMimeType: string;
} = {
  temperature: 0.1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 1048576,
  responseMimeType: 'text/plain',
};

export { uploadToGemini, waitForFilesActive, model, generationConfig };
