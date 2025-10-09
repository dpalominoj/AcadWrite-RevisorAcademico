import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  currentUser: {
    _id: string;
    username: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  currentUser: null,
  token: localStorage.getItem('access_token') || null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.currentUser = { ...user }; // Ensure immutability by creating a new object
      state.token = token;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('access_token', token);
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('access_token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
