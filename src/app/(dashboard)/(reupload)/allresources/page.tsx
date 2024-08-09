import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReUploadResource } from './_components';

interface Props {
  id: number | string | undefined;
}

export default async function ReuplaodResources() {
  const supabase = createClient();

  console.log('id is here');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  return (
    <>
      <ReUploadResource />
    </>
  );
}