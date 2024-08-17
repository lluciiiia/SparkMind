import { ACTION_ITEMS_SYSTEM_INSTRUCTION } from '@/app/api/gemini-system-instructions';
import { API_KEY, genAI, model, safetySettings } from '@/app/api/v1/gemini-settings';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');
    const outputId = url.searchParams.get('output-id');

    if (!myLearningId || !outputId)
      return NextResponse.json({ error: 'Missing myLearningId or outputId' }, { status: 400 });

    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (userId == null || userId == undefined)
      return NextResponse.json({ error: 'User authentication failed' }, { status: 401 });

    const isVideoUploaded = await checkIsVideoUploaded(supabase, userId, myLearningId);

    const transcript = await getTranscript(supabase, myLearningId, !isVideoUploaded);
    if (!transcript) return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });

    const todoList = await generateTodoList(transcript);
    await saveTodoList(supabase, outputId, todoList);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

async function checkIsVideoUploaded(
  supabase: any,
  userId: string,
  myLearningId: string,
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('transcriptdata')
      .select('id')
      .eq('uuid', userId)
      .eq('videoid', myLearningId);

    if (error) return false;

    return data && data.length > 0;
  } catch (error) {
    return false;
  }
}

async function getTranscript(supabase: any, videoid: string, istextinput: boolean) {
  try {
    if (istextinput === true) {
      const { data, error } = await supabase
        .from('outputs')
        .select('summary')
        .eq('learning_id', videoid);

      if (error) return null;

      return data?.length ? data[0].summary : null;
    } else {
      const { data, error } = await supabase
        .from('transcriptdata')
        .select('transcript')
        .eq('videoid', videoid);

      if (error) return null;

      return data?.[0]?.transcript || null;
    }
  } catch (err) {
    console.log('Error when fetching Transcript from DB : ' + err);
  }
}

async function generateTodoList(transcript: string): Promise<any> {
  if (!API_KEY) throw new Error('Missing API key');

  const generationConfig = {
    temperature: 0.7,
    topP: 0.85,
    topK: 50,
    maxOutputTokens: 80000,
    responseMimeType: 'application/json',
  };

  const genModel = genAI.getGenerativeModel({
    model,
    generationConfig,
    safetySettings,
  });

  const date = new Date();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = date.toISOString().split('T')[0];

  const systemInstruction = ACTION_ITEMS_SYSTEM_INSTRUCTION.replace('{{timeZone}}', timeZone)
    .replace('{{formattedDate}}', formattedDate)
    .replace('{{transcript}}', transcript);

  try {
    const result = await genModel.generateContent(systemInstruction.trim());
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error('Error fetching event list:', error);
    throw new Error('Failed to get event list from transcript.');
  }
}

async function saveTodoList(supabase: any, outputId: string, todoList: any) {
  try {
    const { error } = await supabase
      .from('outputs')
      .update({ todo_task: todoList })
      .eq('id', outputId);

    if (error) throw new Error('Failed to save todo list.');
  } catch (error) {
    console.error('Error in saveTodoList:', error);
    throw error;
  }
}
