import React from 'react';
import arrowImg from '../../../assets/icons/wind-arrow.png';
import './ForecastComponents.css';

const WindDirection = ({ angle }) => {

    const getDirectionClass = (angle) => {
        if (angle >= 45 && angle < 135) return 'east';
        if (angle >= 135 && angle < 225) return 'south';
        if (angle >= 225 && angle < 315) return 'west';
        return 'north';
    };

    const getBorderStyle = () => {
        switch (getDirectionClass(angle)) {
            case 'north':
                return 'top';
            case 'east':
                return 'right';
            case 'south':
                return 'bottom';
            case 'west':
                return 'left';
            default:
                return '';
        }
    };

    return (
        <div className="wind-container">
            <div className={`wind-circle ${getBorderStyle()}`}>
            </div>
            <span>
                <img
                    src={arrowImg}
                    alt="WindArrow"
                    className="wind-arrow"
                    style={{ transform: `rotate(${angle}deg)` }}
                />
            </span>
            {getDirectionClass(angle) === "north" && <span className="direction-label north">N</span>}
            {getDirectionClass(angle) === "east" && <span className="direction-label east">E</span>}
            {getDirectionClass(angle) === "west" && <span className="direction-label west">W</span>}
            {getDirectionClass(angle) === "south" && <span className="direction-label south">S</span>}
        </div>

    );
};

export default WindDirection;
