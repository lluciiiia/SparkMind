import { search } from '@/server/services';
import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function saveFurtherInfoOutput(query: string, myLearningId: string, output: any) {
  const response = await search(query);

  const supabase = createClient();

  if (!output) {
    const { data, error } = await supabase
      .from('outputs')
      .insert([{ learning_id: myLearningId, further_info: JSON.stringify(response.items) }])
      .select();

    if (error) {
      return NextResponse.json({ error: 'Error inserting further info output' }, { status: 500 });
    }
  } else {
    const { data, error } = await supabase
      .from('outputs')
      .update([{ further_info: JSON.stringify(response.items) }])
      .eq('learning_id', myLearningId);

    if (error) {
      return NextResponse.json({ error: 'Error updating further info output' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 200, body: 'success' });
}
