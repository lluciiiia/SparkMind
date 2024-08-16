import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';
const supabase = createClient();

export async function getMyLearningById(id: string) {
  return await supabase.from('mylearnings').select('id, input').eq('id', id);
}

export async function saveMyLearningInput(id: string, input: string) {
  return await supabase.from('mylearnings').update({ input }).eq('id', id);
}

export async function getAndSaveOutputByLearningId(learningId: string) {
  const { data, error } = await supabase
    .from('outputs')
    .select('*')
    .eq('learning_id', learningId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching output:', error);
    throw new Error('Error fetching output');
  }

  // If output exists, return it
  if (data) return { data, error };

  // If output does not exist, create a new one
  const { data: newOutput, error: insertError } = await supabase
    .from('outputs')
    .insert([{ learning_id: learningId }])
    .select()
    .single(); // Insert and return the new record

  if (insertError) {
    console.error('Error creating output:', insertError);
    throw new Error('Error creating output');
  }

  return { data: newOutput, error: insertError };
}

export async function getOutputByLearningId(learningId: string) {
  const { data, error } = await supabase
    .from('outputs')
    .select('id, youtube, summary, questions, further_info, todo_task')
    .eq('learning_id', learningId);

  return data;
}

export async function getOutputById(id: string) {
  return await supabase
    .from('outputs')
    .select('id, youtube, summary, questions, further_info')
    .eq('id', id);
}
