// store/slices/filterSlice.ts
import { FilterState } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FilterState = {
    selectedYear: '',
    date: null,
    client: '',
    contractType: '',
    showFilters: false
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setSelectedYear: (state, action: PayloadAction<string>) => {
            state.selectedYear = action.payload;
        },
        setDateFilter: (state, action: PayloadAction<Date | null>) => {
            state.date = action.payload;
        },
        setClientFilter: (state, action: PayloadAction<string>) => {
            state.client = action.payload;
        },
        setContractTypeFilter: (state, action: PayloadAction<string>) => {
            state.contractType = action.payload;
        },
        setShowFilters: (state, action: PayloadAction<boolean>) => {
            state.showFilters = action.payload;
        },
        clearAllFilters: (state) => {
            state.selectedYear = '';
            state.date = null;
            state.client = '';
            state.contractType = '';
        }, updateStatsWithFilters: (state, action: PayloadAction<FilterState>) => {
            return { ...state, ...action.payload };
        }
    }
});

export const {
    setSelectedYear,
    setDateFilter,
    setClientFilter,
    setContractTypeFilter,
    setShowFilters,
    clearAllFilters,
    updateStatsWithFilters
} = filterSlice.actions;

export default filterSlice.reducer;