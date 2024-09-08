import { type NextRequest, NextResponse } from 'next/server';
import { saveRecQueOutput } from '../helpers/rec-que';

export const dynamic = 'force-dynamic';

function truncateInput(input: string, maxLength = 1000): string {
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength - 3) + '...';
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const body = (await req.json()) as { input: string; output: any };
    const input = body.input;
    const output = body.output;

    if (!myLearningId || !input) {
      return NextResponse.json(
        { error: 'Error extracting myLearningId or input' },
        { status: 400 },
      );
    }

    const truncatedInput = truncateInput(input);
    const basicQuestionResponse = await saveRecQueOutput(myLearningId, truncatedInput, output);
    if (basicQuestionResponse.status != 200)
      return NextResponse.json({ status: basicQuestionResponse.status });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error saving output in DB:', error);
    return NextResponse.json({ error: 'Failed to save output in DB' }, { status: 500 });
  }
}
