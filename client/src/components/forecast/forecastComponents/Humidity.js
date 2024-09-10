import React from 'react';
import './ForecastComponents.css';

const HumidityIndicator = ({ type, humidity }) => {

    const arrowPosition = 65 - (humidity * (75 / 100));

    return (
        <>
            {type === 'humidity' ?
                <div className="humidity-container">
                    <div className="humidity-progress-bar">
                        <div className={`humidity-level ${humidity === 100 ? "humidity-border" : ""}`} style={{ height: `${humidity}%` }}></div>
                    </div>
                    <div className="arrow-indicator" style={{ top: `${arrowPosition}%` }}>
                        <span>▶</span>
                    </div>
                    <div className="humidity-label">
                        <div className='humidity-label-top'>100</div>
                        <div className='humidity-label-btm'>0</div>
                    </div>
                </div>
                :
                <div className="uv-index-container">
                    <div className="uv-index-shape">
                        <div className="uv-index-label">11+</div>
                        <div className="arrow-indicator">▶</div>
                    </div>
                    <div className="uv-index-bottom-label">0</div>
                </div>
            }
        </>
    );
};

export default HumidityIndicator;
