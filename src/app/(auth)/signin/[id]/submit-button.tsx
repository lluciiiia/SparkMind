'use client';

import { createClient } from '@/utils/supabase/server';
import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = ComponentProps<'button'> & {
  pendingText?: string;
  onClick?: () => void;
};

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
  const { pending, action } = useFormStatus();

  const isPending = pending && action === props.formAction;

  return (
    <button {...props} type="submit" aria-disabled={pending}>
      {isPending ? pendingText : children}
    </button>
  );
}
