
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WeatherState } from '../../types';

const initialState: WeatherState = {
  current: {},
  loading: false,
  error: null,
};

// Helper function to get current location
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      // Get user's current location
      let position;
      try {
        position = await getCurrentPosition();
      } catch (error) {
        console.log('Geolocation error:', error);
        // Fallback to default location or mock data if location access denied
        return getFallbackWeatherData();
      }
      
      const { latitude, longitude } = position.coords;
      
      // For demo purposes, we'll simulate an API call with different temperature ranges
      // based on coordinates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate more realistic temperature based on latitude 
      // (cooler at high latitudes, warmer near equator)
      const latFactor = Math.abs(latitude) / 90; // 0 at equator, 1 at poles
      const baseTempRange = latFactor > 0.5 ? 
        { min: 0, max: 20 } : // cooler regions
        { min: 15, max: 35 };  // warmer regions
      
      const temperature = Math.floor(Math.random() * 
        (baseTempRange.max - baseTempRange.min)) + baseTempRange.min;
      
      // Choose condition based on latitude and random factor
      const weatherConditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];
      const conditionIndex = Math.floor(Math.random() * weatherConditions.length);
      const condition = weatherConditions[conditionIndex];
      
      console.log(`Weather fetched for location: ${latitude}, ${longitude}`);
      
      return {
        temperature,
        condition,
        icon: condition === 'sunny' ? '☀️' : 
              condition === 'partly cloudy' ? '⛅' : 
              condition === 'cloudy' ? '☁️' : 
              condition === 'rainy' ? '🌧️' : '⛈️',
        location: {
          latitude,
          longitude
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

// Fallback weather data
const getFallbackWeatherData = () => {
  const weatherConditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];
  const condition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
  const temperature = Math.floor(Math.random() * 30) + 10; // 10-40°C
  
  return {
    temperature,
    condition,
    icon: condition === 'sunny' ? '☀️' : 
          condition === 'partly cloudy' ? '⛅' : 
          condition === 'cloudy' ? '☁️' : 
          condition === 'rainy' ? '🌧️' : '⛈️',
    location: null
  };
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
