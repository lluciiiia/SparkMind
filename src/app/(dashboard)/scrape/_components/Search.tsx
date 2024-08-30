'use client';

import { SearchBar } from '@/components';
import { debounce } from '@/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import type React from 'react';
import { memo, useCallback, useEffect, useState } from 'react';

export const Search = memo(({ search }: { search: string }) => {
  const [query, setQuery] = useQueryState('query');
  const [inputValue, setInputValue] = useState(query || '');
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    setInputValue(query || '');
  }, [query]);

  const handleSearch = useCallback(
    debounce((value: string) => {
      const trimmedValue = value.trim();
      setQuery(trimmedValue || null);
      if (trimmedValue) {
        replace(`${pathname}?query=${encodeURIComponent(trimmedValue)}`);
      } else {
        replace(pathname);
      }
    }, 300),
    [pathname, replace, setQuery],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleSearch(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  return (
    <div className="flex items-center gap-2">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <SearchBar
          placeholder={search}
          value={inputValue}
          onChange={handleInputChange}
          aria-label="Search scrapes"
        />
      </form>
    </div>
  );
});

Search.displayName = 'Search';
