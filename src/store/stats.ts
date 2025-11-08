// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import statsReducer from './slices/statsSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;