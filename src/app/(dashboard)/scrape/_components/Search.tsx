'use client';

import { debounce } from '@/utils';

import { SearchBar } from '@/components';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import React, { memo } from 'react';

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
        <SearchBar
          placeholder={search}
          defaultValue={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </form>
    </div>
  );
});
