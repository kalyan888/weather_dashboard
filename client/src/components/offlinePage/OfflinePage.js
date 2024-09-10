import { useSelector } from "react-redux";
// import { offline } from "../customs/constants";
import "./OfflinePage.css";

function OfflinePage({ setIsOnline }) {
    const toggleMode = useSelector((state) => state.themeSlice.toggleMode);
    
    const headerStyle = {
        background: toggleMode ? "var(--background-color-light)" : "var(--background-color-dark)",
        // background: toggleMode ? darkGradient : "var(--background-color-dark)",
      color: toggleMode ? "var(--text-color-light)" : "var(--text_primary-dark)",
      transition: "all 0.5s linear"
    };

    const refreshPage = () => {
        setIsOnline(window.navigator.onLine);
    };

    return (
        <div className="wrapper" style={headerStyle}>
            {/* <img className="offline-img" src={offline[0].imageUrl} alt="" /> */}
            <h1>No Internet</h1>
            <h4>Please check your internet connection</h4>
            <a href="." className="button" onClick={refreshPage}>RETRY</a>
        </div>
    );
}

export default OfflinePage;
