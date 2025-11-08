// store/slices/statsSlice.ts
import { FilterState, StatsData, StatsState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Mock data that represents your actual stats
const initialStatsData: StatsData = {
  appointments: 10000,
  totalCompleted: 8540,
  totalCancelled: 1460,
  chargedCancellations: 1009,
  totalVendors: 58,
  totalClients: 200,
  totalExpenditure: 468456,
  revenue: 662243,
  previousRevenue: 501641.73,
  revenueChange: '+2.8%'
};

// Filter logic based on applied filters
const filterStatsData = (filters: FilterState): StatsData => {
  console.log('🔍 Applying filters:', filters);
  
  let filteredData = { ...initialStatsData };

  // Apply year filter
  if (filters.selectedYear) {
    const yearMultiplier = parseInt(filters.selectedYear) / 2025; // Adjust based on your base year
    console.log('📅 Year multiplier:', yearMultiplier);
    
    filteredData = {
      ...filteredData,
      appointments: Math.round(filteredData.appointments * yearMultiplier),
      totalCompleted: Math.round(filteredData.totalCompleted * yearMultiplier),
      totalCancelled: Math.round(filteredData.totalCancelled * yearMultiplier),
      chargedCancellations: Math.round(filteredData.chargedCancellations * yearMultiplier),
      revenue: Math.round(filteredData.revenue * yearMultiplier),
      totalExpenditure: Math.round(filteredData.totalExpenditure * yearMultiplier)
    };
  }

  // Apply client filter
  if (filters.client) {
    // Reduce stats when specific client is selected
    const clientMultiplier = 0.3; // Show 30% of data for single client
    console.log('👤 Client multiplier:', clientMultiplier);
    
    filteredData = {
      ...filteredData,
      appointments: Math.round(filteredData.appointments * clientMultiplier),
      totalCompleted: Math.round(filteredData.totalCompleted * clientMultiplier),
      totalCancelled: Math.round(filteredData.totalCancelled * clientMultiplier),
      chargedCancellations: Math.round(filteredData.chargedCancellations * clientMultiplier),
      revenue: Math.round(filteredData.revenue * clientMultiplier),
      totalExpenditure: Math.round(filteredData.totalExpenditure * clientMultiplier)
    };
  }

  // Apply contract type filter
  if (filters.contractType) {
    // Adjust based on contract type
    const contractMultipliers: Record<string, number> = {
      'fixed': 0.4,
      'hourly': 0.3,
      'retainer': 0.2,
      'milestone': 0.1
    };
    const multiplier = contractMultipliers[filters.contractType] || 1;
    console.log('📝 Contract multiplier:', multiplier);
    
    filteredData = {
      ...filteredData,
      appointments: Math.round(filteredData.appointments * multiplier),
      totalCompleted: Math.round(filteredData.totalCompleted * multiplier),
      totalCancelled: Math.round(filteredData.totalCancelled * multiplier),
      chargedCancellations: Math.round(filteredData.chargedCancellations * multiplier),
      revenue: Math.round(filteredData.revenue * multiplier),
      totalExpenditure: Math.round(filteredData.totalExpenditure * multiplier)
    };
  }

  // Apply date filter
  if (filters.date) {
    // Simple date-based adjustment
    const dateMultiplier = 0.5; // Show 50% for specific date
    console.log('📅 Date multiplier:', dateMultiplier);
    
    filteredData = {
      ...filteredData,
      appointments: Math.round(filteredData.appointments * dateMultiplier),
      totalCompleted: Math.round(filteredData.totalCompleted * dateMultiplier),
      totalCancelled: Math.round(filteredData.totalCancelled * dateMultiplier),
      chargedCancellations: Math.round(filteredData.chargedCancellations * dateMultiplier),
      revenue: Math.round(filteredData.revenue * dateMultiplier),
      totalExpenditure: Math.round(filteredData.totalExpenditure * dateMultiplier)
    };
  }

  console.log('📊 Filtered data result:', filteredData);
  return filteredData;
};

const initialState: StatsState = {
  data: initialStatsData,
  loading: false
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setStatsData: (state, action: PayloadAction<StatsData>) => {
      console.log('🔄 Setting stats data:', action.payload);
      state.data = action.payload;
    },
    updateStatsWithFilters: (state, action: PayloadAction<FilterState>) => {
      console.log('🎯 Updating stats with filters:', action.payload);
      const filteredData = filterStatsData(action.payload);
      state.data = filteredData;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Add a reset action for testing
    resetStats: (state) => {
      console.log('🔄 Resetting to initial stats');
      state.data = initialStatsData;
    }
  }
});

export const { setStatsData, updateStatsWithFilters, setLoading, resetStats } = statsSlice.actions;
export default statsSlice.reducer;