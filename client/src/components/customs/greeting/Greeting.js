import React, { useEffect, useState } from 'react';
import './Greeting.css';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { fetchCoordinatesAndWeather } from '../../../store/searchSlice';
import moment from 'moment'

const Greeting = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const location = useSelector((state) => state.search.location);
  const locationCapitalized = location ? location.charAt(0).toUpperCase() + location.slice(1) : '';
  const countryName = useSelector(state => state.search.country);
  const coords = useSelector((state) => state.search.coords);
  const search = useSelector((state) => state.search);
  const currentDate = search?.weather?.dt
  const [initialLoad, setInitialLoad] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    let active = true;
    if (initialLoad && !coords) {
      const fetchLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const coords = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
              if (!active || store.getState().search.status !== 'idle') return;
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
    return () => { active = false; };
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
