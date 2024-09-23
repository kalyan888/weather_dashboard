import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API;

export const fetchCoordinatesAndWeather = createAsyncThunk(
  'search/fetchCoordinatesAndWeather',
  async ({ location, coords }, { rejectWithValue }) => {
    try {
      let lat, lon;
      let locationName = location;

      if (coords) {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&limit=1&appid=${API_KEY}`);

        if (!response.data || Object.keys(response.data).length === 0) {
          return rejectWithValue('Coordinates not found');
        }
        const data = response.data;
        lat = data?.coord?.lat;
        lon = data?.coord?.lon;
        locationName = data.name;
      } else {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);

        if (!response.data || Object.keys(response.data).length === 0) {
          return rejectWithValue('Location not found');
        }
        const data = response.data;
        lat = data?.coord?.lat;
        lon = data?.coord?.lon;
        locationName = data.name;
      }

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      const country = weatherResponse.data.sys.country;

      const countryResponse = await axios.get(`https://restcountries.com/v3.1/alpha/${country}`);
      const countryName = countryResponse.data[0].name.common;

      return {
        weather: weatherResponse.data,
        forecast: forecastResponse.data,
        location: locationName,
        country: countryName,
        coords: { lat, lon }
      };
    } catch (error) {
      // Destructure `cod` and `message` from the error response if available
      const { cod, message } = error.response?.data || {};

      // Handle different error codes and types
      if (cod === '404') {
        return rejectWithValue('Location not found. Please check the location name.');
      } else if (cod === '401') {
        return rejectWithValue('Invalid API key. Please check your OpenWeather API key.');
      } else if (cod === '429') {
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
      .addCase(fetchCoordinatesAndWeather.pending, (state) => {
        state.status = 'loading';
        state.weather = null;
        state.forecast = null;
        state.error = null;
      })
      .addCase(fetchCoordinatesAndWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.weather = action.payload.weather;
        state.forecast = action.payload.forecast;
        state.location = action.payload.location;
        state.country = action.payload.country;
        state.coords = action.payload.coords;
      })
      .addCase(fetchCoordinatesAndWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setLocation, setCoords } = searchSlice.actions;

export default searchSlice.reducer;














// For precise location - not matching with openweathermap api
// const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`); - 29
// const data = response.data[0]; - 34
// lat = data.lat;
// lon = data.lon;
// locationName = data.name;

// const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lon}&limit=1&appid=${API_KEY}`);
// const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`);