'use client';

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUserInfo } from '@/hooks';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { memo } from 'react';
import { UserAvatar } from './user-avatar';
import { UserDropdownContent } from './user-dropdown';

export const UserNav = memo(() => {
  const { userName, userEmail, avatarUrl } = useUserInfo();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <UserAvatar avatarUrl={avatarUrl} userName={userName} />
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <UserDropdownContent
              userName={userName}
              userEmail={userEmail}
              onSignOut={handleSignOut}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </DropdownMenu>
  );
});
