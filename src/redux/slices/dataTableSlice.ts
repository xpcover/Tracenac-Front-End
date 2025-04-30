import { createSlice } from '@reduxjs/toolkit'

interface itemType {
  id: number
}

export interface tableState {
  loading: boolean,
  data: itemType[],
  pagination: object
}

const initialState: tableState = {
  loading: false,  
  data: [],
  pagination: {}
}


export const dataTableSlice = createSlice({
  name: 'dataTable',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    setTableData: (state, action) => { state.data = action.payload },
    setPagination: (state, action) => { state.pagination = action.payload },
    clearData: (state) => { state.data = [] },
    createData: (state, action) => { state.data.push(action.payload) },
    updateData: (state, action) => { state.data = state.data.map((item) => item.id === action.payload.id ? action.payload : item) },
    deleteData: (state, action) => { state.data = state.data.filter((item) => item.id !== action.payload) },
  },
})

export const { setLoading, setTableData, setPagination, clearData, createData, updateData, deleteData } = dataTableSlice.actions

export default dataTableSlice.reducer