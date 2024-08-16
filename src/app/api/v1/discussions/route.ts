import { createClient } from '@/utils/supabase/client';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const video_id = req.nextUrl.searchParams.get('videoid');
    console.log('Received video_id:', video_id);

    if (!video_id) {
      console.error('video_id is null or undefined');
      return NextResponse.json({ status: 400, error: 'video_id is required' });
    }

    const transcript = await getTranscript(video_id);

    if (!transcript) {
      console.error('Transcript not found for video_id:', video_id);
      return NextResponse.json({ status: 404, error: 'Transcript not found' });
    }

    let basicQue = await getBasicQuestion(video_id);

    if (!basicQue) {
      basicQue = [];
    }

    return NextResponse.json({ status: 200, basicQue: basicQue, transcript: transcript });
  } catch (error) {
    console.error('Error when getting discussions:', error);
    return NextResponse.json({ status: 500, error: 'Internal server error' });
  }
}

async function getTranscript(videoid: string) {
  try {
    if (!videoid) {
      return NextResponse.json({ status: 400, error: 'video_id is required' });
    }

    const { data: transcriptData, error: transcriptError } = await supabase
      .from('transcriptdata')
      .select('transcript')
      .eq('videoid', videoid);

    if (transcriptError) {
      console.log('Error fetching transcript from DB: ' + transcriptError.message);
      return null;
    }

    if (transcriptData && transcriptData.length > 0) {
      return transcriptData[0].transcript;
    } else {
      // Fetch summary using learning_id if transcript is not found
      const { data: summaryData, error: summaryError } = await supabase
        .from('outputs')
        .select('summary')
        .eq('learning_id', videoid);

      if (summaryError) {
        console.log('Error fetching summary from DB: ' + summaryError.message);
        return null;
      }

      if (summaryData && summaryData.length > 0) {
        return summaryData[0].summary;
      } else {
        console.log('No transcript or summary found for the provided videoid');
        return null;
      }
    }
  } catch (err) {
    console.log('Error when fetch Transcript from DB: ' + err);
    return null;
  }
}

async function getBasicQuestion(videoid: string) {
  try {
    const { data, error } = await supabase
      .from('transcriptdata')
      .select('basic_questions')
      .eq('videoid', videoid);

    if (error) {
      console.log('Error fetching transcript from DB: ' + error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data[0].basic_questions;
    } else {
      console.log('No transcript found for the provided UUID');
      return null;
    }
  } catch (err) {
    console.log('Error when feach Transcript from DB : ' + err);
  }
}
