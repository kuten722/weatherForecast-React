import { useState } from 'react';
import './App.css';
import Search from './components/search/search';
import WeatherNow from './components/weatherNow/weatherNow';
import { WEATHER_REQUEST_URL } from './netWorkConfig';
import { WEATHER_API_KET } from './netWorkConfig';
import Forecast from './components/forecast/forecast.js';

function App() {
  const [nowWeather, setNowWeather] = useState(null);
  const [nxtWeather, setNxtWeather] = useState(null);
  const handleOnSearchChange = (searchData) => {

    console.log(searchData);
    const [lat, lng] = searchData.value.split(" ");
    const currentWeather = fetch(`${WEATHER_REQUEST_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KET}&units=metric`);
    const forecastWeather = fetch(`${WEATHER_REQUEST_URL}/forecast?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KET}&units=metric`);

    Promise.all([currentWeather, forecastWeather]).then(
      async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setNowWeather({ city: searchData.label, ...weatherResponse });
        setNxtWeather({ city: searchData.label, ...forecastResponse });
      }
    ).catch((err) => console.log(err.message));
  }
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {nowWeather && <WeatherNow data={nowWeather} />}
      {nxtWeather && <Forecast data={nxtWeather} />}
    </div>
  );
}

export default App;
