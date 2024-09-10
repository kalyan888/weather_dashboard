import { createSlice } from '@reduxjs/toolkit';

const initialThemeSeasonState = {
  mode: 'seasonal',
  // mode: 'theme',
  theme: true, // Initial theme - Dark
  appliedTheme: ''
};

const themeSeasonSlice = createSlice({
  name: 'themeSeason',
  initialState: initialThemeSeasonState,
  reducers: {
    toggleMode(state) {
      state.mode = 'theme';
    },
    toggleSeason(state) {
      state.mode = 'seasonal';
    },
    toggleTheme(state) {
      state.theme = !state.theme;
    },
    setAppliedTheme(state, action) {
      state.appliedTheme = action.payload;
    },
  }
});

export const { toggleMode, toggleSeason, toggleTheme, setAppliedTheme } = themeSeasonSlice.actions;

export default themeSeasonSlice.reducer;
