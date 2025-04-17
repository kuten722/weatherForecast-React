import { useState, Suspense, lazy } from 'react';
import './App.css';
import { getCurrentWeather, getWeatherForecast } from './netWorkConfig.js';
import PromiseTest from './components/PromiseTest/PromiseTest.js';
import Search from './components/search/search';
const WeatherNow = lazy(() => import('./components/weatherNow/weatherNow'));
const Forecast = lazy(() => import('./components/forecast/forecast.js'));


function App() {
  const [nowWeather, setNowWeather] = useState(null);
  const [nxtWeather, setNxtWeather] = useState(null);
  const [showWeather, setShowWeather] = useState(true);

  const handleOnSearchChange = async (searchData) => {
    const [lat, lon] = searchData.value.split(' ');
    console.log([lat, lon]);
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

  const toggleView = () => {
    setShowWeather(!showWeather);
  };

  return (
    <div className="container">
      <button 
        onClick={toggleView}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '15px'
        }}
      >
        {showWeather ? '切换到性能测试' : '切换到天气预报'}
      </button>
  
      {showWeather ? (
        <div>
          <Search onSearchChange={handleOnSearchChange} />
          <Suspense fallback={<div>加载中...</div>}>
            {nowWeather && <WeatherNow data={nowWeather} />}
            {nxtWeather && <Forecast data={nxtWeather} />}
          </Suspense>
        </div>
      ) : (
        <PromiseTest />
      )}
    </div>
  );
}

export default App;