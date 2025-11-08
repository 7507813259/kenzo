// components/dashboard/second-donut.tsx
'use client';

import { useState, useMemo } from 'react';
import { DonutChartCard } from './donot';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { CalendarIcon, ChevronDown, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SecondContractDashboardProps {
  statsData?: {
    appointments?: number;
    totalCompleted?: number;
    totalCancelled?: number;
    chargedCancellations?: number;
    totalVendors?: number;
    totalClients?: number;
    totalExpenditure?: number;
    revenue?: number;
    previousRevenue?: number;
    revenueChange?: string;
  };
  filters?: {
    selectedYear: string;
    client: string;
    contractType: string;
    date: Date | null;
  };
  clientFilter?: string;
  contractFilter?: string;
}

// Mock clients data
const mockClients = [
  { id: '1', company: 'TechCorp Inc.' },
  { id: '2', company: 'Innovate Labs' },
  { id: '3', company: 'Global Solutions' }
];

// Filter options for the chart
const serviceStreamFilters = [
  'All',
  'Coaching Session',
  'Meditation',
  'Psychometric Testing',
  'Webinar',
  'Workshop',
  'Government'
];

// Year options
const yearOptions = ['All', '2025', '2024', '2023'];

export default function SecondContractDashboard({
  statsData,
  filters: externalFilters,
  clientFilter,
  contractFilter
}: SecondContractDashboardProps) {
  console.log('📊 SecondContractDashboard received statsData:', statsData);
  console.log('📊 SecondContractDashboard received clientFilter:', clientFilter);
  console.log('📊 SecondContractDashboard received contractFilter:', contractFilter);

  // State for global filters
  const [internalFilters, setInternalFilters] = useState({
    selectedYear: 'All',
    client: '',
    contractType: '',
    date: null as Date | null
  });

  // State for individual chart filter
  const [chartFilter, setChartFilter] = useState('All');

  // State for showing global filters
  const [showGlobalFilters, setShowGlobalFilters] = useState(false);

  // Use external filters if provided, otherwise use internal filters
  const globalFilters = externalFilters || internalFilters;
  const setGlobalFilters = externalFilters ? () => {} : setInternalFilters;

  const handleGlobalFilterChange = (
    key: keyof typeof globalFilters,
    value: any
  ) => {
    if (externalFilters) {
      console.log('External filter change requested:', key, value);
      return;
    }
    setInternalFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleChartFilterChange = (value: string) => {
    setChartFilter(value);
  };

  const clearAllFilters = () => {
    if (externalFilters) {
      console.log('Cannot clear external filters from child component');
      return;
    }
    setInternalFilters({
      selectedYear: 'All',
      client: '',
      contractType: '',
      date: null
    });
    setChartFilter('All');
  };

  // Filter data based on chart filter
  const filterChartData = (data: any[], filter: string) => {
    if (filter === 'All') return data;
    return data.filter((item) => item.name === filter);
  };

  // Apply contractFilter to data
  const applyContractFilter = (data: any[]) => {
    if (!contractFilter || contractFilter === 'All') return data;
    
    // Different contract types affect cancellation patterns differently
    const contractMultipliers = {
      'Custom': 0.9,    // Custom contracts have fewer cancellations
      'FFS': 1.2,       // Fee-for-service has higher cancellations
      'VendorContract': 1.1, // Vendor contracts have slightly higher cancellations
      'Retainer': 0.8   // Retainer contracts have fewer cancellations
    };
    
    const multiplier = contractMultipliers[contractFilter as keyof typeof contractMultipliers] || 1;
    
    return data.map(item => ({
      ...item,
      value: Math.round(item.value * multiplier)
    }));
  };

  // Apply clientFilter to data
  const applyClientFilter = (data: any[]) => {
    if (!clientFilter || clientFilter === 'All') return data;
    
    // Different clients have different cancellation patterns
    const clientMultipliers = {
      'TechCorp Inc.': 0.8,      // Enterprise client with lower cancellations
      'Innovate Labs': 1.0,      // Standard cancellation rate
      'Global Solutions': 1.3    // Higher cancellation rate
    };
    
    const multiplier = clientMultipliers[clientFilter as keyof typeof clientMultipliers] || 1;
    
    return data.map(item => ({
      ...item,
      value: Math.round(item.value * multiplier)
    }));
  };

  // Get chart data based on both global and external filters
  const getChartData = () => {
    // Base data - apply global filters first
    let baseData;

    // If no global filters are active, return default data
    if (
      globalFilters.selectedYear === 'All' &&
      !globalFilters.client &&
      !globalFilters.contractType &&
      !globalFilters.date
    ) {
      baseData = {
        chartData: [
          { name: 'Coaching Session', value: 4000, color: '#f0d657ff' },
          { name: 'Meditation', value: 1000, color: '#a0fbd0ff' },
          { name: 'Psychometric Testing', value: 3000, color: '#E57373' },
          { name: 'Webinar', value: 2000, color: '#8FA2FF' },
          { name: 'Workshop', value: 3000, color: '#3AD8FF' },
          { name: 'Government', value: 1500, color: '#FF6B6B' }
        ],
        totalCancellations: '1,460'
      };
    }
    // Year-specific data
    else if (
      globalFilters.selectedYear &&
      globalFilters.selectedYear !== 'All' &&
      !globalFilters.client &&
      !globalFilters.contractType
    ) {
      const yearData = {
        '2025': {
          chartData: [
            { name: 'Coaching Session', value: 4500, color: '#f0d657ff' },
            { name: 'Meditation', value: 1200, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 3200, color: '#E57373' },
            { name: 'Webinar', value: 2300, color: '#8FA2FF' },
            { name: 'Workshop', value: 3200, color: '#3AD8FF' },
            { name: 'Government', value: 1800, color: '#FF6B6B' }
          ],
          totalCancellations: '1,600'
        },
        '2024': {
          chartData: [
            { name: 'Coaching Session', value: 3800, color: '#f0d657ff' },
            { name: 'Meditation', value: 900, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 2800, color: '#E57373' },
            { name: 'Webinar', value: 1800, color: '#8FA2FF' },
            { name: 'Workshop', value: 2800, color: '#3AD8FF' },
            { name: 'Government', value: 1600, color: '#FF6B6B' }
          ],
          totalCancellations: '1,400'
        },
        '2023': {
          chartData: [
            { name: 'Coaching Session', value: 3500, color: '#f0d657ff' },
            { name: 'Meditation', value: 800, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 2500, color: '#E57373' },
            { name: 'Webinar', value: 1500, color: '#8FA2FF' },
            { name: 'Workshop', value: 2500, color: '#3AD8FF' },
            { name: 'Government', value: 1400, color: '#FF6B6B' }
          ],
          totalCancellations: '1,300'
        }
      };
      baseData =
        yearData[globalFilters.selectedYear as keyof typeof yearData] ||
        getDefaultData();
    }
    // Client-specific data
    else if (globalFilters.client) {
      const clientData = {
        'TechCorp Inc.': {
          chartData: [
            { name: 'Coaching Session', value: 1800, color: '#f0d657ff' },
            { name: 'Meditation', value: 400, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 1200, color: '#E57373' },
            { name: 'Webinar', value: 900, color: '#8FA2FF' },
            { name: 'Workshop', value: 1200, color: '#3AD8FF' },
            { name: 'Government', value: 600, color: '#FF6B6B' }
          ],
          totalCancellations: '700'
        },
        'Innovate Labs': {
          chartData: [
            { name: 'Coaching Session', value: 1500, color: '#f0d657ff' },
            { name: 'Meditation', value: 300, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 1000, color: '#E57373' },
            { name: 'Webinar', value: 700, color: '#8FA2FF' },
            { name: 'Workshop', value: 1000, color: '#3AD8FF' },
            { name: 'Government', value: 500, color: '#FF6B6B' }
          ],
          totalCancellations: '500'
        },
        'Global Solutions': {
          chartData: [
            { name: 'Coaching Session', value: 1200, color: '#f0d657ff' },
            { name: 'Meditation', value: 250, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 800, color: '#E57373' },
            { name: 'Webinar', value: 500, color: '#8FA2FF' },
            { name: 'Workshop', value: 800, color: '#3AD8FF' },
            { name: 'Government', value: 400, color: '#FF6B6B' }
          ],
          totalCancellations: '400'
        }
      };
      baseData =
        clientData[globalFilters.client as keyof typeof clientData] ||
        getDefaultData();
    }
    // Default fallback
    else {
      baseData = getDefaultData();
    }

    // Apply external filters (contractFilter and clientFilter)
    let filteredData = { ...baseData };
    
    // Apply contractFilter
    if (contractFilter && contractFilter !== 'All') {
      filteredData.chartData = applyContractFilter(filteredData.chartData);
    }
    
    // Apply clientFilter
    if (clientFilter && clientFilter !== 'All') {
      filteredData.chartData = applyClientFilter(filteredData.chartData);
    }

    // Apply individual chart filter on top of external filters
    return {
      ...filteredData,
      chartData: filterChartData(filteredData.chartData, chartFilter)
    };
  };

  const getDefaultData = () => {
    return {
      chartData: [
        { name: 'Coaching Session', value: 4000, color: '#f0d657ff' },
        { name: 'Meditation', value: 1000, color: '#a0fbd0ff' },
        { name: 'Psychometric Testing', value: 3000, color: '#E57373' },
        { name: 'Webinar', value: 2000, color: '#8FA2FF' },
        { name: 'Workshop', value: 3000, color: '#3AD8FF' },
        { name: 'Government', value: 1500, color: '#FF6B6B' }
      ],
      totalCancellations: '1,460'
    };
  };

  const { chartData, totalCancellations } = getChartData();

  // Calculate filtered total including external filters
  const filteredTotalCancellations = useMemo(() => {
    const hasExternalFilters = (contractFilter && contractFilter !== 'All') || 
                              (clientFilter && clientFilter !== 'All');
    const hasChartFilter = chartFilter !== 'All';
    
    if (!hasExternalFilters && !hasChartFilter) {
      return totalCancellations;
    }
    return chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString();
  }, [chartData, totalCancellations, chartFilter, contractFilter, clientFilter]);

  const hasActiveGlobalFilters = externalFilters
    ? false
    : globalFilters.selectedYear !== 'All' ||
      globalFilters.client ||
      globalFilters.contractType ||
      globalFilters.date;

  return (
    <div className='space-y-4'>
      {/* Global Filters */}
      {showGlobalFilters && !externalFilters && (
        <div className='bg-muted/50 rounded-lg border p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            {/* Year Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Year</label>
              <Select
                value={globalFilters.selectedYear}
                onValueChange={(value) =>
                  handleGlobalFilterChange('selectedYear', value)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select year' />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Client</label>
              <Select
                value={globalFilters.client}
                onValueChange={(value) =>
                  handleGlobalFilterChange('client', value)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select client' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Clients</SelectItem>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.company}>
                      {client.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contract Type Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Contract Type</label>
              <Select
                value={globalFilters.contractType}
                onValueChange={(value) =>
                  handleGlobalFilterChange('contractType', value)
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=''>All Types</SelectItem>
                  <SelectItem value='fixed'>Fixed Price</SelectItem>
                  <SelectItem value='hourly'>Hourly</SelectItem>
                  <SelectItem value='retainer'>Retainer</SelectItem>
                  <SelectItem value='milestone'>Milestone-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !globalFilters.date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {globalFilters.date
                      ? format(globalFilters.date, 'PPP')
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={globalFilters.date || undefined}
                    onSelect={(date) => handleGlobalFilterChange('date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Chart with Filter */}
      <div className='relative'>
        <div className='absolute top-4 right-4 z-10'>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
              <Filter className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {serviceStreamFilters.map((filter) => (
                <DropdownMenuItem
                  key={filter}
                  onClick={() => handleChartFilterChange(filter)}
                  className={chartFilter === filter ? 'bg-accent' : ''}
                >
                  {filter}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <DonutChartCard
          title='Cancellations by Service Stream'
          total={filteredTotalCancellations}
          data={chartData}
        />
      </div>
    </div>
  );
}