import { configureStore } from '@reduxjs/toolkit';
import themeSeasonSlice from './themeSlice';
import seasonReducer from './seasonalSlice';
import homeReducer from './homeSlice';
import forecastReducer from './forecastSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    themesSlice: themeSeasonSlice,
    seasonsSlice: seasonReducer,
    home: homeReducer,
    forecast: forecastReducer,
    search: searchReducer,
  },
});
