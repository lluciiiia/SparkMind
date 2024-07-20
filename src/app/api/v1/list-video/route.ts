import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const supabaseClient = createClient();
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      console.error('Please Login and Sign up your account ');
      return NextResponse.json({ status: 400, message: 'Please Login and Sign up your account' });
    }

    const { data: user, error: userError } = await supabaseClient.auth.getUser();

    if (userError) {
      console.error('Error fetching user: ', userError);
      return NextResponse.json({ status: 400, message: 'Error fetching user' });
    }

    const uuid = user.user.id;

    if (uuid === undefined) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' });
    }
    console.log('user 🆔 : ' + uuid);

    const { data, error } = await supabaseClient
      .from('transcriptdata')
      .select('videoid')
      .eq('uuid', uuid);

    if (error) {
      console.log('Error fetching videoid from DB: ' + error.message);
      return NextResponse.json({ status: 404, videolist: [] });
    }

    if (data && data.length >= 0) {
      return NextResponse.json({ status: 200, videolist: data });
    }

    return NextResponse.json({ status: 404, videolist: [] });
  } catch (err) {
    console.log('Error when feach list of video id from DB : ' + err);
    return NextResponse.json({ status: 400, message: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
