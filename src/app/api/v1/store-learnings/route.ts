// pages/api/mylearning.js
import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

interface MyLearningData {
    uuid: string;
    title: string;
    date: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { uuid, title, date } = await req.json() as MyLearningData;
        const supabase = createClient();

        console.log(date);

        const { data, error } = await supabase
            .from('mylearnings')
            .insert([
                { title: title, date: date, uuid: uuid }
            ]).select();

        if (error) {
            console.log("this is error : " + error.message);
            return NextResponse.json({ status: 400, body: error.message });
        }

        return NextResponse.json({ status: 200, body: data });
    }
    catch (error) {
        console.log('Error in Store-Learnings api : ' + (error as Error).message);
        return NextResponse.json({ status: 400, error: `Something wrong in Store-learnings API :${(error as Error).message}` });
    }
}

let cachedData: any = null;

export async function GET(req: NextRequest, res: NextResponse) {
    try {

        if (cachedData) {
            return NextResponse.json({ status: 200, body: cachedData });
        }

        const uuid = req.nextUrl.searchParams.get('uuid') as string;
        const supabase = createClient();

        const { data, error } = await supabase
            .from('mylearnings')
            .select('id, uuid, title, date, learning_id').eq('uuid', uuid);

        if (error) {
            console.log("this is error : " + error.message);
            return NextResponse.json({ status: 400, body: error.message });
        }

        return NextResponse.json({ status: 200, body: data });
    }
    catch (error) {
        console.log('Error in Store-Learnings api : ' + (error as Error).message);
        return NextResponse.json({ status: 400, error: `Something wrong in Store-learnings API :${(error as Error).message}` });
    }

}


interface UpdateLearningData {
    id: string;
    uuid: string;
    title: string;
    date: string;
}

export async function PATCH(req: NextRequest) {
    try {
        const { id, title, date, uuid } = await req.json() as UpdateLearningData;
        const supabase = createClient();

        console.log("this is id : " + id);

        const { data, error } = await supabase
            .from('mylearnings')
            .update({ title: title, date: date })
            .eq('learning_id', id)
            .eq('uuid', uuid);

        if (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ status: 400, body: error });
        }

        return NextResponse.json({ status: 200, body: "success" });
    } catch (error) {
        console.error('Error in Update API:', (error as Error).message);
        return NextResponse.json({ status: 500, error: `Something went wrong: ${(error as Error).message}` });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { uuid, id }: any = await req.json();
        const supabase = createClient();

        // Log the parameters to help with debugging
        console.log("Deleting record with Learning ID: " + id + ", and UUID: " + uuid);

        // Perform the delete operation
        const { data, error } = await supabase
            .from('mylearnings')
            .delete()
            .eq('learning_id', id) 
            .eq('uuid', uuid)

        if (error) {
            console.error('Database Error:', error.message);
            return NextResponse.json({ status: 400, body: error.message });
        }

        return NextResponse.json({ status: 200, body: data });
    } catch (error) {
        console.error('Error in Delete API:', (error as Error).message);
        return NextResponse.json({ status: 500, error: `Something went wrong: ${(error as Error).message}` });
    }
}