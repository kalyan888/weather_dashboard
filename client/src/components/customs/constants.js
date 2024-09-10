import { useEffect, useState } from 'react';
import notFoundImg from '../../assets/images/not-found.jpg';
import offlineImg from '../../assets/images/offline.jpg';

import cloudyBGImg from '../../assets/images/cloudy-bg.jpg';
import sunnyBGImg from '../../assets/images/sunny-bg.jpg';
import winterBGImg from '../../assets/images/winter-bg.jpg';

import brokenCloudsImg from '../../assets/icons/broken-clouds.png';
import sunny from '../../assets/icons/sunny.png';
import moderateRainImg from '../../assets/icons/moderate-rain.png';
import heavyRainImg from '../../assets/icons/rainy.png';
import overcastCloudsImg from '../../assets/icons/overcast-clouds.png';
import partlyCloudyImg from '../../assets/icons/partly-cloudy.png';
import scatteredCloudsImg from '../../assets/icons/broken-clouds.png';
import scatteredThunderestorm from '../../assets/icons/scattered-thunderestorm.png';
import scatteredThunderstormsNight from '../../assets/icons/scattered-thunderstorms-night.png';
import thunderstormImg from '../../assets/icons/thunder-shower.png';
import coldImg from '../../assets/icons/cold.png';

// let cache = null;  // Store fetched data in a module-scoped variable

// async function fetchData() {
//   if (cache) {
//     return cache;  // Return cached data if already fetched
//   }
//   const response = await fetch('your_cloudinary_json_file_url');
//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }
//   cache = await response.json();  // Cache the fetched data
//   return cache;
// }

// export async function projectsData() {
//   const data = await fetchData();
//   console.log('data: ', data);
//   return data.projectsData;  // Return specific part of the fetched data
// }

// export async function getAboutDescription() {
//   const data = await fetchData();
//   return data.about;  // Return specific part of the fetched data
// }

export const offline = [
  {
    id: 0,
    imageUrl: offlineImg
  }
]

export const notFound = [
  {
    id: 0,
    imageUrl: notFoundImg
  }
]

export const routingPaths = {
  home: "/",
  mobileNavMenu: "/mobileMenu",
  forecast: "/forecast",
  personalStory: "/personalstory",
  about: "/about",
  notFound: "*"
};

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop');

  const updateDeviceType = () => {
    const width = window.innerWidth;
    if (width <= 768) {
      setDeviceType('mobile');
    } else if (width > 768 && width <= 1024) {
      setDeviceType('tablet');
    } else {
      setDeviceType('desktop');
    }
  };

  useEffect(() => {
    updateDeviceType(); // Set initial device type
    window.addEventListener('resize', updateDeviceType); // Update device type on resize

    return () => {
      window.removeEventListener('resize', updateDeviceType); // Cleanup on unmount
    };
  }, []);

  return deviceType;
};


export const iconMap = {
  'sunny': sunny,
  'broken-clouds': brokenCloudsImg,
  'partly-cloudy': partlyCloudyImg,
  'overcast-clouds': overcastCloudsImg,
  'scattered-clouds': scatteredCloudsImg,
  'moderate-rain': moderateRainImg,
  'rainy': heavyRainImg,
  'thunder-shower': thunderstormImg,
  'scattered-thunderestorm': scatteredThunderestorm,
  'scattered-thunderstorms-night': scatteredThunderstormsNight,
};

export const getWeatherBGImg = (weatherCode) => {
  switch (true) {
    case (weatherCode >= 200 && weatherCode <= 232):
      return winterBGImg;

    case ((weatherCode >= 300 && weatherCode <= 321) || (weatherCode >= 520 && weatherCode <= 521) || weatherCode === 802 || weatherCode === 801 || weatherCode === 803 || weatherCode === 804):
      return cloudyBGImg;

    case ((weatherCode >= 500 && weatherCode <= 504) || (weatherCode >= 700 && weatherCode <= 781)):
      return cloudyBGImg;

    case (weatherCode === 511 || (weatherCode >= 600 && weatherCode <= 622)):
      return winterBGImg;

    case (weatherCode === 800):
      return sunnyBGImg;

    default:
      return cloudyBGImg;
  }
}

export const getWeatherType = (weatherCode) => {
  switch (true) {
    case (weatherCode >= 200 && weatherCode <= 232):
      return thunderstormImg;

    case ((weatherCode >= 300 && weatherCode <= 321) || (weatherCode >= 520 && weatherCode <= 521)):
      return moderateRainImg;

    case (weatherCode >= 500 && weatherCode <= 504):
      return heavyRainImg;

    case (weatherCode === 511 || (weatherCode >= 600 && weatherCode <= 622)):
      return coldImg;

    case (weatherCode >= 700 && weatherCode <= 781):
      return heavyRainImg;

    case (weatherCode === 800):
      return sunny;
      
    case (weatherCode === 801):
      return partlyCloudyImg;

    case (weatherCode === 802):
      return overcastCloudsImg;

    case (weatherCode === 803 || weatherCode === 804):
      return scatteredCloudsImg;

    default:
      return partlyCloudyImg;
  }
}


//***************************   To update data without caching after reloading   *******************************
// function fetchPortfolioData() {
//   const cacheBuster = new Date().getTime(); // Current timestamp as a cache buster
//   const url = `CLOUDINARY_URL_HERE?${cacheBuster}`;

//   fetch(url)
//     .then(response => response.text())
//     .then(text => JSON.parse(text))
//     .then(json => setData(json))
//     .catch(error => console.error('Error loading data:', error));
// }




// export const darkTheme = {
//   bg: "#1C1C27",
//   bgLight: "#1C1E27",
//   primary: "#854CE6",
//   text_primary: "#FFFFFF",
//   text_secondary: "#b1b2b3",
//   card: "#171721",
//   card_light: "#191924",
//   button: "#854CE6",
//   white: "#FFFFFF",
//   black: "#000000",
// };
// export const lightTheme = {
//   bg: "#FFFFFF",
//   bgLight: "#fefefe",
//   primary: "#beladb",
//   text_primary: "#111111",
//   text_secondary: "#48494a",
//   card: "#FFFFFF",
//   button: "#5c5b5b",
// };
// clamp(1.2rem, 1.5vw, 1.6rem)
// clamp(2rem, 5vw, 3rem)
// clamp(1.4rem, 3vw, 2.2rem)
// clamp(1rem, 2vw, 1.5rem)