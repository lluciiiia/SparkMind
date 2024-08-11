import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const learningid = req.nextUrl.searchParams.get('learningid');
    console.log('learningid 🆔 : ' + learningid);

    const supabase = createClient();

    const userid = (await supabase.auth.getUser()).data.user?.id;

    if (learningid !== null && userid !== null && userid !== undefined) {
      const { data, error } = await supabase
        .from('transcriptdata')
        .select('id')
        .eq('uuid', userid)
        .eq('videoid', learningid);

      if (error) {
        console.log('Error fetching transcriptdata id from outputs table DB: ' + error.message);
        return NextResponse.json({ status: 404, check: false });
      }

      if (data && data.length > 0) {
        const exists = data[0].id > 0 ? true : (false as boolean);
        console.log('is video exists  : ', exists);
        return NextResponse.json({ status: 200, exists: exists });
      } else {
        console.log('No data found for learning_id:', learningid);
        return NextResponse.json({ status: 404, check: false });
      }
    }

    return NextResponse.json({ status: 404, check: false });
  } catch (err) {
    console.log('Error when check-video from DB : ' + (err as Error).message);
    return NextResponse.json({ status: 400, message: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
