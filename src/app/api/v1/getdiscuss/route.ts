import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

async function getTranscript(videoid: string) {
    try {
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

export async function GET(req: NextRequest, res: NextResponse) {
    try {

        const video_id = req.nextUrl.searchParams.get('videoid');
        console.log('video_id 🆔 : ' + video_id);

        if (video_id !== null) {
            const transcript = await getTranscript(video_id);

            if (!transcript) {
                return NextResponse.json({ status: 404, error: 'Transcript not found' });
            }

            const basicQue = await getBasicQuestion(video_id);

            if (!basicQue) {
                return NextResponse.json({ status: 400, body: 'eventList is empty' });
            }

            return NextResponse.json({ status: 200, basicQue: basicQue, transcript: transcript });
        } else {
            return new NextResponse('video_id is required', { status: 400 });
        }
    }
    catch (error) {
        console.log('Error in GetEventList api : ' + error);
    }
    return NextResponse.json({ status: 400, error: 'video_id is required' });
}
