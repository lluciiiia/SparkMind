import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NewDashboard } from './_components';


interface Props {
  id: number | string | undefined;
}

export default async function DashboardPage() {
  const supabase = createClient();

  console.log("id is here");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  return (
    <>
      <NewDashboard />
    </>
  );
}
