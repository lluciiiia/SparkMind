import type { NoteType } from '@/schema';
import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const { uuid } = (await req.json()) as Pick<NoteType, 'uuid'>;
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('uuid', uuid)
      .single();
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
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const body = (await req.json()) as NoteType;
    const { data, error } = await supabase
      .from('notes')
      .update(body)
      .eq('uuid', body.uuid)
      .eq('id', id);
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
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    const { uuid } = (await req.json()) as Pick<NoteType, 'uuid'>;

    const { data, error } = await supabase
      .from('notes')
      .delete()
      .eq('uuid', uuid)
      .eq('id', id)
      .single();

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
};

export const OPTIONS = async (_req: NextRequest, _res: NextResponse) => {
  return NextResponse.json({ message: 'GET, PUT, DELETE, OPTIONS' }, { status: 200 });
};
