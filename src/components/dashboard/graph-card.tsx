'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Filter, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface ContractDashboardProps {
  clientFilter: string;
  yearFilter: string;
  contractFilter: string;
}

// Base static data for different scenarios
const baseData = {
  // Year-based data (larger numbers)
  yearly: {
    '2025': {
      monthly: [
        { month: 'Jan', value: 180, target: 200 },
        { month: 'Feb', value: 220, target: 210 },
        { month: 'Mar', value: 190, target: 220 },
        { month: 'Apr', value: 210, target: 230 },
        { month: 'May', value: 240, target: 240 },
        { month: 'Jun', value: 200, target: 250 },
        { month: 'Jul', value: 230, target: 240 },
        { month: 'Aug', value: 250, target: 250 },
        { month: 'Sep', value: 220, target: 260 },
        { month: 'Oct', value: 240, target: 270 },
        { month: 'Nov', value: 260, target: 280 },
        { month: 'Dec', value: 280, target: 290 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 590, target: 630 },
        { quarter: 'Q2', value: 650, target: 720 },
        { quarter: 'Q3', value: 700, target: 750 },
        { quarter: 'Q4', value: 780, target: 800 },
      ],
      regional: [
        { region: 'North America', value: 850, target: 800 },
        { region: 'Europe', value: 720, target: 700 },
        { region: 'Asia Pacific', value: 630, target: 600 },
        { region: 'Australia', value: 450, target: 500 },
        { region: 'South America', value: 350, target: 400 },
      ]
    },
    '2024': {
      monthly: [
        { month: 'Jan', value: 150, target: 180 },
        { month: 'Feb', value: 180, target: 190 },
        { month: 'Mar', value: 160, target: 200 },
        { month: 'Apr', value: 190, target: 210 },
        { month: 'May', value: 210, target: 220 },
        { month: 'Jun', value: 180, target: 230 },
        { month: 'Jul', value: 200, target: 220 },
        { month: 'Aug', value: 220, target: 230 },
        { month: 'Sep', value: 190, target: 240 },
        { month: 'Oct', value: 210, target: 250 },
        { month: 'Nov', value: 230, target: 260 },
        { month: 'Dec', value: 250, target: 270 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 490, target: 570 },
        { quarter: 'Q2', value: 580, target: 650 },
        { quarter: 'Q3', value: 610, target: 680 },
        { quarter: 'Q4', value: 670, target: 720 },
      ],
      regional: [
        { region: 'North America', value: 750, target: 700 },
        { region: 'Europe', value: 620, target: 600 },
        { region: 'Asia Pacific', value: 530, target: 500 },
        { region: 'Australia', value: 350, target: 400 },
        { region: 'South America', value: 250, target: 300 },
      ]
    },
    '2023': {
      monthly: [
        { month: 'Jan', value: 120, target: 150 },
        { month: 'Feb', value: 150, target: 160 },
        { month: 'Mar', value: 130, target: 170 },
        { month: 'Apr', value: 160, target: 180 },
        { month: 'May', value: 180, target: 190 },
        { month: 'Jun', value: 150, target: 200 },
        { month: 'Jul', value: 170, target: 190 },
        { month: 'Aug', value: 190, target: 200 },
        { month: 'Sep', value: 160, target: 210 },
        { month: 'Oct', value: 180, target: 220 },
        { month: 'Nov', value: 200, target: 230 },
        { month: 'Dec', value: 220, target: 240 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 400, target: 480 },
        { quarter: 'Q2', value: 490, target: 570 },
        { quarter: 'Q3', value: 520, target: 590 },
        { quarter: 'Q4', value: 560, target: 630 },
      ],
      regional: [
        { region: 'North America', value: 650, target: 600 },
        { region: 'Europe', value: 520, target: 500 },
        { region: 'Asia Pacific', value: 430, target: 400 },
        { region: 'Australia', value: 250, target: 300 },
        { region: 'South America', value: 150, target: 200 },
      ]
    }
  },
  
  // Client-based data (smaller numbers than yearly data)
  clients: {
    'Brown-Anderson': {
      monthly: [
        { month: 'Jan', value: 45, target: 50 },
        { month: 'Feb', value: 55, target: 52 },
        { month: 'Mar', value: 48, target: 55 },
        { month: 'Apr', value: 52, target: 57 },
        { month: 'May', value: 60, target: 60 },
        { month: 'Jun', value: 50, target: 62 },
        { month: 'Jul', value: 58, target: 60 },
        { month: 'Aug', value: 62, target: 62 },
        { month: 'Sep', value: 55, target: 65 },
        { month: 'Oct', value: 60, target: 67 },
        { month: 'Nov', value: 65, target: 70 },
        { month: 'Dec', value: 70, target: 72 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 148, target: 157 },
        { quarter: 'Q2', value: 162, target: 179 },
        { quarter: 'Q3', value: 175, target: 187 },
        { quarter: 'Q4', value: 195, target: 209 },
      ],
      regional: [
        { region: 'North America', value: 212, target: 200 },
        { region: 'Europe', value: 180, target: 175 },
        { region: 'Asia Pacific', value: 158, target: 150 },
        { region: 'Australia', value: 112, target: 125 },
        { region: 'South America', value: 88, target: 100 },
      ]
    },
    'Mendoza-Cannon': {
      monthly: [
        { month: 'Jan', value: 35, target: 40 },
        { month: 'Feb', value: 42, target: 42 },
        { month: 'Mar', value: 38, target: 44 },
        { month: 'Apr', value: 41, target: 46 },
        { month: 'May', value: 48, target: 48 },
        { month: 'Jun', value: 40, target: 50 },
        { month: 'Jul', value: 46, target: 48 },
        { month: 'Aug', value: 50, target: 50 },
        { month: 'Sep', value: 44, target: 52 },
        { month: 'Oct', value: 48, target: 54 },
        { month: 'Nov', value: 52, target: 56 },
        { month: 'Dec', value: 56, target: 58 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 115, target: 126 },
        { quarter: 'Q2', value: 129, target: 144 },
        { quarter: 'Q3', value: 140, target: 150 },
        { quarter: 'Q4', value: 156, target: 168 },
      ],
      regional: [
        { region: 'North America', value: 170, target: 160 },
        { region: 'Europe', value: 144, target: 140 },
        { region: 'Asia Pacific', value: 126, target: 120 },
        { region: 'Australia', value: 90, target: 100 },
        { region: 'South America', value: 70, target: 80 },
      ]
    },
    'Stein-Cain': {
      monthly: [
        { month: 'Jan', value: 28, target: 32 },
        { month: 'Feb', value: 34, target: 34 },
        { month: 'Mar', value: 30, target: 35 },
        { month: 'Apr', value: 33, target: 37 },
        { month: 'May', value: 38, target: 38 },
        { month: 'Jun', value: 32, target: 40 },
        { month: 'Jul', value: 37, target: 38 },
        { month: 'Aug', value: 40, target: 40 },
        { month: 'Sep', value: 35, target: 42 },
        { month: 'Oct', value: 38, target: 43 },
        { month: 'Nov', value: 42, target: 45 },
        { month: 'Dec', value: 45, target: 46 },
      ],
      quarterly: [
        { quarter: 'Q1', value: 92, target: 101 },
        { quarter: 'Q2', value: 103, target: 115 },
        { quarter: 'Q3', value: 112, target: 120 },
        { quarter: 'Q4', value: 125, target: 134 },
      ],
      regional: [
        { region: 'North America', value: 136, target: 128 },
        { region: 'Europe', value: 115, target: 112 },
        { region: 'Asia Pacific', value: 101, target: 96 },
        { region: 'Australia', value: 72, target: 80 },
        { region: 'South America', value: 56, target: 64 },
      ]
    }
  },
  
  // Contract-based data (smaller numbers than yearly data)
  contracts: {
    'Custom': {
      monthly: [
        { month: 'Jan', value: 60, target: 65 },
        { month: 'Feb', value: 70, target: 68 },
        { month: 'Mar', value: 63, target: 70 },
        { month: 'Apr', value: 68, target: 72 },
        { month: 'May', value: 75, target: 75 },
        { month: 'Jun', value: 65, target: 77 },
        { month: 'Jul', value: 72, target: 75 },
        { month: 'Aug', value: 77, target: 77 },
        { month: 'Sep', value: 68, target: 80 },
        { month: 'Oct', value: 73, target: 82 },
        { month: 'Nov', value: 78, target: 85 },
        { month: 'Dec', value: 82, target: 87 },
      ]
    },
    'FFS': {
      monthly: [
        { month: 'Jan', value: 40, target: 45 },
        { month: 'Feb', value: 48, target: 47 },
        { month: 'Mar', value: 42, target: 48 },
        { month: 'Apr', value: 46, target: 50 },
        { month: 'May', value: 52, target: 52 },
        { month: 'Jun', value: 44, target: 54 },
        { month: 'Jul', value: 50, target: 52 },
        { month: 'Aug', value: 54, target: 54 },
        { month: 'Sep', value: 47, target: 56 },
        { month: 'Oct', value: 51, target: 58 },
        { month: 'Nov', value: 55, target: 60 },
        { month: 'Dec', value: 58, target: 62 },
      ]
    },
    'Vendor Contract': {
      monthly: [
        { month: 'Jan', value: 50, target: 55 },
        { month: 'Feb', value: 58, target: 57 },
        { month: 'Mar', value: 52, target: 58 },
        { month: 'Apr', value: 56, target: 60 },
        { month: 'May', value: 62, target: 62 },
        { month: 'Jun', value: 54, target: 64 },
        { month: 'Jul', value: 60, target: 62 },
        { month: 'Aug', value: 64, target: 64 },
        { month: 'Sep', value: 57, target: 66 },
        { month: 'Oct', value: 61, target: 68 },
        { month: 'Nov', value: 65, target: 70 },
        { month: 'Dec', value: 68, target: 72 },
      ]
    },
    'Retainer': {
      monthly: [
        { month: 'Jan', value: 30, target: 35 },
        { month: 'Feb', value: 38, target: 37 },
        { month: 'Mar', value: 32, target: 38 },
        { month: 'Apr', value: 36, target: 40 },
        { month: 'May', value: 42, target: 42 },
        { month: 'Jun', value: 34, target: 44 },
        { month: 'Jul', value: 40, target: 42 },
        { month: 'Aug', value: 44, target: 44 },
        { month: 'Sep', value: 37, target: 46 },
        { month: 'Oct', value: 41, target: 48 },
        { month: 'Nov', value: 45, target: 50 },
        { month: 'Dec', value: 48, target: 52 },
      ]
    }
  }
};

