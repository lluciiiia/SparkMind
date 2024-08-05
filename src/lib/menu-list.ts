import { Folder, LayoutDashboard, Square, SquarePlus, NotebookText } from 'lucide-react';

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

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          active: pathname.includes('/dashboard'),
          icon: LayoutDashboard,
          submenus: [],
        },
        {
          href: '/notes',
          label: 'My Notes',
          active: pathname.includes('/mynotes'),
          icon: NotebookText,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: '',
      menus: [
        {
          href: '/upload',
          label: 'Upload',
          active: pathname.includes('/upload'),
          icon: SquarePlus,
          submenus: [
            {
              href: '/allresources',
              label: 'All Resources',
              active: pathname.includes('/allresources'),
            },
            {
              href: '/video',
              label: 'Video',
              active: pathname.includes('/video'),
            },
            {
              href: '/text',
              label: 'Text',
              active: pathname.includes('/text'),
            },
            {
              href: '/keywords',
              label: 'Keywords',
              active: pathname.includes('/keywords'),
            },
          ],
        },
      ],
    },
  ];
}
