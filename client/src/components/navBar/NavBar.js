import { Divide as Hamburger } from "hamburger-react";
import { useState } from "react";
// import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import './NavBar.css';
import Greeting from "../customs/greeting/Greeting";
import { toggleSeason, toggleMode, toggleTheme } from "../../store/themeSlice";

function NavBar({ isCogOpen, setIsCogOpen }) {
  const dispatch = useDispatch();

  const { mode, theme, appliedTheme } = useSelector((state) => state.themesSlice);
  const themeModeActive = mode === "theme" ? true : false

  // const [isCogOpen, setIsCogOpen] = useState(false);
  const [toggleNav, updateToggleNav] = useState(false);

  const onClickCog = () => {
    setIsCogOpen(!isCogOpen);
    updateToggleNav(false);
  }

  const onClickChangeMode = () => {
    dispatch(toggleTheme())
  }

  const handleToggleMode = () => {
    dispatch(toggleMode());
  };

  const handleToggleSeason = () => {
    dispatch(toggleSeason());
  };

  // const darkGradient = "linear-gradient(to right, #fff 0%, var(--green-bg-color) 100%)";
  const headerStyle = {
    // background: toggleThemee ? '#ffffff' : '#000000',
    // color: toggleThemee ? '#000000' : '#ffffff',
    // transition: "all 0.6s linear"
  };

  const navLinkStyle = {
    // color: toggleThemee ? '#000000' : '#ffffff',
    // textDecoration: 'none',
    // cursor: 'pointer'
  };

  return (
    <div className={`nav-container screen-nav-bar ${appliedTheme}`}>
      <NavLink to="/" className="logo-link-style">
        {/* <img src={LogoK} alt="Logo" className="nav-logo" /> */}
        <Greeting />
      </NavLink>

      <div className="screen-nav">
        <NavLink to="/" className="screen-nav-link" style={navLinkStyle} activeClassName="active">
          <h1 className="screen-nav-link-item">Home</h1>
        </NavLink>

        <NavLink to="/forecast" className="screen-nav-link" style={navLinkStyle} activeClassName="active">
          <h1 className="screen-nav-link-item">Forecast</h1>
        </NavLink>

        <NavLink to="/personalstory" className="screen-nav-link" style={navLinkStyle} activeClassName="active">
          <h1 className="screen-nav-link-item">Personal Story</h1>
        </NavLink>

        <NavLink to="/about" className="screen-nav-link" style={navLinkStyle} activeClassName="active">
          <h1 className="screen-nav-link-item">About</h1>
        </NavLink>
      </div>

      <div className="cog-container">
        <IoMdSettings onClick={onClickCog} className="mode-icons navbar-ham-btn" />

        {isCogOpen && <div className="modes-container">

          {/* Dark/Light Button */}
          <p className={`mode-icon mode-icon-1 ${themeModeActive ? 'active-mode' : ''}`} style={{ cursor: 'pointer' }} onClick={handleToggleMode}> Dark/Light Mode
            <label className={`switch ${!themeModeActive ? 'toggle-no-events' : ''}`}>
              <input type="checkbox" checked={theme} readOnly />
              <span className="slider" onClick={onClickChangeMode}></span>
            </label>
          </p>

          {/* Seasonal Button */}
          <p className={`mode-icon mode-icon-2 ${!themeModeActive ? 'active-mode' : ''}`} onClick={handleToggleSeason}>Weather Mode</p>

        </div>}
      </div>



      <div className="mobile-nav">
        <div className="navbar-ham-btn" onClick={() => updateToggleNav(!toggleNav)} aria-hidden="true">
          <Hamburger toggled={toggleNav} easing="ease-in" duration={0.2} size={22} style={headerStyle} />
        </div>
        {toggleNav && (
          <ul className="mobile-nav-links" style={headerStyle}>
            <Link to="/" className="mobile-nav-link" onClick={() => updateToggleNav(false)} style={navLinkStyle} activeClassName="active-link">
              <h1 className="screen-nav-link-item">Home</h1>
            </Link>

            <Link to="/forecast" className="mobile-nav-link" onClick={() => updateToggleNav(false)} style={navLinkStyle} activeClassName="active-link">
              <h1 className="screen-nav-link-item">Forecast</h1>
            </Link>

            <Link to="/personalstory" className="mobile-nav-link" onClick={() => updateToggleNav(false)} style={navLinkStyle} activeClassName="active-link">
              <h1 className="screen-nav-link-item">Personal Story</h1>
            </Link>

            <Link to="/about" className="mobile-nav-link" onClick={() => updateToggleNav(false)} style={navLinkStyle} activeClassName="active-link">
              <h1 className="screen-nav-link-item">About</h1>
            </Link>
          </ul>
        )}
      </div>
    </div>
  );
}

export default NavBar;
