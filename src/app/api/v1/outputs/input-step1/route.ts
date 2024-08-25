import { type NextRequest, NextResponse } from 'next/server';
import { saveSummaryOutput } from '../helpers/summary';
import { saveYoutubeOutput } from '../helpers/youtube';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const pageToken = url.searchParams.get('pageToken');
    const body = (await req.json()) as { input: string; output: any };
    const input = body.input;
    const output = body.output;

    if (!myLearningId || !input) {
      return NextResponse.json(
        { error: 'Error extracting myLearningId or input' },
        { status: 400 },
      );
    }

    const summaryResponse = await saveSummaryOutput(myLearningId, input, output);
    if (summaryResponse.status != 200) return NextResponse.json({ status: summaryResponse.status });

    const youtubeResponse = await saveYoutubeOutput(input, pageToken, myLearningId, output);
    if (youtubeResponse.status != 200) return NextResponse.json({ status: youtubeResponse.status });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
