import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API;

export const fetchWeatherByLocation = createAsyncThunk(
  'home/fetchWeatherByLocation',
  async (location) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
    console.log('home weather', response);
    return response.data;
  }
);

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    weather: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherByLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherByLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.weather = action.payload;
      })
      .addCase(fetchWeatherByLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default homeSlice.reducer;
