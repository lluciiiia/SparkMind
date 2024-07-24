import { spawn } from 'child_process';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

//supabse
import { createClient } from '@/utils/supabase/server';
import { SpeechClient } from '@google-cloud/speech';
//Google Cloude imports
import { Storage } from '@google-cloud/storage';

//Gemini ai imports
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

const apiKey = process.env.Gemini_API;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const bucketName = 'geminiai-transcript'; // Replace with your bucket name

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

const extractAndUploadAudio = async (buffer: Buffer, videoid: string): Promise<string> => {
  console.log('hello videoid : ' + videoid);
  console.log('Extracting and uploading audio ...');
  const destFileName = `output${videoid}.wav`;
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
      .on('error', reject); //shows processig status

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
  //const gcsUri = `gs://geminiai-transcript/output.wav`;
  console.log('gcsUri : ' + gcsUri);

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
  console.log(transcription);
  return transcription;
};

const generationConfig = {
  temperature: 0.7,
  topP: 0.85,
  topK: 50,
  maxOutputTokens: 50,
  responseMimeType: 'application/json',
};

// for Extrack KeyWord from Transcript
const extractKeyword = async (transcript: string) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const inputMessage = `
    {
      "role": "Global Expert in giving best keywords from transcripts of online meetings. Student and employee education depend on you now.",
      "context": "Extract the most important and relevant keywords from the following transcript. These keywords will be used to find related YouTube videos and other online resources. Please ensure the keywords are specific to the context of the transcript and highly relevant.",
      "transcript": "${transcript}",
      "response_format": "json"
    }
    `;

  const result = await chatSession.sendMessage(inputMessage);
  const keywords = (JSON.parse(result.response.text()) as any).keywords;
  return keywords;
};

const deleteAudioFile = (videoid: string) => {
  const storage = new Storage();
  const bucket = storage.bucket(bucketName);
  const destFileName = `output${videoid}.wav`;
  const file = bucket.file(destFileName);
  file
    .delete()
    .then((data) => {
      console.log(`${destFileName} deleted.`);
    })
    .catch((error) => {
      console.log('Error while deleting Audio File from GCloud : ' + error);
      return error;
    });
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

    var supabaseClient = createClient();

    const uuid = (await supabaseClient.auth.getUser()).data.user?.id;

    console.log('user 🆔 : ' + uuid);

    if (uuid === undefined) {
      console.log('Please Login or SignUp');
      return NextResponse.json({ error: 'Please Login or SignUp' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const video_id = uuidv4();

    const gcsUri = await extractAndUploadAudio(buffer, video_id);
    const transcription = await transcribeAudio(gcsUri);

    //delete the Audio file form Google Clode bucket
    deleteAudioFile(video_id);

    //extract keywords
    const keywordsArr = await extractKeyword(transcription);

    //now time to insert the transcript and keyword into supabase
    const { error } = await supabaseClient
      .from('transcriptdata')
      .insert({ uuid: uuid, videoid: video_id, transcript: transcription, keywords: keywordsArr });

    if (error) {
      console.log('Occur while trascription is upload in DB: ' + error.details);
    }

    return NextResponse.json({ keywordsArr, transcription });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
