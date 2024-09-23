import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API;

export const fetchCoordinates = createAsyncThunk(
  'forecast/fetchCoordinates',
  async (location) => {
    const encodedLocation = encodeURIComponent(location); // Encode the location
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${encodedLocation}&limit=1&appid=${API_KEY}`);

    if (response.data.length === 0) {
      throw new Error('Location not found');
    }

    const data = response.data[0]; // Assuming the first result is the correct location
    return {
      lat: data.lat,
      lon: data.lon,
    };
  }
);

export const fetchForecastByLocation = createAsyncThunk(
  'forecast/fetchForecastByLocation',
  async ({ lat, lon }) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    return response.data;
  }
);

const forecastSlice = createSlice({
  name: 'forecast',
  initialState: {
    forecast: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchForecastByLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchForecastByLocation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.forecast = action.payload;
      })
      .addCase(fetchForecastByLocation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default forecastSlice.reducer;
