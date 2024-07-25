import { spawn } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { createClient } from '@/utils/supabase/server';

import { SpeechClient } from '@google-cloud/speech';
import { Storage } from '@google-cloud/storage';

import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const apiKey = process.env.Gemini_API;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const bucketName = 'geminiai-transcript';

const uploadStreamToGCS = async (destination: string) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destination);
  const passThroughStream = file.createWriteStream({
    resumable: false,
    contentType: 'audio/wav',
  });
  return passThroughStream;
};

const extractAndUploadAudio = async (buffer: Buffer): Promise<string> => {
  console.log('Extracting and uploading audio ...');
  const destFileName = 'output.wav';
  const gcsUri = `gs://${bucketName}/${destFileName}`;

  const ffmpeg = spawn('ffmpeg', [
    '-i',
    'pipe:0',
    '-ac',
    '1',
    '-acodec',
    'pcm_s16le',
    '-ar',
    '16000',
    '-f',
    'wav',
    'pipe:1',
  ]);

  const uploadStream = await uploadStreamToGCS(destFileName);

  return new Promise((resolve, reject) => {
    ffmpeg.stdin.write(buffer);
    ffmpeg.stdin.end();

    ffmpeg.stdout
      .pipe(uploadStream)
      .on('finish', () => {
        console.log('Audio uploaded to GCS successfully. ⭐✅');
        resolve(gcsUri);
      })
      .on('error', reject);

    ffmpeg.stderr.on('data', (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpeg.on('error', (error) => {
      reject(`ffmpeg error: ${error}`);
    });
  });
};

const transcribeAudio = async (gcsUri: string): Promise<string> => {
  const client = new SpeechClient();

  // console.log('gcsUri : ' + gcsUri)

  const audio = {
    uri: gcsUri,
  };

  const config = {
    encoding: 'LINEAR16' as const,
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio,
    config,
  };

  const [operation] = await client.longRunningRecognize(request);
  const [response] = await operation.promise();

  const transcription = response
    .results!.map((result) => result.alternatives![0].transcript)
    .join('\n');

  console.log('Audio trascripted sccussfully .... :)');
  return transcription;
};

const generationConfig = {
  temperature: 0.7,
  topP: 0.85,
  topK: 50,
  maxOutputTokens: 512,
  responseMimeType: 'application/json',
};

// for Extrack KeyWord from Transcript

interface AIresponse {
  keywords: string[];
  questions: string[];
}

const extractKeywordsAndQuestions = async (transcript: string) => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const inputMessage = `
    {
      "role": "Global Expert in extracting information from transcripts",
      "context": "Process the following transcript to extract the most important and relevant keywords and five small 3 to 5 word questions. Keywords should be used for finding related YouTube videos and other online resources. Questions should be used for discussion with AI and other online resources and in the question not use any special character like inverted comma and other. Ensure both keywords and questions are specific to the context of the transcript and highly relevant.",
      "transcript": "${transcript.replace(/"/g, '\\"')}",
      "response_format": "json",
      "example": { "keywords": ["example keyword"], "questions": ["example question"] }
    }`;

    const result = await chatSession.sendMessage(inputMessage);
    const responseText = result.response.text();
    console.log(responseText);
    const sanitizedResponseText = responseText.replace(/\r?\n|\r/g, '');
    const extractedData = await JSON.parse(sanitizedResponseText) as AIresponse;

    return extractedData;
  }
  catch (error) {
    console.error('Error in extractKeywordsAndQuestions:', (error as Error).message);
    throw new Error(`Error in extractKeywordsAndQuestions: ${(error as Error).message}`);
  }
};

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Use POST method to extract and transcribe audio.' });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as Blob | null;

    if (!file) {
      return NextResponse.json({ error: 'File blob is required.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const gcsUri = await extractAndUploadAudio(buffer);
    const transcription = await transcribeAudio(gcsUri);

    //extract keywords
    const reliventData = await extractKeywordsAndQuestions(transcription) as AIresponse;

    if (!reliventData) {
      return NextResponse.json({ error: 'No data found' }, { status: 400 });
    }

    const keywordsArr = reliventData.keywords;
    const questionsArr = reliventData.questions;

    const supabaseClient = createClient();

    const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

    const video_id = uuidv4();

    console.log('user 🆔 : ' + uuid);

    //now time to insert the transcript and keyword into supabase
    const { error } = await supabaseClient
      .from('transcriptdata')
      .insert({
        uuid: uuid, videoid: video_id, transcript: transcription, keywords: keywordsArr,
        basic_questions: questionsArr
      });

    if (error) {
      console.log('Occur while trascription is upload in DB: ' + error.details);
    }

    return NextResponse.json({ keywordsArr, transcription });
  } catch (error) {
    console.log('This is Error:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
