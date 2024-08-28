import { Menu } from '@/components/dashboard/menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button className="flex items-center justify-center pt-1 pb-2" variant="link" asChild>
            <Link href="." className="flex items-center gap-2">
              <Image
                src={'/assets/images/logo.png'}
                alt="logo"
                width={10}
                height={10}
                className="w-8 h-8 mr-1"
              />
              <h1
                className={
                  'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300'
                }
              >
                Spark Mind
              </h1>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
