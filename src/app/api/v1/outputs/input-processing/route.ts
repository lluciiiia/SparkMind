import { type NextRequest, NextResponse } from 'next/server';
import { saveYoutubeOutput } from '../helpers/youtube';
import { saveRecQueOutput } from '../helpers/rec-que';

import {
  getOutputById,
} from '../repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const pageToken = url.searchParams.get('pageToken');
    const outputId = url.searchParams.get('output-id');
    const body = (await req.json()) as { input: string };
    const input = body.input;

    if (!myLearningId || !input || !outputId) {
      return NextResponse.json(
        { error: 'Error extracting myLearningId or input or outputId' },
        { status: 400 },
      );
    }

    const { data: output, error: outputError } = await getOutputById(outputId);
    if (outputError) {
      console.error('Error getting output:', outputError);
      return NextResponse.json({ error: 'Error getting output' }, { status: 500 });
    }
   
    const youtubeResponse = await saveYoutubeOutput(input, pageToken, myLearningId, output);
    if (youtubeResponse.status != 200) return NextResponse.json({ status: youtubeResponse.status });

    const basicQuestionResponse = await saveRecQueOutput(myLearningId, input, output);
    if (basicQuestionResponse.status != 200) return NextResponse.json({ status: basicQuestionResponse.status });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
