
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { Storage } from '@google-cloud/storage';
import { SpeechClient } from '@google-cloud/speech';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

//Gemini ai imports
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";


const apiKey = process.env.Gemini_API;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
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

const extractAndUploadAudio = async (filepath: string): Promise<string> => {
    console.log('Extracting and uploading audio ...');
    const destFileName = 'output.wav';
    const gcsUri = `gs://${bucketName}/${destFileName}`;

    const ffmpeg = spawn('ffmpeg', [
        '-i', filepath,
        '-ac', '1',
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-f', 'wav',
        'pipe:1'
    ]);

    const uploadStream = await uploadStreamToGCS(destFileName);

    return new Promise((resolve, reject) => {
        ffmpeg.stdout.pipe(uploadStream)
            .on('finish', () => {
                console.log('Audio uploaded to GCS successfully.');
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
    console.log('gcsUri : ' + gcsUri)

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

    const transcription = response.results!
        .map(result => result.alternatives![0].transcript)
        .join('\n');


    console.log('Audio trascripted sccussfully .... :)');
    return transcription;
};

const generationConfig = {
    temperature: 0.7,
    topP: 0.85,
    topK: 50,
    maxOutputTokens: 50,
    responseMimeType: "application/json",
};

const extractKeyword = async (transcript: string) => {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
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
    const keywords = JSON.parse(result.response.text()).keywords
    return keywords;
}


export async function GET(request: NextRequest) {
    return NextResponse.json({ message: 'Use POST method to extract and transcribe audio.' });
}

export async function POST(req: NextRequest) {

    try {

        const formData = await req.formData();

        const file = formData.get("file") as Blob | null;

        if (!file) {
            return NextResponse.json(
                { error: "File blob is required." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const tempFilePath = path.join(process.cwd(), 'temp', 'uploaded-video.mp4');

        await fsPromises.writeFile(tempFilePath, buffer);

        const gcsUri = await extractAndUploadAudio(tempFilePath);
        const transcription = await transcribeAudio(gcsUri);

        // Clean up the temporary file
        await fsPromises.unlink(tempFilePath);

        const keywords = await extractKeyword(transcription);

        console.log(keywords + 'krishna krishna testign 123141');

        return NextResponse.json({ keywords, transcription });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
