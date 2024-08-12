import { type NextRequest, NextResponse } from 'next/server';
import { saveFurtherInfoOutput } from '../helpers/further-info';
import { saveQuizOutput } from '../helpers/qna';

import { getOutputById } from '../repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
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
    if (outputError) return NextResponse.json({ error: 'Error getting output' }, { status: 500 });

    const quizResponse = await saveQuizOutput(input, myLearningId, output);
    if (quizResponse.status != 200) return NextResponse.json({ status: quizResponse.status });

    const furtherInfoResponse = await saveFurtherInfoOutput(input, myLearningId, output);
    if (furtherInfoResponse.status != 200)
      return NextResponse.json({ status: furtherInfoResponse.status });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
