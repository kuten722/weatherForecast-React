import axios from 'axios';

const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_KEY = '4ed8022ad9msh4aaa7fe1da36290p1354ffjsnd91fec971b94';
const WEATHER_API_KEY = 'a2ab461c0e603f77805c844e99bfe361';


export const geoRequest = axios.create({
  baseURL: GEO_API_URL,
  headers: {
    'x-rapidapi-key': GEO_API_KEY,
    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
  },
  timeout: 5000
})

const weatherRequest = axios.create({
  baseURL: WEATHER_API_URL,
  params: {
  },
  timeout: 5000
})

export async function getCurrentWeather(lat, lon) {
  try {
    const response = await weatherRequest.get("/weather", {
      params: {
        lat, lon, units: 'metric', appid: WEATHER_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error("currentWeather:", error);
    return null;
  }
}

export async function getWeatherForecast(lat, lon) {
  try {
    const response = await weatherRequest.get("/forecast", {
      params: {
        lat, lon, units: 'metric',appid: WEATHER_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error("forecastWeather:", error);
    return null;
  }
}

export async function getGeoInfo(input) {
  try {
    const response = await geoRequest.get();
    return response.data;
  } catch (error) {
    console.error("geoInfo:", error);
    return null;
  }
}


geoRequest.interceptors.request.use(
    config => {
      config.metadata = { startTime: new Date() };
      console.log('发起地理位置API请求');
      return config;
    },
    error => {
      console.error('地理位置API请求拦截器错误:', error);
      return Promise.reject(error);
    }
  );
  
  geoRequest.interceptors.response.use(
    response => {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`地理位置API请求耗时: ${duration}ms`);
      console.dir(response);
      return response;
    },
    error => {
      console.error('地理位置API响应错误:', error);
      return Promise.reject(error);
    }
  );
  
  weatherRequest.interceptors.request.use(
    config => {
      config.metadata = { startTime: new Date() };
      config.params = {
        ...config.params,
        appid: WEATHER_API_KEY,
        units: 'metric'
      };
      console.log('发起天气API请求');
      return config;
    },
    error => {
      console.error('天气API请求拦截器错误:', error);
      return Promise.reject(error);
    }
  );
  
  weatherRequest.interceptors.response.use(
    response => {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`天气API请求耗时: ${duration}ms`);
      console.dir(response);
      return response;
    },
    error => {
      if (error.response) {
        console.error(`天气API错误: ${error.response.status}`, error.response.data);
      } else if (error.request) {
        console.error('天气API没有响应:', error.request);
      } else {
        console.error('天气API请求配置错误:', error.message);
      }
      return Promise.reject(error);
    }
  );