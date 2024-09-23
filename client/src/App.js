import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from 'react-router-dom';
import "./App.css";
import About from "./components/about/About";
import { routingPaths } from "./components/customs/constants";
import Forecast from './components/forecast/Forecast';
import Home from "./components/home/Home";
import NavBar from './components/navBar/NavBar';
import OfflinePage from "./components/offlinePage/OfflinePage";
import PersonalStory from './components/personalStories/PersonalStories';
import { setAppliedTheme, toggleMode } from "./store/themeSlice";

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { mode, theme } = useSelector((state) => state.themesSlice);
  const weather = useSelector((state) => state?.search?.weather);

  const [isOnline, setIsOnline] = useState(true);

  const [isCogOpen, setIsCogOpen] = useState(false);

  // Alert Popup
  const [error, setError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [timer, setTimer] = useState(null);

  const progressBarClear = () => {
    // Clear any existing timer
    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      setError('');
      setShowProgressBar(false);
    }, 3000);

    setTimer(newTimer);
  };

  const handleCloseAlert = () => {
    setError('');
    setShowProgressBar(false);
    if (timer) {
      clearTimeout(timer); // Clear timer if popup is closed
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.modes-container') || event.target.closest('.light-mode-icon')) {
        // Clicked inside the modes-container or on the cog icon
        return;
      }
      // Clicked outside the modes-container and cog icon, close it
      setIsCogOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle initial theme setting
  useEffect(() => {
    const lightMode = window.matchMedia("(prefers-color-scheme: light)");

    if (sessionStorage.getItem("Theme") === null) {
      sessionStorage.setItem("Theme", lightMode.matches ? 'light' : 'dark');
    }

    const setTheme = (e) => {
      sessionStorage.setItem("Theme", e.matches ? 'light' : 'dark');
      dispatch(toggleMode(e.matches));
    };

    lightMode.addEventListener("change", setTheme);

    return () => {
      lightMode.removeEventListener("change", setTheme);
    };
  }, [dispatch]);

  // Determine seasonal theme based on weather

  // Feed the temp to get season
  const classifyWeatherByTemperature = () => {
    if (weather?.weather?.[0]?.description.includes('sun', 'sky')) {
      return 'summer-theme';
    } else if (weather?.weather?.[0]?.description.includes('cloud')) {
      // return 'cloudy-theme';
      return 'rainy-theme';
    } else if (weather?.weather?.[0]?.description.includes('rain', 'storm', 'drizzle')) {
      return 'rainy-theme';
    } else if (weather?.weather?.[0]?.description.includes('snow', 'mist', 'sleet', 'smoke', 'haze', 'fog')) {
      return 'winter-theme';
    } else {
      return 'summer-theme';
    }
  };

  // Determine theme based on mode and theme state
  const getAppTheme = () => {
    if (mode === 'theme') {
      let retTheme = theme ? 'dark-mode' : 'light-mode'
      dispatch(setAppliedTheme(retTheme));
      return retTheme;
    } else if (mode === 'seasonal') {
      const seasonalTheme = classifyWeatherByTemperature(Math.round(weather?.main?.temp));
      dispatch(setAppliedTheme(seasonalTheme));
      return seasonalTheme;
    }
    return '';
  };

  return (
    <div className={`app ${getAppTheme()}`}>
      {!isOnline ? (
        <OfflinePage setIsOnline={setIsOnline} />
      ) : (
        <div className="d-flex">
          {location.pathname !== routingPaths.mobileNavMenu && (
            <NavBar isCogOpen={isCogOpen} setIsCogOpen={setIsCogOpen} />
          )}

          {error && (
            <div className="search-alert-container">
              <div className="search-alert-content-container">
                <VscError size={30} className="alert-icon" />
                <div className="content">
                  <div className="column">
                    <p>Error!</p>
                    <span>{error}</span>
                  </div>
                  <IoClose className="alert-close-icon" onClick={handleCloseAlert} />
                </div>
              </div>
              {showProgressBar && <div className="progress-bar"></div>}
            </div>
          )}
          <Routes>
            <Route exact path={routingPaths.home} element={<Home setError={setError} setShowProgressBar={setShowProgressBar} progressBarClear={progressBarClear} />} />
            <Route exact path={routingPaths.forecast} element={<Forecast setError={setError} setShowProgressBar={setShowProgressBar} progressBarClear={progressBarClear} />} />
            <Route exact path={routingPaths.personalStory} element={<PersonalStory />} />
            <Route exact path={routingPaths.about} element={<About />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
