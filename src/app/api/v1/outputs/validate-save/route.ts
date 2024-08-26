import { type NextRequest, NextResponse } from 'next/server';

import {
  getAndSaveOutputByLearningId,
  getMyLearningById,
  saveMyLearningInput,
} from '../repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
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

    return NextResponse.json({ status: 200, output: output });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
