import type { NoteType } from '@/schema';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(req: NextRequest, _res: NextResponse) {
  try {
    const body = (await req.json()) as NoteType;
    const { data, error } = await supabase.from('notes').select('*').eq('uuid', body.uuid);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (data && data.length > 0) {
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest, _res: NextResponse) {
  try {
    const body = (await req.json()) as NoteType;
    const { data, error } = await supabase.from('notes').insert(body);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
}

export async function OPTIONS(req: NextRequest, res: NextResponse) {
  return NextResponse.json({ message: 'GET, POST, OPTIONS' }, { status: 200 });
}
