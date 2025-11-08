// components/dashboard/stat-card.tsx
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'positive' | 'negative' | 'neutral';
}

export const StatCard = ({
  title,
  value,
  change,
  trend = 'neutral'
}: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendSymbol = () => {
    switch (trend) {
      case 'positive':
        return '+';
      case 'negative':
        return '-';
      default:
        return '';
    }
  };

  const getTrendImage = () => {
    switch (trend) {
      case 'positive':
        return '/dashboard/positive.svg'; // ✅ replace with your actual image path
      case 'negative':
        return '/dashboard/negative.svg';
      default:
        return '/dashboard/positive.svg'; // default image
    }
  };
  return (
    <Card>
      <CardContent className='px-4'>
        <div className='flex flex-row justify-between space-y-2'>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <div className='flex items-baseline justify-between'>
            {change && (
              <span className={`text-sm ${getTrendColor()}`}>
                {getTrendSymbol()}
                {change}
              </span>
            )}
          </div>
        </div>
        <div className='flex gap-3 items-center justify-between rounded-md bg-[#F8F8F8] p-3'>
          <p className='text-2xl font-bold pb-0 mb-0'>{value}</p>
          {change && (
            <Image
              src={getTrendImage()}
              alt={`${trend} trend`}
              width={100}
              height={100}
              className='rounded-full'
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
