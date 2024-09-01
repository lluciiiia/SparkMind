import type { NoteType } from '@/schema';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;
  try {
    let { data, error } = await supabase.from('notes').select('*').eq('learning_id', id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.log('No existing notes, creating a new one');
      const { data: newNote, error: insertError } = await supabase
        .from('notes')
        .insert({ learning_id: id, title: 'New Note', content: 'Start typing here...' })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating new note:', insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      data = [newNote];
    }

    return NextResponse.json({ notes: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;
  try {
    const body = (await req.json()) as NoteType;
    const { data, error } = await supabase
      .from('notes')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ status: 200, data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;
  try {
    const { data, error } = await supabase.from('notes').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Even if no data was deleted, we'll return a success response
    return NextResponse.json({ message: 'Note deleted successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
};

export const OPTIONS = async (_req: NextRequest, _res: NextResponse) => {
  return NextResponse.json({ message: 'GET, PUT, DELETE, OPTIONS' }, { status: 200 });
};

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createClient();
  const { id } = params;
  try {
    const { title, content } = (await req.json()) as { title: string; content: string };

    // Check if a note already exists for this learning_id
    const { data: existingNotes, error: checkError } = await supabase
      .from('notes')
      .select('*')
      .eq('learning_id', id);

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingNotes && existingNotes.length > 0) {
      const { data, error } = await supabase
        .from('notes')
        .update({ title, content })
        .eq('learning_id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ notes: [data] });
    } else {
      // If no note exists, create a new one
      const { data, error } = await supabase
        .from('notes')
        .insert({ learning_id: id, title, content })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ notes: [data] });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: `${error instanceof Error ? error.message : 'Internal server error'}` },
      { status: 500 },
    );
  }
};
