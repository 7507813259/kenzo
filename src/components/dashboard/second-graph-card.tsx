'use client';

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

interface ContractDashboardProps {
  clientFilter: string;
  yearFilter: string;
  contractFilter: string;
  onYearFilterChange?: (year: string) => void;
}

// Base chart data structure for different scenarios
const baseChartData = {
  // Year-based data (2021-2026)
  '2026': [
    { month: "Jan", workshop: 320, webinar: 280, psychometric: 35 },
    { month: "Feb", workshop: 290, webinar: 255, psychometric: 32 },
    { month: "Mar", workshop: 350, webinar: 310, psychometric: 28 },
    { month: "Apr", workshop: 310, webinar: 270, psychometric: 38 },
    { month: "May", workshop: 340, webinar: 300, psychometric: 34 },
    { month: "Jun", workshop: 330, webinar: 295, psychometric: 36 },
    { month: "Jul", workshop: 380, webinar: 340, psychometric: 40 },
    { month: "Aug", workshop: 340, webinar: 300, psychometric: 35 },
    { month: "Sep", workshop: 350, webinar: 290, psychometric: 45 },
    { month: "Oct", workshop: 370, webinar: 320, psychometric: 48 },
    { month: "Nov", workshop: 360, webinar: 315, psychometric: 42 },
    { month: "Dec", workshop: 390, webinar: 350, psychometric: 50 }
  ],
  '2025': [
    { month: "Jan", workshop: 272, webinar: 230, psychometric: 29 },
    { month: "Feb", workshop: 234, webinar: 205, psychometric: 23 },
    { month: "Mar", workshop: 296, webinar: 261, psychometric: 18 },
    { month: "Apr", workshop: 246, webinar: 208, psychometric: 26 },
    { month: "May", workshop: 278, webinar: 240, psychometric: 22 },
    { month: "Jun", workshop: 268, webinar: 235, psychometric: 25 },
    { month: "Jul", workshop: 312, webinar: 272, psychometric: 27 },
    { month: "Aug", workshop: 272, webinar: 239, psychometric: 22 },
    { month: "Sep", workshop: 279, webinar: 228, psychometric: 33 },
    { month: "Oct", workshop: 300, webinar: 251, psychometric: 37 },
    { month: "Nov", workshop: 290, webinar: 245, psychometric: 35 },
    { month: "Dec", workshop: 320, webinar: 280, psychometric: 40 }
  ],
  '2024': [
    { month: "Jan", workshop: 240, webinar: 200, psychometric: 25 },
    { month: "Feb", workshop: 210, webinar: 180, psychometric: 20 },
    { month: "Mar", workshop: 260, webinar: 220, psychometric: 15 },
    { month: "Apr", workshop: 220, webinar: 185, psychometric: 22 },
    { month: "May", workshop: 250, webinar: 210, psychometric: 18 },
    { month: "Jun", workshop: 240, webinar: 205, psychometric: 21 },
    { month: "Jul", workshop: 280, webinar: 240, psychometric: 23 },
    { month: "Aug", workshop: 240, webinar: 210, psychometric: 19 },
    { month: "Sep", workshop: 250, webinar: 200, psychometric: 28 },
    { month: "Oct", workshop: 270, webinar: 225, psychometric: 32 },
    { month: "Nov", workshop: 260, webinar: 220, psychometric: 30 },
    { month: "Dec", workshop: 290, webinar: 250, psychometric: 35 }
  ],
  '2023': [
    { month: "Jan", workshop: 200, webinar: 170, psychometric: 20 },
    { month: "Feb", workshop: 180, webinar: 150, psychometric: 16 },
    { month: "Mar", workshop: 220, webinar: 190, psychometric: 12 },
    { month: "Apr", workshop: 190, webinar: 160, psychometric: 18 },
    { month: "May", workshop: 210, webinar: 180, psychometric: 14 },
    { month: "Jun", workshop: 200, webinar: 175, psychometric: 17 },
    { month: "Jul", workshop: 240, webinar: 210, psychometric: 19 },
    { month: "Aug", workshop: 200, webinar: 175, psychometric: 15 },
    { month: "Sep", workshop: 210, webinar: 170, psychometric: 23 },
    { month: "Oct", workshop: 230, webinar: 195, psychometric: 27 },
    { month: "Nov", workshop: 220, webinar: 190, psychometric: 25 },
    { month: "Dec", workshop: 250, webinar: 220, psychometric: 30 }
  ],
  '2022': [
    { month: "Jan", workshop: 160, webinar: 140, psychometric: 15 },
    { month: "Feb", workshop: 140, webinar: 120, psychometric: 12 },
    { month: "Mar", workshop: 180, webinar: 160, psychometric: 8 },
    { month: "Apr", workshop: 150, webinar: 130, psychometric: 14 },
    { month: "May", workshop: 170, webinar: 150, psychometric: 10 },
    { month: "Jun", workshop: 160, webinar: 145, psychometric: 13 },
    { month: "Jul", workshop: 200, webinar: 180, psychometric: 15 },
    { month: "Aug", workshop: 160, webinar: 140, psychometric: 11 },
    { month: "Sep", workshop: 170, webinar: 140, psychometric: 18 },
    { month: "Oct", workshop: 190, webinar: 165, psychometric: 22 },
    { month: "Nov", workshop: 180, webinar: 160, psychometric: 20 },
    { month: "Dec", workshop: 210, webinar: 190, psychometric: 25 }
  ],
  '2021': [
    { month: "Jan", workshop: 120, webinar: 110, psychometric: 10 },
    { month: "Feb", workshop: 100, webinar: 90, psychometric: 8 },
    { month: "Mar", workshop: 140, webinar: 130, psychometric: 5 },
    { month: "Apr", workshop: 110, webinar: 100, psychometric: 10 },
    { month: "May", workshop: 130, webinar: 120, psychometric: 7 },
    { month: "Jun", workshop: 120, webinar: 115, psychometric: 9 },
    { month: "Jul", workshop: 160, webinar: 150, psychometric: 11 },
    { month: "Aug", workshop: 120, webinar: 105, psychometric: 8 },
    { month: "Sep", workshop: 130, webinar: 110, psychometric: 13 },
    { month: "Oct", workshop: 150, webinar: 135, psychometric: 17 },
    { month: "Nov", workshop: 140, webinar: 130, psychometric: 15 },
    { month: "Dec", workshop: 170, webinar: 160, psychometric: 20 }
  ]
};

