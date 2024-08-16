import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
  await headers.apply({
    
  })
  try {
    const learningid = req.nextUrl.searchParams.get('learningid');

    const supabase = createClient();

    const userid = (await supabase.auth.getUser()).data.user?.id;

    if (learningid !== null && userid !== null && userid !== undefined) {
      const { data, error } = await supabase
        .from('transcriptdata')
        .select('id')
        .eq('uuid', userid)
        .eq('videoid', learningid);

      if (error) {
        return NextResponse.json({ status: 404, check: false });
      }

      if (data && data.length > 0) {
        const exists = data[0].id > 0 ? true : (false as boolean);
        return NextResponse.json({ status: 200, exists: exists });
      } else {
        return NextResponse.json({ status: 404, check: false });
      }
    }

    return NextResponse.json({ status: 404, check: false });
  } catch (err) {
    return NextResponse.json({ status: 400, message: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
