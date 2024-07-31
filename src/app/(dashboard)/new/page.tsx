import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { NewDashboard } from './_components';

export default async function DashboardPage() {
  const supabase = createClient();

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