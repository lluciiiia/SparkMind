import { type NextRequest, NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';
import {
  createMyLearning,
  getAndSaveOutputByLearningId,
  getMyLearningById,
  saveMyLearningInput,
} from '../repository';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const body = (await req.json()) as { input: string; userId: string; title: string };
    const { input, userId, title } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (!myLearningId || !input) {
      return NextResponse.json({ error: 'Missing myLearningId or input' }, { status: 400 });
    }

    // Check if the learning already exists
    const { data: existingLearning, error: learningError } = await getMyLearningById(myLearningId);

    if (learningError) {
      console.error('Error checking existing learning:', learningError);
      return NextResponse.json({ error: 'Error checking existing learning' }, { status: 500 });
    }

    if (!existingLearning) {
      // Create a new learning if it doesn't exist
      const { data: newLearning, error: createError } = await createMyLearning(
        myLearningId,
        userId,
        title,
      );

      if (createError) {
        console.error('Error creating new learning:', createError);
        return NextResponse.json({ error: 'Failed to create new learning' }, { status: 500 });
      }
    }

    // Save the input
    const { error: saveInputError } = await saveMyLearningInput(myLearningId, input, title);

    if (saveInputError) {
      console.error('Error saving learning input:', saveInputError);
      return NextResponse.json({ error: 'Failed to save learning input' }, { status: 500 });
    }

    // Get and save the output
    const { data: output, error: outputError } = await getAndSaveOutputByLearningId(
      myLearningId,
      userId,
    );

    if (outputError) {
      console.error('Error getting or saving output:', outputError);
      return NextResponse.json({ error: 'Error getting or saving output' }, { status: 500 });
    }

    return NextResponse.json({ status: 200, output: output });
  } catch (error) {
    console.error('Unexpected error in validate-save:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
