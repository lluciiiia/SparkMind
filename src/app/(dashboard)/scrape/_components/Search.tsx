'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';


export const Search = memo(({ search }: { search: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounce((values: string) => {
    const search = new URLSearchParams(searchParams);
    if (values) {
      search.set('query', values);
    } else {
      search.delete('query');
    }
    replace(`${pathname}?${search.toString()}`);
  }, 300);

  return (
    <div className={`flex items-center gap-2`}>
      <form className={`flex items-center gap-2`}>
        <Input
          type="search"
          className={`w-full`}
          placeholder={search}
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
      <MagnifyingGlassIcon className={`w-4 h-4`} />
    </div>
  );
});
