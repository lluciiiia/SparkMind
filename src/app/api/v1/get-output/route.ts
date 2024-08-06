import { createClient } from '@/utils/supabase/client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const supabase = createClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');

    if (!myLearningId) {
      return NextResponse.json({ error: 'Error extracting myLearningId' }, { status: 400 });
    }

    const myLearning = await getMyLearningById(myLearningId);
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

async function getMyLearningById(id: string) {
  const { data, error } = await supabase.from('mylearnings').select('id, input').eq('id', id);

  return data;
}

async function getOutputByLearningId(learningId: string) {
  const { data, error } = await supabase
    .from('outputs')
    .select('id, youtube, summary, questions, further_info')
    .eq('learning_id', learningId);

  return data;
}
