import { createClient } from '@/utils/supabase/server';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {

        const learningid = req.nextUrl.searchParams.get('learning_id');
        console.log('todo task learningid 🆔 : ' + learningid);

        const supabaseClient = createClient();

        console.log('Learningid 🆔 : ' + learningid);

        if (learningid !== null) {

            const { data, error } = await supabaseClient
                .from('outputs')
                .select('todo_task')
                .eq('learning_id', learningid);

            if (error) {
                console.log('Error fetching videoid from DB: ' + error.message);
                return NextResponse.json({ status: 404, check: false });
            }

            if (data && data.length >= 0) {
                return NextResponse.json({ status: 200, todo_task: data[0].todo_task });
            }
        }

        return NextResponse.json({ status: 404, check: false });
    } catch (err) {
        console.log('Error when getaction-preview from DB : ' + (err as Error).message);
        return NextResponse.json({ status: 400, message: 'Internal Server Error' });
    }
}

export const dynamic = 'force-dynamic';
