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
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Search = memo(({ search }: { search: string }) => {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounce((values: string) => {
    setQuery(values);
    replace(`${pathname}?query=${values}`);
  }, 300);

  return (
    <div className={`flex items-center gap-2`}>
      <form className={`flex items-center gap-2`}>
        <Input
          type="search"
          className={`w-full`}
          placeholder={search}
          defaultValue={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
      <MagnifyingGlassIcon className={`w-4 h-4`} />
    </div>
  );
});
