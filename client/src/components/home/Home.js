import React, { useState } from 'react';
import { BiWater } from "react-icons/bi";
// import { BsWater } from "react-icons/bs";
import { FaWind } from "react-icons/fa";
import { useSelector } from 'react-redux';
// import { fetchCoordinatesAndWeather } from '../../store/searchSlice';
import './Home.css';
import Search from '../search/Search';
import { getWeatherType, useDeviceType } from '../customs/constants';
import { format } from 'date-fns';

const Home = ({ setError, setShowProgressBar, progressBarClear }) => {
  let deviceType = useDeviceType();
  // let isDesktop = deviceType === 'desktop' ? true : false
  const isSmallDevice = deviceType === 'mobile';
  const weather = useSelector((state) => state?.search?.weather);
  const weatherType = weather?.weather?.[0].description
  const weatherTypeCapitalized = weatherType ? weatherType.charAt(0).toUpperCase() + weatherType.slice(1) : '';


  return (
    <div className='home-container'>
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

            {!isSmallDevice && <div className="weather-item">Feels Like {Math.round(weather?.main?.feels_like) || "--"} <span className="home-min-max-units">° C</span></div>}

            {!isSmallDevice && <div className='home-min-max-container'>
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