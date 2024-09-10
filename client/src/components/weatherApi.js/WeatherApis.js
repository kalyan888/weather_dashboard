
import axios from 'axios';

const API_KEY = '49831a74458a2bd23c56452ba0af338e'; // Replace with your OpenWeatherMap API key
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';

export const fetchWeather = async (lat, lon) => {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat,
        lon,
        units: 'metric',
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export const fetchCoordinates = async (location) => {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        q: location,
        limit: 1,
        appid: API_KEY
      }
    });
    return response.data[0];
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};
