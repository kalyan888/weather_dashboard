import { notFound } from "../customs/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./NotFound.css";

function NotFound() {
  const navigate = useNavigate();
  const toggleMode = useSelector((state) => state.themeSlice.toggleMode);
  
  const headerStyle = {
    backgroundColor: toggleMode ? "var(--background-color-light)" : "var(--background-color-dark)",
    color: toggleMode ? "var(--text-color-light)" : "var(--text_primary-dark)",
    transition: "all 0.5s linear"
  };

  const goHome = () => {
      navigate("/"); // Navigate to the "/" route
  };

  return (
      <div className="not-found-page" style={headerStyle}>
          <img className="notfound-img" src={notFound[0].imageUrl} alt="" />
          <h4>Oops! Page Not Found</h4>
          <button className="notfound-back-btn" onClick={goHome} type="submit">Go Back</button>
      </div>
  );
}

export default NotFound;
