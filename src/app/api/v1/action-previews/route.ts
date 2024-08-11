import { createClient } from '@/utils/supabase/client';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const learningid = req.nextUrl.searchParams.get('learningid');

    const supabaseClient = createClient();

    if (learningid !== null) {
      const { data, error } = await supabaseClient
        .from('outputs')
        .select('is_task_preview_done')
        .eq('learning_id', learningid);

      if (error) {
        console.log('Error fetching outputs from outputs table DB: ' + error.message);
        return NextResponse.json({ status: 404, check: false });
      }

      if (data && data.length > 0) {
        return NextResponse.json({ status: 200, check: data[0].is_task_preview_done });
      } else {
        return NextResponse.json({ status: 404, check: false });
      }
    }

    return NextResponse.json({ status: 404, check: false });
  } catch (err) {
    console.log('Error when getting action-previews from DB : ' + (err as Error).message);
    return NextResponse.json({ status: 400, message: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';