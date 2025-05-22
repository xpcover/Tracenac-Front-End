import { configureStore } from '@reduxjs/toolkit';
import dataTableReducer from './slices/dataTableSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dataTable: dataTableReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ['payload.timestamp', 'payload.error'],
        ignoredPaths: ['auth.error', 'dataTable.error'],
      },
    }),
});

// Infer the RootState and AppDispatch types from the store itself
export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;