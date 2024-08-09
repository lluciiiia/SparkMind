import { Folder, LayoutDashboard, Square, SquarePlus } from 'lucide-react';

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
          label: 'Dashboard',
          active: pathname.includes(`/dashboard`),
          icon: LayoutDashboard,
          submenus: [],
        },
        // {
        //   href: `/myresources?id=${id}`,
        //   label: 'My Resources',
        //   active: pathname.includes(`/myresources`),
        //   icon: Folder,
        //   submenus: [],
        // },
        // {
        //   href: `/myqna?id=${id}`,
        //   label: 'My QnA',
        //   active: pathname.includes(`/myqna`),
        //   icon: Folder,
        //   submenus: [],
        // },
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
            {
              href: `/videoupload?id=${id}`,
              label: 'Video',
              active: pathname.includes(`/videoupload`),
            },
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
