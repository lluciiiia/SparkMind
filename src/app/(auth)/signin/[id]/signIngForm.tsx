'use client';

import {
  EmailSignIn,
  ForgotPassword,
  OauthSignIn,
  PasswordSignIn,
  SignUp,
  UpdatePassword,
} from '@/components/ui/auth';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect, useMemo, useState } from 'react';

interface SignInFormProps {
  viewProp: string;
  allowOauth: boolean;
  allowEmail: boolean;
  allowPassword: boolean;
  redirectMethod: string;
  disableButton: boolean;
}

export function SignInForm({
  viewProp,
  allowOauth,
  allowEmail,
  allowPassword,
  redirectMethod,
  disableButton,
}: SignInFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const memoizedContent = useMemo(
    () => (
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
            <span className="sr-only">Third-party sign-in</span>
            <Separator className={`bg-white h-[0.125rem] w-full`} />
            <OauthSignIn />
          </>
        )}
      </Card>
    ),
    [viewProp, allowOauth, allowEmail, allowPassword, redirectMethod, disableButton],
  );

  if (!mounted) return null;

  return memoizedContent;
}
