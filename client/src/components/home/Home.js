import React, { useState } from 'react';
import { BiWater } from "react-icons/bi";
// import { BsWater } from "react-icons/bs";
import { FaWind } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
// import { fetchCoordinatesAndWeather } from '../../store/searchSlice';
import './Home.css';
import Search from '../search/Search';
import { getWeatherType, useDeviceType } from '../customs/constants';
import { format } from 'date-fns';

const Home = () => {
  let deviceType = useDeviceType();
  let isDesktop = deviceType === 'desktop' ? true : false
  const weather = useSelector((state) => state?.search?.weather);
  const weatherType = weather?.weather?.[0].description
  const weatherTypeCapitalized = weatherType ? weatherType.charAt(0).toUpperCase() + weatherType.slice(1) : '';

  const [error, setError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [timer, setTimer] = useState(null);
  // if (status === 'loading') {
  //   return <div>Loading...</div>;
  // }

  // if (status === 'failed') {
  //   return <div>Error: {error}</div>;
  // }

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

  return (
    <div className='home-container'>
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
      <Search searchClassName='home-search' setError={setError} setShowProgressBar={setShowProgressBar} progressBarClear={progressBarClear} />
      <>
        <div className="weather-container">
          {/* <Greeting /> */}
          <div className="weather-left">
            <img src={getWeatherType(weather?.weather?.[0]?.id)} alt="" className="home-season-icon" />
            <div className="home-weather-type">{weatherTypeCapitalized || "--"}</div>

            <h1 className="weather-item home-temp">
              {weather?.main?.temp ? Math.round(weather.main.temp) : "--"}
              <span className="weather-item home-temp-units">° C</span>
            </h1>

            {/* <p>{weather?.dt ? format(new Date(weather.dt * 1000), 'MMMM d, yyyy h:mm a') : '--'}</p> */}
            <p>{weather?.dt ? format(new Date(weather.dt * 1000), 'MMMM d, yyyy') : '--'}</p>
          </div>
          <div className="weather-right">
            <div className="home-conditions-container">
              <div className="home-condition-details-con">
                <BiWater className='home-condition-icons' />
                <div className="weather-right-item-desc">
                  <p className="home-hum-perc">{weather?.main?.humidity || "--"}%</p>
                  <span className="home-hum-desc">Humidity</span>
                </div>
              </div>
              <div className="home-condition-details-con">
                <FaWind className='home-condition-icons' />
                <div className="weather-right-item-desc">
                  <p className="home-hum-perc">{weather?.wind?.speed || "--"}Km/h</p>
                  <span className="home-hum-desc">Wind Speed</span>
                </div>
              </div>
            </div>

            {isDesktop && <div className="weather-item">Feels Like {Math.round(weather?.main?.feels_like) || "--"} <span className="home-min-max-units">° C</span></div>}

            {isDesktop && <div className='home-min-max-container'>
              <p className="weather-item home-con-item-high">High: {weather?.main?.temp_max || "--"} <span className="home-min-max-units">° C</span></p>
              <p className="weather-item">Low: {weather?.main?.temp_min || "--"} <span className="home-min-max-units">° C</span></p>
            </div>}

          </div>
        </div>

      </>
    </div>
  );
};

export default Home;