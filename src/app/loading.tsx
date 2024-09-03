'use client';
import { CenterLayout } from '@/components';
import React from 'react';

const Loading = React.memo(() => {
  return (
    <>
      <CenterLayout
        Element={`section`}
        className={`
					flex flex-col justify-center
					items-center h-screen w-screen
					overflow-hidden  top-0
					left-0 bottom-0 right-0 z-50
        `}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 z-50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2  border-foreground" />
        </div>
      </CenterLayout>
    </>
  );
});
export default Loading;
