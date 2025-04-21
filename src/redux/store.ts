import { configureStore } from '@reduxjs/toolkit'
import { dataTableSlice } from './slices/dataTableSlice'

export const store = configureStore({
  reducer: {
    dataTable : dataTableSlice.reducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch