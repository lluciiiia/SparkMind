import { getDefaultSignInView } from '@/utils/auth/settings';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function SignIn() {
  const preferredSignInView = cookies().get('preferredSignInView')?.value || null;
  const defaultView = getDefaultSignInView(preferredSignInView);

  return redirect(`/signin/${defaultView}`);
}
