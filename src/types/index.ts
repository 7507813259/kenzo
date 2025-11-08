import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


// Stats
export interface FilterState {
  selectedYear: string;
  date: Date | null;
  client: string;
  contractType: string;
  showFilters: boolean;
}

export interface StatsData {
  appointments: number;
  totalCompleted: number;
  totalCancelled: number;
  chargedCancellations: number;
  totalVendors: number;
  totalClients: number;
  totalExpenditure: number;
  revenue: number;
  previousRevenue: number;
  revenueChange: string;
}

export interface StatsState {
  data: StatsData;
  loading: boolean;
}

export interface RootState {
  filters: FilterState;
  stats: StatsState;
}