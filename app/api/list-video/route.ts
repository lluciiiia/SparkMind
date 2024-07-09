import { createClient } from "@/utils/supabase/client";
import { createClient as createServer } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const supabaseServer = createServer();
        const { data: user, error: userError } = (await supabaseServer.auth.getUser());

        if (userError) {
            console.error('Error fetching user: ', userError);
            return NextResponse.json({ status: 500, message: 'Error fetching user' }, { status: 500 });
        }

        const uuid = user?.user?.id;

        if (!uuid) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();
        console.log("user 🆔 : " + uuid);

        let { data, error } = await supabase
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
    }
    catch (err) {
        console.log('Error when feach Transcript from DB : ' + err);
        return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
    }
}