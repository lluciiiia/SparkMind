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
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const searchSchema = z.object({
  search: z.string(),
});

export const Search = ({ search }: { search: string }) => {
  const form = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: { search },
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (values: z.infer<typeof searchSchema>) => {
    const search = new URLSearchParams(searchParams);
    if (values.search) {
      search.set('query', values.search);
    } else {
      search.delete('query');
    }
    replace(`${pathname}?${search.toString()}`);
  };

  return (
    <div className={`flex items-center gap-2`}>
      <Form {...form}>
        <form className={`flex items-center gap-2`} onSubmit={form.handleSubmit(handleSearch)}>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className={`flex items-center gap-2`}>
                <FormControl>
                  <Input
                    type="search"
                    className={`w-full`}
                    placeholder="Search"
                    {...field}
                    defaultValue={searchParams.get('query')?.toString() || ''}
                    onChange={(e) =>
                      debounce(() => {
                        handleSearch({
                          search: e.target.value,
                        });
                      }, 300)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <MagnifyingGlassIcon className={`w-4 h-4`} />
    </div>
  );
};
