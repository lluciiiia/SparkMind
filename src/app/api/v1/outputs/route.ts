import { type NextRequest, NextResponse } from 'next/server';

import { getMyLearningById, getOutputByLearningId } from './repository';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');

    if (!myLearningId) {
      return NextResponse.json({ error: 'Error extracting myLearningId' }, { status: 400 });
    }

    const { data: myLearning, error: myLearningError } = await getMyLearningById(myLearningId);
    if (!myLearning)
      return NextResponse.json({
        status: 404,
        error: 'Error getting my learning',
      });

    const output = await getOutputByLearningId(myLearningId);
    if (!output)
      return NextResponse.json({
        status: 404,
        error: 'Error getting output',
      });

    return NextResponse.json({ status: 200, body: output });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
