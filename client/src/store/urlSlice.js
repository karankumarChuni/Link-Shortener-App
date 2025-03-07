import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  urls: [],
  loading: false,
  error: null,
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setUrls: (state, action) => {
      state.urls = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUrls, setLoading, setError } = urlSlice.actions;
export default urlSlice.reducer;