export function ContractChart({
  clientFilter,
  contractFilter,
  yearFilter,
}: ContractDashboardProps) {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartType, setChartType] = useState('bar');
  const [showTarget, setShowTarget] = useState(false);

  // Determine which data to use based on filters
  const getFilteredData = useMemo(() => {
    // Priority: yearFilter > clientFilter > contractFilter
    if (yearFilter && yearFilter !== 'All' && baseData.yearly[yearFilter as keyof typeof baseData.yearly]) {
      return baseData.yearly[yearFilter as keyof typeof baseData.yearly][timeRange as keyof typeof baseData.yearly['2025']] || [];
    }
    
    if (clientFilter && baseData.clients[clientFilter as keyof typeof baseData.clients]) {
      return baseData.clients[clientFilter as keyof typeof baseData.clients][timeRange as keyof typeof baseData.clients['Brown-Anderson']] || [];
    }
    
    if (contractFilter && contractFilter !== 'All' && baseData.contracts[contractFilter as keyof typeof baseData.contracts]) {
      // For contract filter, default to monthly if other time ranges aren't available
      if (timeRange === 'monthly') {
        return baseData.contracts[contractFilter as keyof typeof baseData.contracts].monthly;
      }
      // For other time ranges with contract filter, return empty or fallback
      return [];
    }
    
    // Default to 2025 yearly data if no specific filters
    return baseData.yearly['2025'][timeRange as keyof typeof baseData.yearly['2025']] || [];
  }, [yearFilter, clientFilter, contractFilter, timeRange]);

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'quarterly':
        return 'quarter';
      case 'yearly':
        return 'year';
      case 'regional':
        return 'region';
      default:
        return 'month';
    }
  };

  const renderChart = () => {
    const data = getFilteredData;
    const xAxisKey = getXAxisKey();

    if (!data || data.length === 0) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">No data available for the selected filters</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
            {showTarget && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            {showTarget && (
              <Area
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
          </AreaChart>
        );

      default:
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            {showTarget && (
              <Bar dataKey="target" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
            )}
          </BarChart>
        );
    }
  };

  const getChartHeight = () => {
    switch (timeRange) {
      case 'regional':
        return '72';
      case 'quarterly':
        return '64';
      default:
        return '64';
    }
  };

  // Get current filter info for display
  const getCurrentFilterInfo = () => {
    if (yearFilter && yearFilter !== 'All') return `Year: ${yearFilter}`;
    if (clientFilter) return `Client: ${clientFilter}`;
    if (contractFilter && contractFilter !== 'All') return `Contract: ${contractFilter}`;
    return 'All Data';
  };
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg font-semibold">
            Monthly Booked Appointments
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Filter */}
            {/* <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="regional">By Region</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardHeader>

        <CardContent>
          <div className={`h-${getChartHeight()}`}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
          <div className='mt-4 flex items-end justify-evenly px-4'>
            <div className='flex flex-col items-center space-y-1'>
              <span className='text-xs text-gray-500 font-bold'>
                {yearFilter && yearFilter !== 'All' ? yearFilter : '2025'}
              </span>
              <div className='h-px w-full bg-gray-200'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}