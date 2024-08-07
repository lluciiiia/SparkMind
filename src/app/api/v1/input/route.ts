import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const supabase = createClient();
  const body = await request.json();
  // user_uuid text url
  const { data, error } = await supabase.from('input').insert(body);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log(body);
  return NextResponse.json({ data: body });
};
