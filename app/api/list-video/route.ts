import { createClient } from "@/utils/supabase/client";
import { createClient as createServer } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const supabaseServer = createServer();
        const uuid = (await supabaseServer.auth.getUser()).data.user?.id;

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
    }
}