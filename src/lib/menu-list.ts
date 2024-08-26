import { Book, Filter, Folder, House, Square, SquarePlus } from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, id: string | null): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: `/dashboard?id=${id}`,
          label: 'Home',
          active: pathname.includes(`/dashboard`),
          icon: House,
          submenus: [],
        },
        {
          href: `/my-learning`,
          label: 'My Learning',
          active: pathname.includes(`/my-learning`),
          icon: Folder,
          submenus: [],
        },
        {
          href: `/scrape`,
          label: 'Scrape',
          active: pathname.includes(`/scrape`),
          icon: Filter,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: '',
      menus: [
        {
          href: `/upload?id=${id}`,
          label: 'Upload',
          active: pathname.includes(`/upload`),
          icon: SquarePlus,
          submenus: [
            {
              href: `/allresources?id=${id}`,
              label: 'All Resources',
              active: pathname.includes(`/allresources`),
            },
            // {
            //   href: `/videoupload?id=${id}`,
            //   label: 'Video',
            //   active: pathname.includes(`/videoupload`),
            // },
            {
              href: `/textupload?id=${id}`,
              label: 'Text',
              active: pathname.includes(`/textupload`),
            },
            {
              href: `/keywordsupload?id=${id}`,
              label: 'Keywords',
              active: pathname.includes(`/keywordsupload`),
            },
          ],
        },
      ],
    },
  ];
}
