'use client';

import { useState, useMemo, useEffect } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export const description = 'A linear line chart';

interface chartLineLinear {
  clientFilter: string;
}

// Raw data from your table
const rawData = [
  {
    year: 2025,
    month: 'Jan',
    techCorpInc: 4.13,
    innovateLabs: 3.2,
    globalSolutions: 4.15,
    grandTotal: 3.83
  },
  {
    year: 2025,
    month: 'Feb',
    techCorpInc: 4.5,
    innovateLabs: 3.8,
    globalSolutions: 3.8,
    grandTotal: 4.03
  },
  {
    year: 2025,
    month: 'Mar',
    techCorpInc: 4.3,
    innovateLabs: 4.1,
    globalSolutions: 3.7,
    grandTotal: 4.03
  },
  {
    year: 2025,
    month: 'Apr',
    techCorpInc: 4.15,
    innovateLabs: 3.7,
    globalSolutions: 3.85,
    grandTotal: 3.9
  },
  {
    year: 2025,
    month: 'May',
    techCorpInc: 4.55,
    innovateLabs: 4.15,
    globalSolutions: 4.9,
    grandTotal: 4.53
  },
  {
    year: 2025,
    month: 'Jun',
    techCorpInc: 4.47,
    innovateLabs: 4.4,
    globalSolutions: 4.3,
    grandTotal: 4.39
  },
  {
    year: 2025,
    month: 'Jul',
    techCorpInc: 3.5,
    innovateLabs: 4.8,
    globalSolutions: 3.3,
    grandTotal: 3.87
  },
  {
    year: 2025,
    month: 'Aug',
    techCorpInc: 3.6,
    innovateLabs: 4.6,
    globalSolutions: 3.3,
    grandTotal: 3.83
  },
  {
    year: 2025,
    month: 'Sep',
    techCorpInc: 4.4,
    innovateLabs: 4.6,
    globalSolutions: 3.8,
    grandTotal: 4.27
  },
  {
    year: 2025,
    month: 'Oct',
    techCorpInc: 3.9,
    innovateLabs: 3.9,
    globalSolutions: 5.0,
    grandTotal: 4.27
  },
  {
    year: 2025,
    month: 'Nov',
    techCorpInc: 3.8,
    innovateLabs: 3.8,
    globalSolutions: 4.5,
    grandTotal: 4.03
  },
  {
    year: 2025,
    month: 'Dec',
    techCorpInc: 4.0,
    innovateLabs: 4.7,
    globalSolutions: 4.7,
    grandTotal: 4.47
  }
];

// Transform data for the chart
const chartData = rawData.map((item) => ({
  month: item.month,
  techCorpInc: item.techCorpInc,
  innovateLabs: item.innovateLabs,
  globalSolutions: item.globalSolutions,
  grandTotal: item.grandTotal
}));

// User options for dropdown
const userOptions = [
  { value: 'techCorpInc', label: 'TechCorp Inc.' },
  { value: 'innovateLabs', label: 'Innovate Labs' },
  { value: 'globalSolutions', label: 'Global Solutions' },
  { value: 'grandTotal', label: 'Grand Total' }
];

// Chart configuration
const chartConfig = {
  techCorpInc: {
    label: 'TechCorp Inc.',
    color: 'var(--chart-1)'
  },
  innovateLabs: {
    label: 'Innovate Labs',
    color: 'var(--chart-2)'
  },
  globalSolutions: {
    label: 'Global Solutions',
    color: 'var(--chart-3)'
  },
  grandTotal: {
    label: 'Grand Total',
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig;

// Map client filter names to data keys
const clientFilterMap: Record<string, string> = {
  'TechCorp Inc.': 'techCorpInc',
  'Innovate Labs': 'innovateLabs',
  'Global Solutions': 'globalSolutions'
};

export function ChartLineLinear({ clientFilter }: chartLineLinear) {
  // Determine initial selected user based on clientFilter
  const getInitialSelectedUser = () => {
    if (clientFilter && clientFilterMap[clientFilter]) {
      return clientFilterMap[clientFilter];
    }
    return 'grandTotal';
  };

  const [selectedUser, setSelectedUser] = useState(getInitialSelectedUser);
  const selectedUserConfig =
    chartConfig[selectedUser as keyof typeof chartConfig];

  // Update selected user when clientFilter changes
  useEffect(() => {
    if (clientFilter && clientFilterMap[clientFilter]) {
      setSelectedUser(clientFilterMap[clientFilter]);
    } else {
      // If no clientFilter or invalid clientFilter, default to grandTotal
      setSelectedUser('grandTotal');
    }
  }, [clientFilter]);

  // Get current display label
  const getCurrentDisplayLabel = () => {
    return (
      userOptions.find((option) => option.value === selectedUser)?.label ||
      'Grand Total'
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          {/* Left side - Title */}
          <div>
            <CardTitle className='pb-2 text-lg font-semibold'>
              Average CSAT - Per Appointment
            </CardTitle>
            <CardDescription className='text-sm'>
              January - December 2025
            </CardDescription>
          </div>

          {/* Right side - Label + Dropdown */}
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium whitespace-nowrap text-gray-600'>
              Select Client:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  className='flex h-8 items-center gap-2 text-sm'
                >
                  {getCurrentDisplayLabel()}
                  <ChevronDown className='h-3 w-3' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {userOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSelectedUser(option.value)}
                    className={selectedUser === option.value ? 'bg-accent' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex-1 pt-0 pb-6'>
        <ChartContainer
          config={{ [selectedUser]: selectedUserConfig }}
          className='h-54 w-full'
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 4,
              right: 8,
              top: 8,
              bottom: 8
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={3}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={3}
              domain={[3, 5.5]}
              tickCount={6}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={selectedUser}
              type='linear'
              stroke={`var(--color-${selectedUser})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
