// components/dashboard/donot-stats.tsx
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

interface ContractDashboardProps {
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
  contractFilter: string;
  clientFilter: string;
}

// Mock clients data
const mockClients = [
  { id: '1', company: 'TechCorp Inc.' },
  { id: '2', company: 'Innovate Labs' },
  { id: '3', company: 'Global Solutions' }
];

// Filter options for each chart
const contractTypeFilters = [
  'All',
  'Custom',
  'FFS',
  'Vendor Contract',
  'Retainer'
];
const serviceStreamFilters = [
  'All',
  'Coaching Session',
  'Meditation',
  'Psychometric Testing',
  'Webinar',
  'Workshop'
];
const regionFilters = ['All', 'Asia Pacific', 'Americas', 'EU', 'AU / NZ'];

// Year options
const yearOptions = ['All', '2025', '2024', '2023'];

export default function ContractDashboard({
  statsData,
  filters: externalFilters,
  contractFilter,
  clientFilter
}: ContractDashboardProps) {
  console.log('📊 ContractDashboard received statsData:', statsData);
  console.log('📊 ContractDashboard received contractFilter:', contractFilter);
  console.log('📊 ContractDashboard received clientFilter:', clientFilter);

  // State for global filters
  const [internalFilters, setInternalFilters] = useState({
    selectedYear: 'All',
    client: '',
    contractType: '',
    date: null as Date | null
  });

  // State for individual chart filters
  const [chartFilters, setChartFilters] = useState({
    contractType: 'All',
    serviceStream: 'All',
    region: 'All'
  });

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

  const handleChartFilterChange = (
    chartType: keyof typeof chartFilters,
    value: string
  ) => {
    setChartFilters((prev) => ({
      ...prev,
      [chartType]: value
    }));
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
    setChartFilters({
      contractType: 'All',
      serviceStream: 'All',
      region: 'All'
    });
  };

  // Filter data based on individual chart filters
  const filterChartData = (data: any[], filter: string) => {
    if (filter === 'All') return data;
    return data.filter((item) => item.name === filter);
  };

  // Apply contractFilter to data
  const applyContractFilter = (data: any[]) => {
    if (!contractFilter || contractFilter === 'All') return data;
    return data.filter((item) => item.name === contractFilter);
  };

  // Apply clientFilter to data
  const applyClientFilter = (data: any[]) => {
    if (!clientFilter || clientFilter === 'All') return data;
    
    const clientMultipliers = {
      'TechCorp Inc.': 0.8,  // Enterprise client - larger contracts
      'Innovate Labs': 0.6,  // Medium business
      'Global Solutions': 0.4 // Smaller business
    };
    
    const multiplier = clientMultipliers[clientFilter as keyof typeof clientMultipliers] || 1;
    
    return data.map(item => ({
      ...item,
      value: Math.round(item.value * multiplier)
    }));
  };

  // Get combined filter data for appointments and regions
  const getCombinedFilterData = () => {
    // Base multipliers for different contract types
    const contractAppointmentMultipliers = {
      'Custom': 1.2,        // Custom contracts have more appointments
      'FFS': 0.8,          // FFS has fewer appointments
      'VendorContract': 1.0, // Standard appointments
      'Retainer': 1.5       // Retainers have the most appointments
    };

    const contractRegionMultipliers = {
      'Custom': { 'Asia Pacific': 1.3, 'Americas': 1.1, 'EU': 0.9, 'AU / NZ': 0.7 },
      'FFS': { 'Asia Pacific': 0.8, 'Americas': 1.2, 'EU': 0.9, 'AU / NZ': 1.1 },
      'VendorContract': { 'Asia Pacific': 1.1, 'Americas': 0.9, 'EU': 1.2, 'AU / NZ': 0.8 },
      'Retainer': { 'Asia Pacific': 0.9, 'Americas': 1.3, 'EU': 1.1, 'AU / NZ': 0.7 }
    };

    const clientAppointmentMultipliers = {
      'TechCorp Inc.': 1.1,  // Enterprise uses more services
      'Innovate Labs': 1.0,  // Standard usage
      'Global Solutions': 0.9 // Smaller usage
    };

    const clientRegionMultipliers = {
      'TechCorp Inc.': { 'Asia Pacific': 1.4, 'Americas': 1.2, 'EU': 0.8, 'AU / NZ': 0.6 },
      'Innovate Labs': { 'Asia Pacific': 1.0, 'Americas': 1.1, 'EU': 0.9, 'AU / NZ': 1.0 },
      'Global Solutions': { 'Asia Pacific': 0.8, 'Americas': 1.0, 'EU': 1.2, 'AU / NZ': 1.0 }
    };

    return {
      contractAppointmentMultipliers,
      contractRegionMultipliers,
      clientAppointmentMultipliers,
      clientRegionMultipliers
    };
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
        chartData1: [
          { name: 'Custom', value: 4000, color: '#8FD7B3' },
          { name: 'FFS', value: 1000, color: '#F9C87A' },
          { name: 'VendorContract', value: 3000, color: '#3AD8FF' },
          { name: 'Retainer', value: 2000, color: '#8FA2FF' }
        ],
        chartData2: [
          { name: 'Coaching Session', value: 4667, color: '#f0d657ff' },
          { name: 'Meditation', value: 2000, color: '#a0fbd0ff' },
          { name: 'Psychometric Testing', value: 2000, color: '#E57373' },
          { name: 'Webinar', value: 2000, color: '#8FA2FF' },
          { name: 'Workshop', value: 3000, color: '#3AD8FF' },
        ],
        chartData3: [
          { name: 'Asia Pacific', value: 7000, color: '#f0d657ff' },
          { name: 'Americas', value: 3000, color: '#a0fbd0ff' },
          { name: 'EU', value: 3000, color: '#E57373' },
          { name: 'AU / NZ', value: 3000, color: '#3AD8FF' }
        ],
        totalContracts: '200',
        totalAppointments: '8,540',
        totalRegion: '16,000'
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
          chartData1: [
            { name: 'Custom', value: 4500, color: '#8FD7B3' },
            { name: 'FFS', value: 1200, color: '#F9C87A' },
            { name: 'VendorContract', value: 3500, color: '#3AD8FF' },
            { name: 'Retainer', value: 2300, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 4267, color: '#f0d657ff' },
            { name: 'Meditation', value: 2800, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 1833, color: '#E57373' },
            { name: 'Webinar', value: 2000, color: '#8FA2FF' },
            { name: 'Workshop', value: 3000, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 3800, color: '#f0d657ff' },
            { name: 'Americas', value: 2500, color: '#a0fbd0ff' },
            { name: 'EU', value: 1800, color: '#E57373' },
            { name: 'AU / NZ', value: 1200, color: '#3AD8FF' }
          ],
          totalContracts: '210',
          totalAppointments: '8,900',
          totalRegion: '9,300'
        },
        '2024': {
          chartData1: [
            { name: 'Custom', value: 3800, color: '#8FD7B3' },
            { name: 'FFS', value: 900, color: '#F9C87A' },
            { name: 'VendorContract', value: 2800, color: '#3AD8FF' },
            { name: 'Retainer', value: 1800, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 3733, color: '#f0d657ff' },
            { name: 'Meditation', value: 2400, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 1667, color: '#E57373' },
            { name: 'Webinar', value: 2000, color: '#8FA2FF' },
            { name: 'Workshop', value: 3000, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 3200, color: '#f0d657ff' },
            { name: 'Americas', value: 2200, color: '#a0fbd0ff' },
            { name: 'EU', value: 1600, color: '#E57373' },
            { name: 'AU / NZ', value: 1000, color: '#3AD8FF' }
          ],
          totalContracts: '185',
          totalAppointments: '7,800',
          totalRegion: '8,000'
        },
        '2023': {
          chartData1: [
            { name: 'Custom', value: 3500, color: '#8FD7B3' },
            { name: 'FFS', value: 800, color: '#F9C87A' },
            { name: 'VendorContract', value: 2500, color: '#3AD8FF' },
            { name: 'Retainer', value: 1500, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 3333, color: '#f0d657ff' },
            { name: 'Meditation', value: 2200, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 1667, color: '#E57373' },
            { name: 'Webinar', value: 2000, color: '#8FA2FF' },
            { name: 'Workshop', value: 3000, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 2900, color: '#f0d657ff' },
            { name: 'Americas', value: 2000, color: '#a0fbd0ff' },
            { name: 'EU', value: 1500, color: '#E57373' },
            { name: 'AU / NZ', value: 900, color: '#3AD8FF' }
          ],
          totalContracts: '170',
          totalAppointments: '7,200',
          totalRegion: '7,300'
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
          chartData1: [
            { name: 'Custom', value: 1800, color: '#8FD7B3' },
            { name: 'FFS', value: 400, color: '#F9C87A' },
            { name: 'VendorContract', value: 1200, color: '#3AD8FF' },
            { name: 'Retainer', value: 900, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 1667, color: '#f0d657ff' },
            { name: 'Meditation', value: 800, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 733, color: '#E57373' },
            { name: 'Webinar', value: 800, color: '#8FA2FF' },
            { name: 'Workshop', value: 1200, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 2000, color: '#f0d657ff' },
            { name: 'Americas', value: 1500, color: '#a0fbd0ff' },
            { name: 'EU', value: 800, color: '#E57373' },
            { name: 'AU / NZ', value: 700, color: '#3AD8FF' }
          ],
          totalContracts: '45',
          totalAppointments: '3,200',
          totalRegion: '5,000'
        },
        'Innovate Labs': {
          chartData1: [
            { name: 'Custom', value: 1500, color: '#8FD7B3' },
            { name: 'FFS', value: 300, color: '#F9C87A' },
            { name: 'VendorContract', value: 1000, color: '#3AD8FF' },
            { name: 'Retainer', value: 700, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 1333, color: '#f0d657ff' },
            { name: 'Meditation', value: 600, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 567, color: '#E57373' },
            { name: 'Webinar', value: 600, color: '#8FA2FF' },
            { name: 'Workshop', value: 900, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 1500, color: '#f0d657ff' },
            { name: 'Americas', value: 1200, color: '#a0fbd0ff' },
            { name: 'EU', value: 600, color: '#E57373' },
            { name: 'AU / NZ', value: 500, color: '#3AD8FF' }
          ],
          totalContracts: '38',
          totalAppointments: '2,500',
          totalRegion: '3,800'
        },
        'Global Solutions': {
          chartData1: [
            { name: 'Custom', value: 1200, color: '#8FD7B3' },
            { name: 'FFS', value: 250, color: '#F9C87A' },
            { name: 'VendorContract', value: 800, color: '#3AD8FF' },
            { name: 'Retainer', value: 500, color: '#8FA2FF' }
          ],
          chartData2: [
            { name: 'Coaching Session', value: 1000, color: '#f0d657ff' },
            { name: 'Meditation', value: 500, color: '#a0fbd0ff' },
            { name: 'Psychometric Testing', value: 500, color: '#E57373' },
            { name: 'Webinar', value: 400, color: '#8FA2FF' },
            { name: 'Workshop', value: 600, color: '#3AD8FF' },
          ],
          chartData3: [
            { name: 'Asia Pacific', value: 1200, color: '#f0d657ff' },
            { name: 'Americas', value: 900, color: '#a0fbd0ff' },
            { name: 'EU', value: 500, color: '#E57373' },
            { name: 'AU / NZ', value: 400, color: '#3AD8FF' }
          ],
          totalContracts: '32',
          totalAppointments: '2,000',
          totalRegion: '3,000'
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

    // Apply external filters (contractFilter and clientFilter) to ALL charts
    let filteredData = { ...baseData };
    
    const multipliers = getCombinedFilterData();
    
    // Apply contractFilter to all chart data
    if (contractFilter && contractFilter !== 'All') {
      filteredData.chartData1 = applyContractFilter(filteredData.chartData1);
      
      // Apply contract-specific multipliers to appointments
      const appointmentMultiplier = multipliers.contractAppointmentMultipliers[contractFilter as keyof typeof multipliers.contractAppointmentMultipliers] || 1;
      filteredData.chartData2 = filteredData.chartData2.map(item => ({
        ...item,
        value: Math.round(item.value * appointmentMultiplier)
      }));
      
      // Apply contract-specific multipliers to regions
      const regionMultipliers = multipliers.contractRegionMultipliers[contractFilter as keyof typeof multipliers.contractRegionMultipliers];
      if (regionMultipliers) {
        filteredData.chartData3 = filteredData.chartData3.map(item => ({
          ...item,
          value: Math.round(item.value * (regionMultipliers[item.name as keyof typeof regionMultipliers] || 1))
        }));
      }
    }
    
    // Apply clientFilter to all chart data
    if (clientFilter && clientFilter !== 'All') {
      filteredData.chartData1 = applyClientFilter(filteredData.chartData1);
      
      // Apply client-specific multipliers to appointments
      const clientAppointmentMultiplier = multipliers.clientAppointmentMultipliers[clientFilter as keyof typeof multipliers.clientAppointmentMultipliers] || 1;
      filteredData.chartData2 = filteredData.chartData2.map(item => ({
        ...item,
        value: Math.round(item.value * clientAppointmentMultiplier)
      }));
      
      // Apply client-specific multipliers to regions
      const clientRegionMultipliers = multipliers.clientRegionMultipliers[clientFilter as keyof typeof multipliers.clientRegionMultipliers];
      if (clientRegionMultipliers) {
        filteredData.chartData3 = filteredData.chartData3.map(item => ({
          ...item,
          value: Math.round(item.value * (clientRegionMultipliers[item.name as keyof typeof clientRegionMultipliers] || 1))
        }));
      }
    }

    // Apply individual chart filters on top of external filters
    return {
      ...filteredData,
      chartData1: filterChartData(
        filteredData.chartData1, 
        chartFilters.contractType
      ),
      chartData2: filterChartData(
        filteredData.chartData2, 
        chartFilters.serviceStream
      ),
      chartData3: filterChartData(
        filteredData.chartData3, 
        chartFilters.region
      )
    };
  };

  const getDefaultData = () => {
    return {
      chartData1: [
        { name: 'Custom', value: 4000, color: '#8FD7B3' },
        { name: 'FFS', value: 1000, color: '#F9C87A' },
        { name: 'VendorContract', value: 3000, color: '#3AD8FF' },
        { name: 'Retainer', value: 2000, color: '#8FA2FF' }
      ],
      chartData2: [
        { name: 'Coaching Session', value: 4667, color: '#f0d657ff' },
        { name: 'Meditation', value: 2000, color: '#a0fbd0ff' },
        { name: 'Psychometric Testing', value: 2000, color: '#E57373' },
        { name: 'Webinar', value: 2000, color: '#8FA2FF' },
        { name: 'Workshop', value: 3000, color: '#3AD8FF' },
      ],
      chartData3: [
        { name: 'Asia Pacific', value: 7000, color: '#f0d657ff' },
        { name: 'Americas', value: 3000, color: '#a0fbd0ff' },
        { name: 'EU', value: 3000, color: '#E57373' },
        { name: 'AU / NZ', value: 3000, color: '#3AD8FF' }
      ],
      totalContracts: '200',
      totalAppointments: '8,540',
      totalRegion: '16,000'
    };
  };

  const {
    chartData1,
    chartData2,
    chartData3,
    totalContracts,
    totalAppointments,
    totalRegion
  } = getChartData();

  // Calculate filtered totals - now including both contractFilter and clientFilter
  const filteredTotalContracts = useMemo(() => {
    const hasExternalFilters = (contractFilter && contractFilter !== 'All') || 
                              (clientFilter && clientFilter !== 'All');
    const hasChartFilter = chartFilters.contractType !== 'All';
    
    if (!hasExternalFilters && !hasChartFilter) {
      return totalContracts;
    }
    return chartData1.reduce((sum, item) => sum + item.value, 0).toLocaleString();
  }, [chartData1, totalContracts, chartFilters.contractType, contractFilter, clientFilter]);

  const filteredTotalAppointments = useMemo(() => {
    const hasExternalFilters = (contractFilter && contractFilter !== 'All') || 
                              (clientFilter && clientFilter !== 'All');
    const hasChartFilter = chartFilters.serviceStream !== 'All';
    
    if (!hasExternalFilters && !hasChartFilter) {
      return totalAppointments;
    }
    return chartData2.reduce((sum, item) => sum + item.value, 0).toLocaleString();
  }, [chartData2, totalAppointments, chartFilters.serviceStream, contractFilter, clientFilter]);

  const filteredTotalRegion = useMemo(() => {
    const hasExternalFilters = (contractFilter && contractFilter !== 'All') || 
                              (clientFilter && clientFilter !== 'All');
    const hasChartFilter = chartFilters.region !== 'All';
    
    if (!hasExternalFilters && !hasChartFilter) {
      return totalRegion;
    }
    return chartData3.reduce((sum, item) => sum + item.value, 0).toLocaleString();
  }, [chartData3, totalRegion, chartFilters.region, contractFilter, clientFilter]);

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

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3'>
        {/* Contract Type Chart with Filter */}
        <div className='relative'>
          <div className='absolute top-4 right-4 z-10'>
          </div>
          <DonutChartCard
            title='Contract Type'
            total={filteredTotalContracts}
            data={chartData1}
          />
        </div>

        {/* Service Stream Chart with Filter */}
        <div className='relative'>
          <div className='absolute top-4 right-4 z-10'>
          </div>
          <DonutChartCard
            title='Appointments by Service Stream'
            total={filteredTotalAppointments}
            data={chartData2}
          />
        </div>

        {/* Region Chart with Filter */}
        <div className='relative'>
          <div className='absolute top-4 right-4 z-10'>
          </div>
          <DonutChartCard
            title='Appointments by Region'
            total={filteredTotalRegion}
            data={chartData3}
          />
        </div>
      </div>
    </div>
  );
}