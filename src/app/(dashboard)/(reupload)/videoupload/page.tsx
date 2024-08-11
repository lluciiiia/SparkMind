import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReUploadVideo } from './_components';

interface Props {
  id: number | string | undefined;
}

export default async function VideoUploadPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/signin');
  }

  return (
    <>
      <ReUploadVideo />
    </>
  );
}
