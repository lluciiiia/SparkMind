'use client';

import { UserNav } from '@/components';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/providers';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

export const HomeNavigation = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useIsomorphicLayoutEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap p-4 md:justify-end gap-2">
        <menu className="w-full md:w-auto flex flex-row items-center justify-center gap-2">
          <li className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center md:justify-end">
            <Link href="/" className="w-full md:w-auto">
              Home
            </Link>
          </li>
          {user
            ? Object.entries({
                'My Learning': '/my-learning',
                Dashboard: '/dashboard',
              }).map(([key, value], index) => (
                <li
                  key={index}
                  className={`flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center md:justify-end`}
                >
                  <Link href={value}>{key}</Link>
                </li>
              ))
            : null}
        </menu>
        {user ? (
          <UserNav />
        ) : (
          <Button
            onClick={() => {
              router.push('/signin');
            }}
            className="bg-navy px-8 py-2 mt-4 md:mt-0 md:px-12 md:py-3 ml-0 md:ml-8 text-white rounded-3xl w-full md:w-auto"
          >
            SignIn
          </Button>
        )}
      </div>
    </>
  );
};
