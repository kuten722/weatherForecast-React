// weather-app/src/components/PromiseTest/PromiseTest.js
import React, { useState, useEffect } from 'react';
import { getCurrentWeather, getWeatherForecast } from '../../netWorkConfig';

const PromiseTest = () => {
  const [results, setResults] = useState({
    withPromiseAll: { time: null, data: null },
    withoutPromiseAll: { time: null, data: null }
  });
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState({ lat: 40.7128, lon: -74.0060 }); // 默认纽约
  
  // 使用Promise.all的测试函数
  const testWithPromiseAll = async () => {
    const startTime = new Date();
    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city.lat, city.lon),
        getWeatherForecast(city.lat, city.lon)
      ]);
      const endTime = new Date();
      
      return {
        time: endTime - startTime,
        data: { weather: weatherData, forecast: forecastData }
      };
    } catch (error) {
      console.error("Promise.all测试出错:", error);
      return { time: 0, data: null };
    }
  };
  
  // 不使用Promise.all的测试函数
  const testWithoutPromiseAll = async () => {
    const startTime = new Date();
    try {
      const weatherData = await getCurrentWeather(city.lat, city.lon);
      const forecastData = await getWeatherForecast(city.lat, city.lon);
      const endTime = new Date();
      
      return {
        time: endTime - startTime,
        data: { weather: weatherData, forecast: forecastData }
      };
    } catch (error) {
      console.error("顺序请求测试出错:", error);
      return { time: 0, data: null };
    }
  };
  
  // 运行测试
  const runTests = async () => {
    setLoading(true);
    
    // 运行测试5次取平均值以获得更准确的结果
    let promiseAllTotalTime = 0;
    let sequentialTotalTime = 0;
    const testRuns = 3;
    
    let promiseAllResult = null;
    let sequentialResult = null;
    
    for (let i = 0; i < testRuns; i++) {
      // 先运行Promise.all测试
      const promiseAllData = await testWithPromiseAll();
      promiseAllTotalTime += promiseAllData.time;
      promiseAllResult = promiseAllData.data;
      
      // 等待一小段时间再运行下一个测试，避免API限流
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 运行顺序请求测试
      const sequentialData = await testWithoutPromiseAll();
      sequentialTotalTime += sequentialData.time;
      sequentialResult = sequentialData.data;
      
      // 测试间隔
      if (i < testRuns - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setResults({
      withPromiseAll: { 
        time: Math.round(promiseAllTotalTime / testRuns), 
        data: promiseAllResult 
      },
      withoutPromiseAll: { 
        time: Math.round(sequentialTotalTime / testRuns), 
        data: sequentialResult 
      }
    });
    
    setLoading(false);
  };
  
  // 更新城市坐标
  const handleCityChange = (e) => {
    const [lat, lon] = e.target.value.split(',');
    setCity({ lat: parseFloat(lat), lon: parseFloat(lon) });
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Promise.all vs 顺序请求性能测试</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label>选择城市: </label>
        <select onChange={handleCityChange} defaultValue="40.7128,-74.0060">
          <option value="40.7128,-74.0060">纽约</option>
          <option value="34.0522,-118.2437">洛杉矶</option>
          <option value="51.5074,-0.1278">伦敦</option>
          <option value="39.9042,116.4074">北京</option>
          <option value="35.6762,139.6503">东京</option>
        </select>
      </div>
      
      <button 
        onClick={runTests} 
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: loading ? '#cccccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '测试中...' : '运行测试'}
      </button>
      
      {results.withPromiseAll.time && results.withoutPromiseAll.time && (
        <div style={{ marginTop: '20px' }}>
          <h3>测试结果:</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ 
              flex: 1, 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              margin: '0 10px 0 0'
            }}>
              <h4>使用 Promise.all</h4>
              <p>平均耗时: <strong>{results.withPromiseAll.time}ms</strong></p>
              <div>
                <p>性能提升: <strong>
                  {Math.round((results.withoutPromiseAll.time - results.withPromiseAll.time) / results.withoutPromiseAll.time * 100)}%
                </strong></p>
              </div>
            </div>
            
            <div style={{ 
              flex: 1, 
              padding: '15px', 
              border: '1px solid #ddd', 
              borderRadius: '5px',
              margin: '0 0 0 10px'
            }}>
              <h4>顺序请求</h4>
              <p>平均耗时: <strong>{results.withoutPromiseAll.time}ms</strong></p>
            </div>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>分析</h3>
            <p>Promise.all 允许并行发送多个请求，而顺序请求必须等待前一个请求完成。
            在网络请求情况下，这可以节省大量时间，尤其是当API响应时间较长时。</p>
            
            <p>在这个测试中，Promise.all比顺序请求快了大约
            {Math.round((results.withoutPromiseAll.time - results.withPromiseAll.time) / results.withoutPromiseAll.time * 100)}%。
            这是因为天气API和预报API是同时请求的，而不是依次请求。</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromiseTest;