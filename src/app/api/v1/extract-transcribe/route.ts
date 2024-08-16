import { spawn } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import {
  API_KEY,
  genAI,
  model,
  // generationConfig,
  safetySettings,
} from '@/app/api/v1/gemini-settings';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { PassThrough, Readable } from 'stream';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

import { serviceAccount } from '@/constants/service';
//supabse
import { createClient } from '@/utils/supabase/server';
import { SpeechClient } from '@google-cloud/speech';
//Google Cloude imports
import { Storage } from '@google-cloud/storage';

const bucketName = 'sparkmind-gemini-transcript'; // Replace with your bucket name

const uploadStreamToGCS = async (destFileName: string) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);

  const file = bucket.file(destFileName);
  const passThroughStream = file.createWriteStream({
    resumable: false,
    contentType: 'audio/wav',
  });

  return passThroughStream;
};

// Convert Buffer to Readable Stream
const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // End the stream
  return stream;
};

const UploadAudio = async (buffer: Buffer, filename: string): Promise<string> => {
  const destFileName = `output${filename}.wav`;
  const gcsUri = `gs://${bucketName}/${destFileName}`;

  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destFileName);

  return new Promise((resolve, reject) => {
    const writeStream = file.createWriteStream({
      resumable: false,
      contentType: 'audio/wav',
    });

    bufferToStream(buffer)
      .pipe(writeStream)
      .on('finish', () => {
        console.log('Audio uploaded to GCS successfully. ⭐✅');
        resolve(gcsUri);
      })
      .on('error', (err) => {
        console.error(`GCS upload error: ${err.message}`);
        reject(`GCS upload error: ${err.message}`);
      });
  });
};

const transcribeAudio = async (gcsUri: string): Promise<string> => {
  const client = new SpeechClient();

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

  console.log('Audio transcribed successfully .... :)');
  console.log(transcription);
  return transcription;
};

interface AIresponse {
  keywords: string[];
  questions: string[];
}

// for Extract Keyword from Transcript
const extractKeywordsAndQuestions = async (transcript: string) => {
  try {
    // Configuration based on different types of output
    const generationConfig = {
      temperature: 0.7,
      topP: 0.85,
      topK: 50,
      maxOutputTokens: 1048576,
      responseMimeType: 'application/json',
    };

    const genModel = genAI.getGenerativeModel({
      model,
      generationConfig,
      safetySettings,
    });

    const inputMessage = `
    {
      "role": "Global Expert in extracting information from transcripts",
      "context": "Process the following transcript to extract the most important and relevant keywords and five small 3 to 5 word questions. Keywords should be used for finding related YouTube videos and other online resources. Questions should be used for discussion with AI and other online resources and in the question not use any special character like inverted comma and other. Ensure both keywords and questions are specific to the context of the transcript and highly relevant.",
      "transcript": "${transcript.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",
      "response_format": "json",
      "example": { "keywords": ["example keyword"], "questions": ["example question"] }
    }`;

    const result = await genModel.generateContent(inputMessage);
    const responseText = result.response.text();
    console.log(responseText);
    const sanitizedResponseText = responseText.replace(/\r?\n|\r/g, '');
    const extractedData = (await JSON.parse(sanitizedResponseText)) as AIresponse;

    return extractedData;
  } catch (error) {
    console.error('Error in extract Keywords And Questions:', (error as Error).message);
    throw new Error(`Error in extract Keywords And Questions: ${(error as Error).message}`);
  }
};

const deleteAudioFile = async (videoid: string) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const destFileName = `output${videoid}.wav`;
  const file = bucket.file(destFileName);

  try {
    await file.delete();
    console.log(`File ${destFileName} deleted successfully.`);
  } catch (error) {
    console.error('Error while deleting Audio File from GCloud:', error);
    throw error;
  }
};

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Use POST method to extract and transcribe audio.' });
}

export async function PATCH(req: NextRequest) {
  try {
    if (!API_KEY) {
      console.error('Missing API key');
      return NextResponse.json({ error: 'Missing API key' }, { status: 400 });
    }

    const formData = await req.formData();

    const file = formData.get('file') as Blob | null;
    const learning_id = formData.get('learningid') as string;

    if (!learning_id) {
      console.error('Learning ID is missing');
      return NextResponse.json({ error: 'Learning ID is missing' }, { status: 400 });
    }

    if (!file) {
      console.error('File blob is required');
      return NextResponse.json({ error: 'File blob is required' }, { status: 400 });
    }

    const supabaseClient = createClient();

    const { data: userData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !userData.user) {
      console.error('User authentication error:', userError?.message || 'User not found');
      return NextResponse.json({ error: 'Please Login or SignUp' }, { status: 401 });
    }

    const uuid = userData.user.id;
    const buffer = Buffer.from(await file.arrayBuffer());
    const video_id = learning_id;
    const filename = `${uuid}_${video_id}`;

    try {
      const gcsUri = await UploadAudio(buffer, filename);
      const transcription = await transcribeAudio(gcsUri);
      await deleteAudioFile(filename);

      const relevantData = await extractKeywordsAndQuestions(transcription);
      if (!relevantData || Object.keys(relevantData).length === 0) {
        console.error('No relevant data extracted from transcription');
        return NextResponse.json({ error: 'Failed to extract relevant data' }, { status: 500 });
      }

      const { keywords: keywordsArr, questions: questionsArr } = relevantData;

      const { error: updateError } = await supabaseClient
        .from('transcriptdata')
        .update({
          transcript: transcription,
          keywords: keywordsArr,
          basic_questions: questionsArr,
        })
        .eq('uuid', uuid)
        .eq('videoid', video_id);

      if (updateError) {
        console.error('Error updating transcription data:', updateError);
        return NextResponse.json({ error: 'Failed to update transcription data' }, { status: 500 });
      }

      return NextResponse.json({ keywordsArr, transcription });
    } catch (processingError) {
      console.error('Error processing audio:', processingError);
      return NextResponse.json(
        {
          error: `Error processing audio file: ${processingError instanceof Error ? processingError.message : processingError}`,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `An unexpected error occurred: ${error instanceof Error ? error.message : error}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) return new Response('Missing API key', { status: 400 });

    const formData = await req.formData();

    const file = formData.get('file') as Blob | null;
    const learning_id = formData.get('learningid') as string;

    if (learning_id === null) {
      return NextResponse.json({ error: 'learning Id is missing' }, { status: 500 });
    }

    if (!file) {
      return NextResponse.json({ error: 'File blob is required.' }, { status: 400 });
    }

    var supabaseClient = createClient();

    const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

    if (uuid === undefined) {
      console.log('Please Login or SignUp');
      return NextResponse.json({ error: 'Please Login or SignUp' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const video_id = learning_id;
    const filename = uuid + '_' + video_id;

    const gcsUri = await UploadAudio(buffer, filename);
    const transcription = await transcribeAudio(gcsUri);

    await deleteAudioFile(filename);

    const relevantData = (await extractKeywordsAndQuestions(transcription)) as AIresponse;

    if (!relevantData) {
      return NextResponse.json({ error: 'No data found' }, { status: 400 });
    }

    const keywordsArr = relevantData.keywords;
    const questionsArr = relevantData.questions;

    //now time to insert the transcript and keyword into supabase
    const { error } = await supabaseClient.from('transcriptdata').insert({
      uuid: uuid,
      videoid: video_id,
      transcript: transcription,
      keywords: keywordsArr,
      basic_questions: questionsArr,
    });

    if (error) {
      console.log('Occur while transcription is upload in DB: ' + error.details);
    }

    return NextResponse.json({ keywordsArr, transcription });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
