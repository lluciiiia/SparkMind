import { Input, type InputProps } from '@/components/ui/input';
import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = React.memo((props: Omit<InputProps, 'type' | 'className'>) => {
  return (
    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
      <FaSearch className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Search"
        className="w-full border-0 h-8 font-semibold focus-visible:outline-none focus-visible:ring-0"
        {...props}
      />
    </div>
  );
});
