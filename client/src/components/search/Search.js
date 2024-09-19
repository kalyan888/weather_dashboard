import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VscError } from "react-icons/vsc";
import { IoClose } from "react-icons/io5";
import { fetchCoordinatesAndWeather, setLocation } from '../../store/searchSlice'; //, setCoords
import "./Search.css";

const Search = ({ searchClassName }) => {

  const dispatch = useDispatch();
  const location = useSelector((state) => state.search.location);
  const searchError = useSelector((state) => state.search.error);
  const [localLocation, setLocalLocation] = useState(location);
  const [error, setError] = useState('');
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const progressBarClear = () => {
    const timer = setTimeout(() => {
      setError(''); // ''
      setShowProgressBar(false); // false
    }, 3000);

    return () => clearTimeout(timer);
  }

  const handleSearch = () => {
    setError(''); // Clear any previous error message
    setShowProgressBar(false); // Reset progress bar visibility
    setIsLoading(true);

    if (localLocation.trim() === '') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(fetchCoordinatesAndWeather({ location: '', coords: { lat: latitude, lon: longitude } }))
              .finally(() => setIsLoading(false));
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError('Location access denied by user.');
                break;
              case error.POSITION_UNAVAILABLE:
                setError('Location information is unavailable.');
                break;
              case error.TIMEOUT:
                setError('The request to get user location timed out.');
                break;
              case error.UNKNOWN_ERROR:
              default:
                setError('An unknown error occurred while retrieving location.');
                break;
            }
            console.error('Error getting location:', error);
            setShowProgressBar(true); // Show progress bar on error
            progressBarClear();
            setIsLoading(false);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setError('Geolocation is not supported by this browser.');
        setShowProgressBar(true); // Show progress bar on error
        progressBarClear();
        setIsLoading(false);
      }
    } else {
      dispatch(setLocation(localLocation));
      dispatch(fetchCoordinatesAndWeather({ location: localLocation }))
        .finally(() => setIsLoading(false));
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setShowProgressBar(false);
  }

  // Update the error state if searchError changes
  useEffect(() => {
    if (searchError) {
      setError(searchError);
      setShowProgressBar(true); // Show progress bar on error

      progressBarClear();
    }
  }, [searchError]);

  return (
    <div className={`home-location-input-con ${searchClassName}`}>
      <input
        className='location-search-input'
        type="text"
        value={localLocation}
        onChange={(e) => setLocalLocation(e.target.value)}
        placeholder="Enter location"
      />
      {/* <button className="buttonn" onClick={handleSearch}> {isLoading ? <div class="loader"></div> : Search} </button> */}
      <button className="buttonn" onClick={handleSearch}>
        {isLoading ? <div className="loader"></div> : 'Search'}
      </button>


      {error && (
        <div className="search-alert-container">
          <div class="search-alert-content-container">
            <VscError size={30} className="alert-icon" /> {/* react-icon */}
            <div className="content">
              <div className="column">
                <p>Error!</p> {/* message */}
                <span>{error}</span> {/* description */}
              </div>
              <IoClose className="alert-close-icon" onClick={handleCloseAlert} />
            </div>
          </div>
          {showProgressBar && <div className="progress-bar"></div>}
        </div>
      )}
    </div>
  );
};

export default Search;
