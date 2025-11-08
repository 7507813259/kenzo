// components/dashboard/clients-revenue.tsx
'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

interface ClientsRevenueProps {
  statsData: {
    totalExpenditure: number;
    revenue: number;
    previousRevenue: number;
    revenueChange: string;
    previousExpenditure: number;
    expenditureChange: string;
  };
}

export const ClientsRevenue = ({ statsData }: ClientsRevenueProps) => {
  const { state } = useSidebar();
  console.log('💰 ClientsRevenue received statsData:', statsData); // Add this debug log

  return (
    <div className='h-full rounded-2xl p-[1px]'>
      <div className='space-y-3 rounded-2xl bg-[linear-gradient(117.27deg,#074556_12.45%,#22CE6C_78.47%)] p-4'>
        {/* Total Expenditure */}
        <Card className='rounded-xl border border-gray-100 shadow-sm h-32'>
          <CardContent className='p-0 px-4'>
            <div className='flex items-baseline justify-between'>
              <h3 className='mb-2 text-base font-medium text-gray-600'>
                Total Expenditure
              </h3>
              <span className='rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white'>
                {statsData.expenditureChange}
              </span>
            </div>

            <div className=''>
              <span
                className={`${
                  state === 'collapsed' ? 'text-[24px]' : 'text-2xl'
                } font-semibold text-[#00303f]`}
              >
                ${statsData.totalExpenditure.toLocaleString()}
              </span>
            </div>

            <div
              className={`mt-2 flex items-center justify-between text-gray-500 ${
                state === 'collapsed' ? 'text-[12px]' : 'text-[14px]'
              }`}
            >
              <span>vs prev. ${statsData.previousExpenditure.toLocaleString()}</span>

              
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className='rounded-xl border border-gray-100 shadow-sm h-32'>
          <CardContent className='p-0 px-4'>
            <div className='flex items-baseline justify-between'>
              <h3 className='mb-2 text-base font-medium text-gray-600'>
                Revenue
              </h3>
              <span className='rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white'>
                {statsData.revenueChange}
              </span>
            </div>

            <div className=''>
              <span
                className={`${
                  state === 'collapsed' ? 'text-[24px]' : 'text-2xl'
                } font-semibold text-[#00303f]`}
              >
                ${statsData.revenue.toLocaleString()}
              </span>
            </div>

            <div
              className={`mt-2 flex items-center justify-between text-gray-500 ${
                state === 'collapsed' ? 'text-[12px]' : 'text-[14px]'
              }`}
            >
              <span>vs prev. ${statsData.previousRevenue.toLocaleString()}</span>

              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};