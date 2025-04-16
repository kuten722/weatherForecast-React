import { useState } from 'react';
import './App.css';
import Search from './components/search/search';
import WeatherNow from './components/weatherNow/weatherNow';
import Forecast from './components/forecast/forecast.js';
import { getCurrentWeather,getWeatherForecast } from './netWorkConfig.js';

function App() {
  const [nowWeather, setNowWeather] = useState(null);
  const [nxtWeather, setNxtWeather] = useState(null);
  const handleOnSearchChange = async(searchData) => {
      const [lat, lon] = searchData.value.split(' ');
      console.log([lat,lon]);
      try {
        const [weatherResponse, forcastResponse] = await Promise.all([
          getCurrentWeather(lat, lon),
          getWeatherForecast(lat, lon)
        ]);
  
        if (weatherResponse && forcastResponse) {
          setNowWeather({ city: searchData.label, ...weatherResponse });
          setNxtWeather({ city: searchData.label, ...forcastResponse });
        }
      } catch (error) {
        console.log(error);
      }
    };
  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {nowWeather && <WeatherNow data={nowWeather} />}
      {nxtWeather && <Forecast data={nxtWeather} />}
    </div>
  );
}

export default App;
