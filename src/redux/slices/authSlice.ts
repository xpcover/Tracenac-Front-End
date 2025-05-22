import { User } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!(Cookies.get('token')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    removeUserInfo: (state) => {
      state.user = null;
      Cookies.remove('token');
      state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo,removeUserInfo} = authSlice.actions;
export default authSlice.reducer;