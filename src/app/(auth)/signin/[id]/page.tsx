'use client';

import {
  EmailSignIn,
  ForgotPassword,
  OauthSignIn,
  PasswordSignIn,
  SignUp,
  UpdatePassword,
} from '@/components';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getAuthTypes,
  getDefaultSignInView,
  getRedirectMethod,
  getViewTypes,
} from '@/utils/auth/settings';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import authBackground from '../../../../../public/assets/images/auth.png';
import logo from '../../../../../public/assets/svgs/logo.svg';

export default function SignIn({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { disable_button: boolean };
}) {
  const [error, setError] = useState<string | null>(null);
  const [authConfig, setAuthConfig] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { allowOauth, allowEmail, allowPassword } = await getAuthTypes();
        const viewTypes = await getViewTypes();
        const redirectMethod = await getRedirectMethod();

        let viewProp: string;

        if (typeof params.id === 'string' && viewTypes.includes(params.id)) {
          viewProp = params.id;
        } else {
          const preferredSignInView = localStorage.getItem('preferredSignInView') || null;
          viewProp = await getDefaultSignInView(preferredSignInView);
          router.push(`/signin/${viewProp}`);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && viewProp !== 'update_password') {
          router.push('/my-learning');
        } else if (!user && viewProp === 'update_password') {
          router.push('/signin');
        } else {
          setAuthConfig({
            viewProp,
            allowOauth,
            allowEmail,
            allowPassword,
            redirectMethod,
            disableButton: searchParams.disable_button,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError('An error occurred while loading the sign-in page. Please try again later.');
      }
    };

    initializeAuth();
  }, [params.id, searchParams.disable_button, router, supabase.auth]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <Alert variant="destructive" className="w-full max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!authConfig) {
    return null; // Return null while loading
  }

  const { viewProp, allowOauth, allowEmail, allowPassword, redirectMethod, disableButton } =
    authConfig;

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="mx-auto my-auto flex justify-center h-screen w-screen">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-full">
          <Card className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
            <CardHeader className="p-6">
              <div className="flex justify-center mb-4">
                <Image
                  src={logo}
                  alt="SparkMind Logo"
                  width={100}
                  height={100}
                  className="rounded-full bg-white p-2"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-white sr-only">
                {viewProp === 'forgot_password'
                  ? 'Reset Password'
                  : viewProp === 'update_password'
                    ? 'Update Password'
                    : viewProp === 'signup'
                      ? 'Sign Up'
                      : 'Sign In'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {viewProp === 'password_signin' && (
                <PasswordSignIn allowEmail={allowEmail} redirectMethod={redirectMethod} />
              )}
              {viewProp === 'email_signin' && (
                <EmailSignIn
                  allowPassword={allowPassword}
                  redirectMethod={redirectMethod}
                  disableButton={disableButton}
                />
              )}
              {viewProp === 'forgot_password' && (
                <ForgotPassword
                  allowEmail={allowEmail}
                  redirectMethod={redirectMethod}
                  disableButton={disableButton}
                />
              )}
              {viewProp === 'update_password' && <UpdatePassword redirectMethod={redirectMethod} />}
              {viewProp === 'signup' && (
                <SignUp allowEmail={allowEmail} redirectMethod={redirectMethod} />
              )}
              {viewProp !== 'update_password' && viewProp !== 'signup' && allowOauth && (
                <>
                  <Separator className={`bg-white h-[0.125rem] w-full`} />
                  <OauthSignIn />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Image
        src={authBackground}
        alt="authentication screen BackgroundBeams"
        className="object-contain absolute inset-0 w-full h-full z-[-10] mx-auto my-auto max-w-[1440px] max-h-[900px] min-w-[1024px] min-h-[768px]"
        width={1440}
        height={900}
      />
    </div>
  );
}
