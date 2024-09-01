import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
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
          <AvatarImage src={avatarUrl!} alt={`${userName}'s avatar`} />
          <AvatarFallback className="bg-transparent">
            {userName ? userName?.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }),
);

UserAvatar.displayName = 'UserAvatar';
