import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ForecastComponents.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HumidityPrecipitationProgressBars = ({ data, selectedDay }) => {
    const [activeTab, setActiveTab] = useState('humidity');
    const [hourlyHumidityList, setHourlyHumidityList] = useState([]);
    const [hourlyPrecipitationList, setHourlyPrecipitationList] = useState([]);

    const formatTime = (dateTimeString) => {
        const timeString = dateTimeString?.split(" ")[1];
        return timeString?.slice(0, -3);
    };

    useEffect(() => {
        const selectedDate = new Date(selectedDay?.[1]?.dt_txt);

        // Filter data for the selected day
        const filteredData = data?.list?.filter(item => {
            const itemDate = new Date(item.dt_txt);
            return (
                itemDate.getFullYear() === selectedDate.getFullYear() &&
                itemDate.getMonth() === selectedDate.getMonth() &&
                itemDate.getDate() === selectedDate.getDate()
            );
        });

        // Create lists for hourly humidity and precipitation
        // const humidityList = filteredData?.map(item => ({
        //     time: formatTime(item.dt_txt),
        //     humidity: item.main.humidity,
        // }));

        // const precipitationList = filteredData?.map(item => ({
        //     time: formatTime(item.dt_txt),
        //     precipitation: item.rain ? item.rain['3h'] : 0,
        // }));

        const humidityList = (filteredData && filteredData?.length > 0)
            ? filteredData?.map(item => ({
                time: formatTime(item?.dt_txt),
                humidity: item?.main?.humidity,
            }))
            : [{ time: 'N/A', humidity: 0 }]; // Default value if empty

        const precipitationList = (filteredData && filteredData?.length > 0)
            ? filteredData?.map(item => ({
                time: formatTime(item?.dt_txt),
                precipitation: item?.rain ? item.rain['3h'] : 0,
            }))
            : [{ time: 'N/A', precipitation: 0 }]; // Default value if empty

        // console.log('humidityList: ', humidityList);
        // console.log('precipitationList: ', precipitationList);
        setHourlyHumidityList(humidityList);
        setHourlyPrecipitationList(precipitationList);
    }, [data, selectedDay]);

    const humidityData = {
        labels: hourlyHumidityList?.map(item => item.time),
        datasets: [
            {
                label: 'Humidity (%)',
                data: hourlyHumidityList?.map(item => item.humidity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                // backgroundColor: 'rgba(240, 165, 0, 0.1)',
                // borderColor: 'rgba(240, 165, 0, 1)',
                borderWidth: 1,
            },
        ],
    };

    const precipitationData = {
        labels: hourlyPrecipitationList?.map(item => item.time),
        datasets: [
            {
                label: 'Precipitation (mm)',
                data: hourlyPrecipitationList?.map(item => item.precipitation),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                // display: false
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                display: false, // Hide y-axis labels
            },
        },
        onHover: (event, chartElement) => {
            if (chartElement.length) {
                event.native.target.style.cursor = 'pointer'; // Set cursor to pointer
            } else {
                event.native.target.style.cursor = 'default'; // Reset cursor
            }
        }
    };

    return (
        <div>
            <div className='hum-prec-chart-container'>
                <button onClick={() => setActiveTab('humidity')} className={`tab ${activeTab === 'humidity' ? 'active' : ''}`} >
                    Humidity
                </button>
                <button onClick={() => setActiveTab('precipitation')} className={`tab ${activeTab === 'precipitation' ? 'active' : ''}`} >
                    Precipitation
                </button>
            </div>

            {activeTab === 'humidity' && (
                <div style={{ width: '100%', height: '180px !important' }}>
                    <Bar data={humidityData} options={options} style={{ width: '100%', height: '180px !important' }} />
                </div>
            )}

            {activeTab === 'precipitation' && (
                <div style={{ width: '100%', height: '180px !important' }}>
                    <Bar data={precipitationData} options={options} style={{ width: '100%', height: '180px !important' }} />
                </div>
            )}
        </div>
    );
};

export default HumidityPrecipitationProgressBars;
