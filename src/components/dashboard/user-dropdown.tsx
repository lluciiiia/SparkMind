import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';

interface UserDropdownContentProps {
  userName: string | null;
  userEmail: string | null;
  onSignOut: () => void;
}

export function UserDropdownContent({ userName, userEmail, onSignOut }: UserDropdownContentProps) {
  return (
    <DropdownMenuContent className="w-56" align="end" forceMount>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/account" className="flex items-center">
            <User className="w-4 h-4 mr-3 text-muted-foreground" />
            Account
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="hover:cursor-pointer" onClick={onSignOut}>
        <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
