import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; 

//Gemini - ai Import
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

export const dynamic = 'force-dynamic';

async function getEventList(transcript: string): Promise<any> {

    const apiKey = process.env.Gemini_API;

    if (!apiKey) {
        throw new Error("API key not found in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey!);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 0.7,
        topP: 0.85,
        topK: 50,
        maxOutputTokens: 5000,
        responseMimeType: "application/json",
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const prompt = `Extract tasks and deadlines from the meeting transcript provided below and structure them in JSON format suitable for scheduling with the Google Calendar API. Then, create the corresponding events in the calendar.

    TimeZone: GMT+5:30
    Date: June 23, 2024

    Transcript:
    ${transcript}

    Note: Remove attendance details and ensure the tasks include relevant titles, descriptions, and deadlines.
    
    JSON Format Example:
    [
        {
            "summary": "Task Title",
            "description": "Task Description",
            "start": {
                "dateTime": "2024-06-23T10:00:00+05:30",
                "timeZone": "GMT+5:30"
            },
            "end": {
                "dateTime": "2024-06-23T11:00:00+05:30",
                "timeZone": "GMT+5:30"
            }
        },
        ...
    ]`;

    try {
        const result = await chatSession.sendMessage(prompt.trim());
        const eventList = JSON.parse(await result.response.text());
        return eventList;
    } catch (error) {
        console.error("Error fetching event list:", error);
        throw new Error("Failed to get event list from transcript.");
    }

}

async function getTranscript(uuid: string) {
    try {

        //this is only for declaretion 
        const supabase = createClient();

        let { data, error } = await supabase
            .from('transcriptdata')
            .select('transcript')
            .eq('uuid', uuid);

        if (error) {
            console.log('Error fetching transcript from DB: ' + error.message);
            return null;
        }

        if (data && data.length > 0) {
            return data[0].transcript;
        }
        else {
            console.log('No transcript found for the provided UUID');
            return null;
        }
    }
    catch (err) {
        console.log('Error when feach Transcript from DB : ' + err);
    }
}


export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const uuid = req.nextUrl.searchParams.get('uuid');
        console.log("user 🆔 : " + uuid);

        if (uuid) {
            const transcript = await getTranscript(uuid);

            if (!transcript) {
                return NextResponse.json({ status: 404, error: 'Transcript not found' });
            }

            const eventList = await getEventList(transcript);

            if (!eventList) {
                return NextResponse.json({ status: 400, body: 'eventList is empty' });
            }

            return NextResponse.json({ status: 200, body: eventList })
        }
        else {
            return new NextResponse('UUID is required', { status: 400 });
        }
    }
    catch (error) {
        console.log("Error in GetEventList api : " + error)
    }
    return NextResponse.json({ status: 400, error: 'UUID is required' });
}