// Client-based data (smaller numbers)
const clientData = {
  'TechCorp Inc.': [
    { month: "Jan", workshop: 85, webinar: 75, psychometric: 12 },
    { month: "Feb", workshop: 78, webinar: 68, psychometric: 10 },
    { month: "Mar", workshop: 92, webinar: 82, psychometric: 8 },
    { month: "Apr", workshop: 82, webinar: 72, psychometric: 11 },
    { month: "May", workshop: 88, webinar: 78, psychometric: 9 },
    { month: "Jun", workshop: 84, webinar: 76, psychometric: 10 },
    { month: "Jul", workshop: 96, webinar: 86, psychometric: 12 },
    { month: "Aug", workshop: 85, webinar: 75, psychometric: 9 },
    { month: "Sep", workshop: 87, webinar: 74, psychometric: 14 },
    { month: "Oct", workshop: 90, webinar: 80, psychometric: 16 },
    { month: "Nov", workshop: 88, webinar: 78, psychometric: 15 },
    { month: "Dec", workshop: 95, webinar: 85, psychometric: 18 }
  ],
  'Innovate Labs': [
    { month: "Jan", workshop: 72, webinar: 65, psychometric: 10 },
    { month: "Feb", workshop: 65, webinar: 58, psychometric: 8 },
    { month: "Mar", workshop: 78, webinar: 70, psychometric: 6 },
    { month: "Apr", workshop: 68, webinar: 60, psychometric: 9 },
    { month: "May", workshop: 74, webinar: 66, psychometric: 7 },
    { month: "Jun", workshop: 70, webinar: 64, psychometric: 8 },
    { month: "Jul", workshop: 82, webinar: 74, psychometric: 10 },
    { month: "Aug", workshop: 72, webinar: 63, psychometric: 7 },
    { month: "Sep", workshop: 74, webinar: 62, psychometric: 11 },
    { month: "Oct", workshop: 76, webinar: 68, psychometric: 13 },
    { month: "Nov", workshop: 74, webinar: 66, psychometric: 12 },
    { month: "Dec", workshop: 80, webinar: 72, psychometric: 15 }
  ],
  'Global Solutions': [
    { month: "Jan", workshop: 60, webinar: 55, psychometric: 8 },
    { month: "Feb", workshop: 55, webinar: 48, psychometric: 6 },
    { month: "Mar", workshop: 65, webinar: 58, psychometric: 4 },
    { month: "Apr", workshop: 58, webinar: 50, psychometric: 7 },
    { month: "May", workshop: 62, webinar: 55, psychometric: 5 },
    { month: "Jun", workshop: 59, webinar: 53, psychometric: 6 },
    { month: "Jul", workshop: 68, webinar: 62, psychometric: 8 },
    { month: "Aug", workshop: 60, webinar: 52, psychometric: 5 },
    { month: "Sep", workshop: 62, webinar: 51, psychometric: 9 },
    { month: "Oct", workshop: 64, webinar: 57, psychometric: 11 },
    { month: "Nov", workshop: 62, webinar: 55, psychometric: 10 },
    { month: "Dec", workshop: 67, webinar: 60, psychometric: 12 }
  ]
};

