import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react';

interface UserAvatarProps {
  avatarUrl: string | null;
  userName: string | null;
}

export const UserAvatar = React.memo(
  React.forwardRef<HTMLButtonElement, UserAvatarProps>(({ avatarUrl, userName }, ref) => {
    return (
      <Button ref={ref} variant="outline" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src="#" alt="Avatar" />
          <AvatarFallback className="bg-transparent">
            {avatarUrl && (
              <Image src={avatarUrl} alt={`${userName}'s avatar`} width={32} height={32} />
            )}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }),
);

UserAvatar.displayName = 'UserAvatar';
