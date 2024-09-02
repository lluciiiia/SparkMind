import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  allowPassword?: boolean;
  allowEmail?: boolean;
  allowSignup?: boolean;
  allowMagicLink?: boolean;
  allowForgotPassword?: boolean;
};

const Options = ({
  allowPassword,
  allowEmail,
  allowSignup,
  allowMagicLink,
  allowForgotPassword,
}: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-navy bg-white">
          Options
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-white text-navy">
        {allowForgotPassword && (
          <DropdownMenuItem asChild>
            <Link href="/signin/forgot_password" className="w-full">
              Forgot your password?
            </Link>
          </DropdownMenuItem>
        )}
        {allowEmail && allowPassword && (
          <DropdownMenuItem asChild>
            <Link href="/signin/password_signin" className="w-full">
              Sign in with email and password
            </Link>
          </DropdownMenuItem>
        )}
        {allowMagicLink && (
          <DropdownMenuItem asChild>
            <Link href="/signin/email_signin" className="w-full">
              Sign in via magic link
            </Link>
          </DropdownMenuItem>
        )}
        {allowSignup && (
          <DropdownMenuItem asChild>
            <Link href="/signin/signup" className="w-full">
              {"Don't have an account? Sign up"}
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Options.displayName = 'Options';

export { Options };
