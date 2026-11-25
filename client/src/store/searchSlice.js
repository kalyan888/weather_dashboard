import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API;

export const fetchCoordinatesAndWeather = createAsyncThunk(
  'search/fetchCoordinatesAndWeather',
  async ({ location, coords }, { rejectWithValue }) => {
    try {
      const query = coords || { q: location.trim() };
      const params = { ...query, units: 'metric', appid: API_KEY };
      const { data: weather } = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
      const { lat, lon } = weather.coord;
      const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
        params: { lat, lon, units: 'metric', appid: API_KEY }
      });
      const country = weather.sys?.country;
      const countryName = /^[A-Z]{2}$/.test(country) && Intl.DisplayNames
        ? new Intl.DisplayNames(['en'], { type: 'region' }).of(country)
        : country;

      return {
        weather,
        forecast: forecastResponse.data,
        location: weather.name,
        country: countryName,
        coords: { lat, lon }
      };
    } catch (error) {
      // Destructure `cod` and `message` from the error response if available
      const { cod, message } = error.response?.data || {};

      // Handle different error codes and types
      if (String(cod) === '404') {
        return rejectWithValue('Location not found. Please check the location name.');
      } else if (String(cod) === '401') {
        return rejectWithValue('Invalid API key. Please check your OpenWeather API key.');
      } else if (String(cod) === '429') {
        return rejectWithValue('Too many requests. You have exceeded the API call limit.');
      } else if (error.response) {
        // Handle other specific error messages if available
        return rejectWithValue(message || 'An unknown error occurred with the weather service.');
      } else if (error.request) {
        // Network-related error
        return rejectWithValue('Network error. Please check your internet connection.');
      } else {
        // Any other type of error (e.g., client-side issues)
        return rejectWithValue(error.message || 'An unexpected error occurred.');
      }
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    location: '',
    coords: null,
    weather: null,
    forecast: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setCoords: (state, action) => {
      state.coords = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoordinatesAndWeather.pending, (state, action) => {
        state.status = 'loading';
        state.requestId = action.meta.requestId;
        state.error = null;
      })
      .addCase(fetchCoordinatesAndWeather.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'succeeded';
        state.weather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.location = action.payload.location;
        state.country = action.payload.country;
        state.coords = action.payload.coords;
      })
      .addCase(fetchCoordinatesAndWeather.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) return;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setLocation, setCoords } = searchSlice.actions;

export default searchSlice.reducer;
