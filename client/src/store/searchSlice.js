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
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${coords.lat}&lon=${coords.lon}&limit=1&appid=${API_KEY}`);
        if (response.data.length === 0) {
          return rejectWithValue('Coordinates not found');
        }
        const data = response.data[0];
        lat = data.lat;
        lon = data.lon;
        locationName = data.name;
      } else {
        const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`);
        if (response.data.length === 0) {
          return rejectWithValue('Location not found');
        }
        const data = response.data[0];
        lat = data.lat;
        lon = data.lon;
        locationName = data.name;
      }

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      // console.log('1111111111111111111111', weatherResponse);
      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      // console.log('forecastResponse: ', forecastResponse);
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
      return rejectWithValue(error.response ? error.response.data : error.message);
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