// Contract-based data (smaller numbers)
const contractData = {
  'Custom': [
    { month: "Jan", workshop: 95, webinar: 85, psychometric: 14 },
    { month: "Feb", workshop: 88, webinar: 78, psychometric: 12 },
    { month: "Mar", workshop: 102, webinar: 92, psychometric: 10 },
    { month: "Apr", workshop: 92, webinar: 82, psychometric: 13 },
    { month: "May", workshop: 98, webinar: 88, psychometric: 11 },
    { month: "Jun", workshop: 94, webinar: 86, psychometric: 12 },
    { month: "Jul", workshop: 106, webinar: 96, psychometric: 14 },
    { month: "Aug", workshop: 95, webinar: 85, psychometric: 11 },
    { month: "Sep", workshop: 97, webinar: 84, psychometric: 16 },
    { month: "Oct", workshop: 100, webinar: 90, psychometric: 18 },
    { month: "Nov", workshop: 98, webinar: 88, psychometric: 17 },
    { month: "Dec", workshop: 105, webinar: 95, psychometric: 20 }
  ],
  'FFS': [
    { month: "Jan", workshop: 65, webinar: 58, psychometric: 9 },
    { month: "Feb", workshop: 58, webinar: 51, psychometric: 7 },
    { month: "Mar", workshop: 72, webinar: 65, psychometric: 5 },
    { month: "Apr", workshop: 62, webinar: 55, psychometric: 8 },
    { month: "May", workshop: 68, webinar: 61, psychometric: 6 },
    { month: "Jun", workshop: 64, webinar: 59, psychometric: 7 },
    { month: "Jul", workshop: 76, webinar: 69, psychometric: 9 },
    { month: "Aug", workshop: 65, webinar: 58, psychometric: 6 },
    { month: "Sep", workshop: 67, webinar: 57, psychometric: 11 },
    { month: "Oct", workshop: 70, webinar: 63, psychometric: 13 },
    { month: "Nov", workshop: 68, webinar: 61, psychometric: 12 },
    { month: "Dec", workshop: 75, webinar: 68, psychometric: 15 }
  ],
  'Vendor Contract': [
    { month: "Jan", workshop: 80, webinar: 72, psychometric: 11 },
    { month: "Feb", workshop: 73, webinar: 65, psychometric: 9 },
    { month: "Mar", workshop: 87, webinar: 78, psychometric: 7 },
    { month: "Apr", workshop: 77, webinar: 68, psychometric: 10 },
    { month: "May", workshop: 83, webinar: 75, psychometric: 8 },
    { month: "Jun", workshop: 79, webinar: 73, psychometric: 9 },
    { month: "Jul", workshop: 91, webinar: 83, psychometric: 11 },
    { month: "Aug", workshop: 80, webinar: 72, psychometric: 8 },
    { month: "Sep", workshop: 82, webinar: 71, psychometric: 13 },
    { month: "Oct", workshop: 85, webinar: 77, psychometric: 15 },
    { month: "Nov", workshop: 83, webinar: 75, psychometric: 14 },
    { month: "Dec", workshop: 90, webinar: 82, psychometric: 17 }
  ],
  'Retainer': [
    { month: "Jan", workshop: 55, webinar: 48, psychometric: 7 },
    { month: "Feb", workshop: 48, webinar: 42, psychometric: 5 },
    { month: "Mar", workshop: 62, webinar: 55, psychometric: 3 },
    { month: "Apr", workshop: 52, webinar: 45, psychometric: 6 },
    { month: "May", workshop: 58, webinar: 51, psychometric: 4 },
    { month: "Jun", workshop: 54, webinar: 49, psychometric: 5 },
    { month: "Jul", workshop: 66, webinar: 59, psychometric: 7 },
    { month: "Aug", workshop: 55, webinar: 48, psychometric: 4 },
    { month: "Sep", workshop: 57, webinar: 47, psychometric: 9 },
    { month: "Oct", workshop: 60, webinar: 53, psychometric: 11 },
    { month: "Nov", workshop: 58, webinar: 51, psychometric: 10 },
    { month: "Dec", workshop: 65, webinar: 58, psychometric: 13 }
  ]
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SecondGraphChart({
  clientFilter,
  contractFilter,
  yearFilter,
  onYearFilterChange
}: ContractDashboardProps) {
  // Internal state for year filter as fallback
  const [internalYearFilter, setInternalYearFilter] = useState(yearFilter || '2025');
  
  // Use the prop if provided, otherwise use internal state
  const effectiveYearFilter = yearFilter || internalYearFilter;
  
  // Determine which data to use based on filters
  const chartData = useMemo(() => {
    // Priority: yearFilter > clientFilter > contractFilter
    if (effectiveYearFilter && effectiveYearFilter !== 'All' && baseChartData[effectiveYearFilter as keyof typeof baseChartData]) {
      return baseChartData[effectiveYearFilter as keyof typeof baseChartData];
    }
    
    if (clientFilter && clientData[clientFilter as keyof typeof clientData]) {
      return clientData[clientFilter as keyof typeof clientData];
    }
    
    if (contractFilter && contractFilter !== 'All' && contractData[contractFilter as keyof typeof contractData]) {
      return contractData[contractFilter as keyof typeof contractData];
    }
    
    // Default to 2025 data if no specific filters
    return baseChartData['2025'];
  }, [effectiveYearFilter, clientFilter, contractFilter]);

  // Handle year selection from dropdown
  const handleYearSelect = (year: string) => {
    if (onYearFilterChange) {
      onYearFilterChange(year);
    } else {
      // If no callback provided, use internal state
      setInternalYearFilter(year);
    }
  };

  // Get current filter info for display
  const getCurrentFilterInfo = () => {
    if (effectiveYearFilter && effectiveYearFilter !== 'All') return `Year: ${effectiveYearFilter}`;
    if (clientFilter) return `Client: ${clientFilter}`;
    if (contractFilter && contractFilter !== 'All') return `Contract: ${contractFilter}`;
    return 'All Data (2025)';
  };

  // Get appropriate Y-axis domain based on data
  const getYAxisDomain = () => {
    const maxValue = Math.max(...chartData.flatMap(item => [item.workshop, item.webinar, item.psychometric]));
    const roundedMax = Math.ceil(maxValue / 50) * 50;
    return [0, roundedMax];
  };

  const yAxisDomain = getYAxisDomain();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Appointment Booking Trend</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {getCurrentFilterInfo()}
            </p>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {effectiveYearFilter && effectiveYearFilter !== 'All' ? effectiveYearFilter : '2025'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleYearSelect('2026')}>2026</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearSelect('2025')}>2025</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearSelect('2024')}>2024</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearSelect('2023')}>2023</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearSelect('2022')}>2022</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleYearSelect('2021')}>2021</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                domain={yAxisDomain}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Three lines with specified colors and proper names */}
              <Line 
                type="monotone"
                dataKey="workshop" 
                name="Appointment Booked" 
                stroke="#7086FD" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="webinar" 
                name="Appointment Completed" 
                stroke="#6FD195" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line 
                type="monotone"
                dataKey="psychometric" 
                name="Appointment Refunded" 
                stroke="#FFAE4C" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center w-full gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#7086FD]"></div>
            <span className="text-muted-foreground">Appointment Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6FD195]"></div>
            <span className="text-muted-foreground">Appointment Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFAE4C]"></div>
            <span className="text-muted-foreground">Appointment Refunded</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}