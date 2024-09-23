import React, { useEffect, useState } from 'react';
import './Greeting.css';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setCoords, fetchCoordinatesAndWeather } from '../../../store/searchSlice';
import moment from 'moment'

const Greeting = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.search.location);
  const locationCapitalized = location ? location.charAt(0).toUpperCase() + location.slice(1) : '';
  const country = useSelector((state) => state?.search?.weather?.sys?.country);
  const coords = useSelector((state) => state.search.coords);
  const search = useSelector((state) => state.search);
  const currentDate = search?.weather?.dt
  const [countryName, setCountryName] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const fetchCountryName = async () => {
      try {
        const response = await axios.get(`https://restcountries.com/v3/alpha/${country}`);
        if (response.data && response.data[0]) {
          setCountryName(response.data[0].name.common.charAt(0).toUpperCase() + response.data[0].name.common.slice(1));
        }
      } catch (error) {
        console.error('Error fetching country name:', error);
      }
    };

    if (country) {
      fetchCountryName();
    }
  }, [country]);

  useEffect(() => {
    if (initialLoad && !coords) {
      const fetchLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
              dispatch(setCoords(coords));
              dispatch(fetchCoordinatesAndWeather({ coords }));
              setInitialLoad(false);
            },
            (error) => {
              console.error('Error fetching location:', error);
              setInitialLoad(false);
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
          setInitialLoad(false);
        }
      };

      fetchLocation();
    }
  }, []);

  useEffect(() => {
    // const formattedDate = moment.unix(currentDate).format('MMMM D, YYYY h:mm A');
    const currentHour = moment.unix(currentDate).hour();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }

  }, [currentDate]);

  return (
    <div className="greeting-container">
      {locationCapitalized && countryName && (
        <p className="greeting-location">{locationCapitalized}, {countryName}</p>
      )}
      <h1 className="greeting-heading">👋 {greeting}!</h1>
    </div>
  );
};

export default Greeting;
