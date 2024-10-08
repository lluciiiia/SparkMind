import { InputSchema, inputSchema } from '@/schema';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const body = await request.json();
  console.log('body', body);

  const { data, error } = await supabase.from('scraper_input').insert(body).select();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
};

export const GET = async (request: NextRequest) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('scraper_input').select('*');

  if (error) {
    console.error('Supabase select error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 200 });
};
