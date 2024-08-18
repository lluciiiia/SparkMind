import { type NextRequest, NextResponse } from 'next/server';
import { saveFurtherInfoOutput } from '../helpers/further-info';
import { saveQuizOutput } from '../helpers/qna';
import { saveSummaryOutput } from '../helpers/summary';
import { saveYoutubeOutput } from '../helpers/youtube';
import { saveRecQueOutput } from '../helpers/rec-que';

import {
  getAndSaveOutputByLearningId,
  getMyLearningById,
  getOutputByLearningId,
  saveMyLearningInput,
} from '../repository';


export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const pageToken = url.searchParams.get('pageToken');
    const body = (await req.json()) as { input: string };
    const input = body.input;

    if (!myLearningId || !input) {
      return NextResponse.json(
        { error: 'Error extracting myLearningId or input' },
        { status: 400 },
      );
    }

    const { data: myLearning, error: myLearningError } = await getMyLearningById(myLearningId);
    if (!myLearning)
      return NextResponse.json({
        status: 404,
        error: 'No learning found',
      });

    if (myLearningError)
      return NextResponse.json({ error: 'Error getting my learning' }, { status: 500 });

    await saveMyLearningInput(myLearningId, input);

    const { data: output, error: outputError } = await getAndSaveOutputByLearningId(myLearningId);
    if (outputError) return NextResponse.json({ error: 'Error getting output' }, { status: 500 });

    const youtubeResponse = await saveYoutubeOutput(input, pageToken, myLearningId, output);
    if (youtubeResponse.status != 200) return NextResponse.json({ status: youtubeResponse.status });

    const summaryResponse = await saveSummaryOutput(myLearningId, input, output);
    if (summaryResponse.status != 200) return NextResponse.json({ status: summaryResponse.status });

    const basicQuestionResponse = await saveRecQueOutput(myLearningId, input, output);
    if (summaryResponse.status != 200) return NextResponse.json({ status: basicQuestionResponse.status });

    return NextResponse.json({ status: 200, outputId: output.id });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
