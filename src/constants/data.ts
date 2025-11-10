import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Master',
    url: '#',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [
      {
        title: 'Customers Management',
        url: '/dashboard/customers-management',
        icon: 'users',
        shortcut: ['m', 'm']
      },
      {
        title: 'Users Management',
        url: '/dashboard/users-management',
        icon: 'users',
        shortcut: ['m', 'm']
      },
      // {
      //   title: 'Products Management',
      //   url: '/dashboard/product-management',
      //   icon: 'file',
      //   shortcut: ['m', 'm']
      // },
      {
        title: 'Invard Material Management',
        url: '/dashboard/invard-material-management',
        icon: 'file',
        shortcut: ['m', 'm']
      },
      // {
      //   title: 'Material Management',
      //   url: '/dashboard/material-management',
      //   icon: 'file',
      //   shortcut: ['m', 'm']
      // },
    ]
  },
  {
    title: 'Permission Management',
    url: '/dashboard/permission-management',
    icon: 'permission',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
];
