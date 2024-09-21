import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import sunImg from '../../assets/icons/overcast-clouds.png';
// import cloudyTopImg from '../../assets/images/cloudy-bg.jpg';
import { SlArrowRightCircle } from "react-icons/sl";
import { FaEye } from "react-icons/fa";
import Search from '../search/Search';
import "./Forecast.css";
// import windArrImg from '../../assets/icons/wind-arrow.png';
import { getWeatherType, useDeviceType } from '../customs/constants';
import HumidityIndicator from './forecastComponents/Humidity';
import WindDirection from './forecastComponents/WindDirection';
import HumidityPrecipitationChart from './forecastComponents/HumidityPrecipitationChart';

const Forecast = ({ setError, setShowProgressBar, progressBarClear }) => {
  const appliedTheme = useSelector((state) => state.themesSlice.appliedTheme);
  // const dispatch = useDispatch();
  const weather = useSelector((state) => state?.search?.weather);
  // console.log('weather: ', weather);
  const forecast = useSelector((state) => state?.search?.forecast);
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', forecast);
  const deviceType = useDeviceType();
  const isDesktop = deviceType === 'desktop';

  // State to store the selected day's data
  const [selectedDay, setSelectedDay] = useState(null);
  // console.log('selectedDay: ', selectedDay);

  const [groupedForecast, setGroupedForecast] = useState([]);
  const [sunriseDirection, setSunriseDirection] = useState('')

  useEffect(() => {
    const direction = getSunriseDirection(weather?.coord?.lat);
    setSunriseDirection(direction);
  }, [weather])

  useEffect(() => {
    if (forecast?.list) {
      const groupedData = [];
      let currentDay = [];
      let currentDate = startOfDay(new Date(forecast.list[0].dt * 1000));

      forecast.list.forEach(item => {
        const itemDate = startOfDay(new Date(item.dt * 1000));
        if (isSameDay(itemDate, currentDate)) {
          currentDay.push(item);
        } else {
          groupedData.push(currentDay);
          currentDay = [item];
          currentDate = itemDate;
        }
      });

      if (currentDay.length > 0) {
        groupedData.push(currentDay);
      }

      // Fill in missing days if less than 10 days' worth of data is available
      while (groupedData.length < 7) {
        const lastDay = groupedData[groupedData.length - 1];
        const nextDate = addDays(new Date(lastDay[0].dt * 1000), 1);
        groupedData.push([{ dt: nextDate.getTime() / 1000, main: {}, weather: [{}] }]);
      }

      setGroupedForecast(groupedData.slice(0, 10));
      setSelectedDay(groupedData[0]);
    }
  }, [forecast]);

  // Function to handle weather card click
  const handleCardClick = (day) => {
    setSelectedDay(day);
  };

  const getSunriseDirection = (latitude) => {
    // Simplified approximation of sunrise direction based on latitude
    if (latitude >= 66.5 || latitude <= -66.5) return 'North';
    if (latitude >= 23.5 && latitude <= 66.5) return 'East';
    if (latitude <= -23.5 && latitude >= -66.5) return 'East';
    return 'East';
  };


  const dayWiseWeatherCard = (daily) => {
    const weatherIcon = getWeatherType(daily[0]?.weather?.[0]?.id);

    return (
      <div className="fc-sub-day-wise-cont" onClick={() => handleCardClick(daily)}>
        <div className="weather-card">
          <div className="weather-icon">
            <img src={weatherIcon} alt="Weather Icon" />
          </div>
          <div className="weather-details">
            <p className="weather-day">{format(new Date(daily[0]?.dt * 1000), 'EEEE')}</p>
            <span className="weather-condition">{daily[0]?.weather?.[0]?.description || '--'}</span>
          </div>
          {Math.round((daily[0]?.pop || 0) * 100) ? <div className="weather-precipitation">
            <img src={getWeatherType(500)} alt="Rain Icon" />
            <div className="precipitation-chance">{Math.round((daily[0]?.pop || 0) * 100)}%</div>
          </div> :
            <div style={{ margin: "0 26px" }}>
              {/* <div></div> */}
            </div>
          }
          <div className="weather-temp">
            <div className="temp-high">{daily[0]?.main?.temp_max ? `${Math.round(daily[0]?.main?.temp_max)}°` : '--'}</div>
            <span className="temp-low">{daily[0]?.main?.temp_min ? `${Math.round(daily[0]?.main?.temp_min)}°` : '--'}</span>
          </div>
        </div>
      </div>
    )
  }

  const fcRtWeatherCard = (hourly) => {
    const weatherIcon = getWeatherType(hourly[0]?.weather?.[0]?.id);
    // const WeatherBgImg = getWeatherBGImg(hourly[0]?.weather?.[0]?.id);

    return (
      <div className='d-flex'>
        <div className="fc-rt-weather-card">
          <p className="fc-rt-weather-date">{format(new Date(hourly[0]?.dt * 1000), 'eeee, MMMM d')}</p>
          <div className="fc-rt-weather-temp">
            <p className="fc-rt-temp-high">{hourly[0]?.main?.temp_max ? `${Math.round(hourly[0]?.main.temp_max)}°` : '--'}</p>
            <span className="fc-rt-temp-separator">/</span>
            <span className="fc-rt-temp-low">{hourly[0]?.main?.temp_min ? `${Math.round(hourly[0]?.main.temp_min)}°` : '--'}</span>
            <img src={weatherIcon} alt="Weather Icon" className="fc-rt-weather-icon" />
          </div>
          <div className="fc-rt-weather-condition">{hourly[0]?.weather?.[0]?.description || '--'}</div>
        </div>
        {/* <div className='forecast-top-bg-container'>
          <img src={WeatherBgImg} alt="Weather Bg" className="forecast-top-bg" />
        </div> */}
      </div>
    );
  };


  return (
    <div className={`forecast-container ${appliedTheme}`}>
      <div className="fc-day-wise-container">
        <Search searchClassName='forecast-search' setError={setError} setShowProgressBar={setShowProgressBar} progressBarClear={progressBarClear} />
        <div className="day-wise-main-container">
          {isDesktop ? <div className="day-wise-scroll">
            {groupedForecast.map((daily, index) => (
              <React.Fragment key={index}>
                {dayWiseWeatherCard(daily)}
              </React.Fragment>
            ))}
          </div> : <>{selectedDay && fcRtWeatherCard(selectedDay)}</>}
        </div>
      </div>
      <div className='fc-right-container'>
        <div className="fc-right-top-container">
          {!isDesktop && <h2 className="hourly-forecast-heading">Daily forecast</h2>}
          <div className='daily-container'>
            <div>
              {isDesktop ? <>{selectedDay && fcRtWeatherCard(selectedDay)}</> : <div className="day-wise-scroll">
                {groupedForecast.map((daily, index) => (
                  <React.Fragment key={index}>
                    {dayWiseWeatherCard(daily)}
                  </React.Fragment>
                ))}
              </div>}
            </div>
          </div>

        </div>
        <div className='fc-right-middle-container'>
          <div className="hourly-forecast-container">
            <h2 className="hourly-forecast-heading">Hourly forecast</h2>
            <div className="hourly-forecast-items">
              {selectedDay?.map((hourly, index) => (
                <div key={index} className="hourly-forecast-item">
                  <p className="hourly-temp">{hourly?.main?.temp ? `${Math.round(hourly?.main?.temp)}°` : '--'}</p>
                  <img src={getWeatherType(hourly?.weather?.[0]?.id)} alt="Weather Icon" className="hourly-icon" />
                  <span className="hourly-time">{format(new Date(hourly?.dt * 1000), 'HH:mm')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='fc-right-bottom-container'>
          <div className="fc-rbl-container">
            <h2 className="hourly-forecast-heading">Daily conditions</h2>
            <div className="fc-rb-wind-containers">
              <div className="fc-rb-wind-container">
                <div className="fc-rb-wind-header">
                  <p className="fc-rb-wind-title">Max wind</p>
                </div>
                <div className="fc-rb-wind-speed-container">
                  <div className="fc-rb-wind-speed fc-rb-wind">
                    <span>{selectedDay?.[0]?.wind?.speed != null ? Math.round(selectedDay[0].wind.speed) : "--"}</span>
                    <span className='fc-rb-wind-speed-desc fc-rb-wind-speed-fs'> km/h</span>
                    {/* <p className="fc-rb-wind-description">Light • From <span className="fc-rb-wind-desc-span">east</span></p></div> */}
                    <span className="fc-rb-wind-description fc-rb-wind-speed-descrptn">Light • From <span className="fc-rb-wind-desc-span">{sunriseDirection}</span></span></div>

                  <WindDirection angle={selectedDay?.[0]?.wind?.deg != null ? selectedDay[0].wind.deg : 0} />
                </div>
              </div>
              <div className="fc-rb-wind-container">
                <div className="fc-rb-wind-header">
                  <p className="fc-rb-wind-title">Average Humidity</p>
                </div>
                <div className="fc-rb-humidity-body">
                  {/* <img src="wind-icon.png" alt="Wind Direction" className="fc-rb-wind-icon" /> */}
                  <span className="fc-rb-wind-speed fc-rb-humidity">{selectedDay?.[0]?.main?.humidity != null ? selectedDay[0].main.humidity : "--"}%</span>
                  <HumidityIndicator type='humidity' humidity={selectedDay?.[0]?.main?.humidity ? selectedDay[0].main.humidity : 0} />
                </div>
              </div>
              <div className="fc-rb-wind-container">
                <div className="fc-rb-wind-header">
                  <p className="fc-rb-wind-title">Weather Metrics</p>
                </div>
                <div className="fc-rb-wind-body">

                  <>
                    <div className='weather-metrics-container'>
                      <SlArrowRightCircle className="fc-rb-wind-icon" />
                      <span className='weather-metric-icons'>
                        Pressure: {selectedDay?.[0]?.main?.pressure ? (selectedDay[0].main.pressure * 0.02953).toFixed(2) : "--"} inHg
                      </span>
                    </div>
                    <div className='weather-metrics-container'>
                      <FaEye className="fc-rb-wind-icon" />
                      <span className='weather-metric-icons'>
                        Visibility: {selectedDay?.[0]?.visibility ? (selectedDay[0].visibility / 1000).toFixed(1) : "--"} km
                      </span>
                    </div>
                  </>

                </div>
              </div>
              <div className="fc-rb-wind-container">
                <div className="fc-rb-wind-header">
                  <p className="fc-rb-wind-title">Sunrise and Sunset</p>
                </div>
                <div className="fc-rb-wind-body">
                  <div className="rise-set-cont">
                    <p className="rise-set-time">
                      {weather?.sys?.sunrise ? format(new Date(weather.sys.sunrise * 1000), 'HH:mm') : '--'}
                      <span className='rise-set-time-span'>Sunrise</span></p>
                    <p className="rise-set-time">
                      {weather?.sys?.sunset ? format(new Date(weather.sys.sunset * 1000), 'HH:mm') : '--'}
                      <span className='rise-set-time-span'>Sunset</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fc-rbr-container">
            <h2 className="hourly-forecast-heading">Hourly Details</h2>
            <HumidityPrecipitationChart data={forecast} selectedDay={selectedDay} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;