import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes,
} from '@/utils/auth/settings';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import {
  EmailSignIn,
  ForgotPassword,
  OauthSignIn,
  PasswordSignIn,
  SignUp,
  UpdatePassword,
} from '@/components/ui/auth';
import authBackground from '../../../../../public/assets/images/auth.png';
import logo from '../../../../../public/assets/images/home/Logowithtext.png';

export default async function SignIn({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { disable_button: boolean };
}) {
  const { allowOauth, allowEmail, allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
    viewProp = params.id;
  } else {
    const preferredSignInView = cookies().get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/my-learning');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <>
      <div className="mx-auto my-auto flex justify-center h-screen w-screen z-50">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-full mx-auto">
          <div className="flex justify-center pb-12">
            <Image src={logo} alt="logo" width={250} height={250} />
          </div>
          <Card
            className="rounded-2xl p-3 shadow-lg bg-[#cde1fa] mx-auto w-[80%]"
            title={
              viewProp === 'forgot_password'
                ? 'Reset Password'
                : viewProp === 'update_password'
                  ? 'Update Password'
                  : viewProp === 'signup'
                    ? 'Sign Up'
                    : 'Sign In'
            }
          >
            {viewProp === 'password_signin' && (
              <PasswordSignIn allowEmail={allowEmail} redirectMethod={redirectMethod} />
            )}
            {viewProp === 'email_signin' && (
              <EmailSignIn
                allowPassword={allowPassword}
                redirectMethod={redirectMethod}
                disableButton={searchParams.disable_button}
              />
            )}
            {viewProp === 'forgot_password' && (
              <ForgotPassword
                allowEmail={allowEmail}
                redirectMethod={redirectMethod}
                disableButton={searchParams.disable_button}
              />
            )}
            {viewProp === 'update_password' && <UpdatePassword redirectMethod={redirectMethod} />}
            {viewProp === 'signup' && (
              <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
            )}
            {viewProp !== 'update_password' && viewProp !== 'signup' && allowOauth && (
              <>
                <span className="sr-only">Third-party sign-in</span>
                <Separator className={`bg-white h-[0.125rem] w-full`} />
                <OauthSignIn />
              </>
            )}
          </Card>
        </div>
      </div>
      <Image
        src={authBackground}
        alt="authentication screen BackgroundBeams"
        className="object-contain absolute inset-0 w-full h-full z-[-10] mx-auto my-auto max-w-[1440px] max-h-[900px] min-w-[1024px] min-h-[768px]"
      />
    </>
  );
}
