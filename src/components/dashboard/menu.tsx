'use client';

import { ChevronRight, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';
import React, { useEffect, useState } from 'react';

import { CollapseMenuButton } from '@/components/dashboard/collapse-menu-button';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePersistedId } from '@/hooks';
import { getMenuList } from '@/lib/menu-list';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const { id } = usePersistedId('mylearning_id');

  const supabase = createClient();
  const router = useRouter();

  const pathname = usePathname();
  const menuList = getMenuList(pathname, id);

  // const isMyLearningPage = pathname.includes('/my-learning');

  // if (isMyLearningPage) {
  //   menuList = menuList.filter((group) => {
  //     return !group.menus.some((menu) => menu.label === 'Upload');
  //   });
  // }

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="w-full h-full mt-8">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel ? 'pt-5' : '')} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex items-center justify-center w-full">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? 'secondary' : 'ghost'}
                            className="justify-start w-full h-10 mb-1"
                            asChild
                            onClick={() => {
                              toast.info(`Redirecting to ${label} page`);
                            }}
                          >
                            <Link href={href}>
                              <span className={cn(isOpen === false ? '' : 'mr-4')}>
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  'max-w-[200px] truncate',
                                  isOpen === false
                                    ? '-translate-x-96 opacity-0'
                                    : 'translate-x-0 opacity-100',
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                ),
              )}
            </li>
          ))}
          <li className="flex flex-col items-end w-full grow">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start w-full h-10 mb-2"
                    asChild
                    onClick={() => {
                      toast.info('Redirecting to account page');
                    }}
                  >
                    <Link href="/account">
                      <span className={cn(isOpen === false ? '' : 'mr-4')}>
                        <User size={18} />
                      </span>
                      <p
                        className={cn(
                          'whitespace-nowrap',
                          isOpen === false ? 'opacity-0 hidden' : 'opacity-100',
                        )}
                      >
                        Account
                      </p>
                    </Link>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && <TooltipContent side="right">Account</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      supabase.auth.signOut();
                      toast.info('Signed out successfully');
                      router.push('/signin');
                    }}
                    variant="outline"
                    className="justify-start w-full h-10"
                  >
                    <span className={cn(isOpen === false ? '' : 'mr-4')}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        'whitespace-nowrap',
                        isOpen === false ? 'opacity-0 hidden' : 'opacity-100',
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && <TooltipContent side="right">Sign out</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}
