import type { NoteType } from '@/schema/notes';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');

    if (!myLearningId) return NextResponse.json({ error: 'Missing learning ID' }, { status: 400 });

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('learning_id', myLearningId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 200, body: data });
  } catch (error) {
    console.error('Error getting notes in DB:', error);
    return NextResponse.json({ error: 'Failed to save notes in DB' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  try {
    const url = new URL(req.url);
    const myLearningId = url.searchParams.get('id');

    if (!myLearningId) return NextResponse.json({ error: 'Missing learning ID' }, { status: 400 });

    const { data, error } = await supabase
      .from('notes')
      .insert([{ learning_id: myLearningId }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 200, body: data });
  } catch (error) {
    console.error('Error inserting note into DB:', error);
    return NextResponse.json({ error: 'Failed to insert note into DB' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const supabase = createClient();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });

    const body = (await req.json()) as { title: string; content: string };

    console.log(id, body.title, body.content);

    const { data, error } = await supabase
      .from('notes')
      .update({ title: body.title, content: body.content, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ status: 200, body: data });
  } catch (error) {
    console.error('Error updating note in DB:', error);
    return NextResponse.json({ error: 'Failed to update note in DB' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing note ID' }, { status: 400 });

    const { data, error } = await supabase.from('notes').delete().eq('id', id).single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: 200, body: data });
  } catch (error) {
    console.error('Error deleting note from DB:', error);
    return NextResponse.json({ error: 'Failed to delete note from DB' }, { status: 500 });
  }
}
