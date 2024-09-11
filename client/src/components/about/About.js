import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './About.css';

const About = () => {
  const { appliedTheme } = useSelector((state) => state.themesSlice);
  // console.log('appliedTheme: ', appliedTheme);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [cardColors, setCardColors] = useState([]);

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setX(x);
    setY(y);
  };

  const getThemeBasedClr = () => {
    console.log('appliedTheme: ', appliedTheme);
    switch (appliedTheme) {
      case 'summer-theme':
        return '#ff0';
      case 'cloudy-theme':
        return '#00ffff';
      case 'rainy-theme':
        return '#0f0';
      case 'winter-theme':
        return '#00f';
      default:
        return '#fff';
    }
  }

  useEffect(() => {
    const plainMode = appliedTheme === 'dark-mode' ? true : appliedTheme === 'light-mode' ? true : false
    const themeClr = getThemeBasedClr();

    const colors = plainMode
      ? ['#ff0', '#00ffff', '#0f0', '#f00', '#ff00ff', '#00f']
      : [themeClr, themeClr, themeClr, themeClr, themeClr, themeClr];

    setCardColors(colors);
  }, [appliedTheme]);


  return (
    <div className="about-container">
      <div className="about-content">
        <div className="about-card" style={{ '--clr': cardColors[0], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>App Purpose and Overview</h3>
          <span>
            This weather app provides accurate and up-to-date weather forecasts, allowing users to view the current weather, hourly and daily forecasts, and share their own weather-related stories.
            The app is designed to be user-friendly and accessible on both desktop and mobile devices.
          </span>
        </div>

        <div className="about-card" style={{ '--clr': cardColors[1], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>Technology Stack</h3>
          <span>
            This app is built using ReactJS for the frontend, Redux for state management, and the OpenWeatherMap API for weather data.
            It also features responsive design, with a light/dark mode toggle and themed backgrounds that change with the seasons.
          </span>
        </div>

        <div className="about-card" style={{ '--clr': cardColors[2], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>Data Sources</h3>
          <span>
            Weather data is sourced from the OpenWeatherMap API, providing real-time updates on weather conditions, forecasts, and more.
            The data is fetched periodically to ensure users receive the latest information.
          </span>
        </div>

        <div className="about-card" style={{ '--clr': cardColors[3], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>User Privacy</h3>
          <span>
            User data, especially stories shared in the Personal Stories tab, is handled with care.
            We do not share or sell your personal information. Stories are stored securely and used only within this app.
          </span>
        </div>

        <div className="about-card" style={{ '--clr': cardColors[4], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>Acknowledgments and Credits</h3>
          <span>
            I would like to acknowledge the developers of ReactJS, Redux, and the OpenWeatherMap API for their incredible tools. These technologies have made it possible to create a robust and user-friendly weather app.
          </span>
        </div>

        <div className="about-card" style={{ '--clr': cardColors[5], '--x': `${x}px`, '--y': `${y}px` }} onMouseMove={handleMouseMove}>
          <h3>Contact Information</h3>
          <span>
            If you have any feedback, suggestions, or need support, feel free to contact me at <a className='card-email' href="mailto:kalyanguttula3175@gmail.com">kalyanguttula3175@gmail.com</a>.
          </span>
        </div>
      </div>
    </div>
  );
};

export default About;
