import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const inputSchema = z.object({
  input_id: z.string().uuid(),
  url: z.string().url(),
  text: z.string(),
});

export const POST = async (request: NextRequest) => {
  const supabase = createClient();

  let body;
  try {
    body = inputSchema.parse(await request.json());
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { data, error } = await supabase.from('input').insert(body).select();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
};
