import { createClient } from '@/utils/supabase/client';
import { type NextRequest, NextResponse } from 'next/server';

import { API_KEY, genAI, model, safetySettings } from '@/app/api/v1/gemini-settings';

export const dynamic = 'force-dynamic';

const supabase = createClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const video_id = req.nextUrl.searchParams.get('LearningId');

    if (video_id !== null) {
      const transcript = await getTranscript(video_id);

      if (!transcript) return NextResponse.json({ status: 404, error: 'Transcript not found' });

      const eventList = await getEventList(transcript);

      if (!eventList) return NextResponse.json({ status: 400, body: 'eventList is empty' });

      return NextResponse.json({ status: 200, body: eventList });
    } else {
      return new NextResponse('video_id is required', { status: 400 });
    }
  } catch (error) {
    console.log('Error when getting event list: ' + error);
  }
  return NextResponse.json({ status: 400, error: 'video_id is required' });
}

async function getEventList(transcript: string): Promise<any> {
  if (!API_KEY) return new Response('Missing API key', { status: 400 });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.85,
    topK: 50,
    maxOutputTokens: 80000,
    responseMimeType: 'application/json',
  };

  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });

  const date = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = date.toISOString().split('T')[0];

  const prompt = `Extract tasks and deadlines from the meeting transcript provided below and structure them in JSON format suitable for scheduling with the Google Calendar API. Then, create the corresponding events in the calendar.

    TimeZone: ${timeZone}
    Date: ${formattedDate}

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
    const result = await genModel.generateContent(prompt.trim());
    const eventList = JSON.parse(await result.response.text());
    return eventList;
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw new Error('Failed to get event list from transcript.');
  }
}

async function getTranscript(videoid: string) {
  try {
    //this is only for declaretion

    const { data, error } = await supabase
      .from('transcriptdata')
      .select('transcript')
      .eq('videoid', videoid);

    if (error) {
      console.log('Error fetching transcript from DB: ' + error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data[0].transcript;
    } else {
      console.log('No transcript found for the provided UUID');
      return null;
    }
  } catch (err) {
    console.log('Error when feach Transcript from DB : ' + err);
  }
}