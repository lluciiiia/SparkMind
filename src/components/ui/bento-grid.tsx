import { cn } from '@/lib/utils';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  content,
}: {
  className?: string;
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `relative row-span-1 rounded-xl transition 
        duration-200 shadow-input p-4 dark:bg-black 
        dark:border-white/[0.2] bg-[#f0f2f5] border
        border-transparent justify-between flex flex-col  
        h-[288px] mb-4`,
        className,
      )}
    >
      <div className="transition duration-200 h-full relative">
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {content}
        </div>
      </div>
    </div>
  );
};
