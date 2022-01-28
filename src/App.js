
import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useState ,useMemo} from 'react';
import {getMoment,findLocation } from './utils/helpers.js';
import WeatherCard from './views/WeatherCard';
import WeatherSetting from './views/WeatherSetting';
import styled from '@emotion/styled';
import useWeatherAPI from './hooks/useWeatherAPI';
const AUTHORIZATION_KEY='CWB-5ABC49B2-13DD-443C-9A99-03B3CAD70E0C';
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const storageCity = localStorage.getItem('cityName')||'臺北市';
  const [currentCity,setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(()=>findLocation(currentCity),[currentCity]);
  const {locationName,cityName,sunriseCityName}=currentLocation;
  const moment = useMemo(()=>getMoment(sunriseCityName),[sunriseCityName]);
  const [weatherElement,fetchData] = useWeatherAPI({AUTHORIZATION_KEY,locationName,cityName});
  const [currentPage,setCurrentPage] = useState('WeatherCard');

  
  useEffect(()=>setCurrentTheme(moment==='day'?'light':'dark'),[moment]);
  const handleCurrentPageChange = (currentPage)=>{
    setCurrentPage(currentPage);
  };
  const handleCurrentCityChange=(currentCity)=>{
    setCurrentCity(currentCity);
  }
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage ==='WeatherCard' && (<WeatherCard weatherElement={weatherElement} moment={moment} fetchData={fetchData} handleCurrentPageChange={handleCurrentPageChange} currentCity={currentCity}/>)}
        {currentPage ==='WeatherSetting' && (<WeatherSetting handleCurrentPageChange={handleCurrentPageChange} handleCurrentCityChange={handleCurrentCityChange}/>)}
      </Container>
    </ThemeProvider>
  );
};
export default App;