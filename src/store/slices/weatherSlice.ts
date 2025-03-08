// src/redux/weatherSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { WeatherState } from "../../types";

const API_KEY = "9291fa5ef6c916498ff17730d3bbb0f7"; // Your API key

const initialState: WeatherState = {
  current: {},
  loading: false,
  error: null,
};

// Helper function to get user's location
const getCurrentPosition = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        (error) => reject(new Error("Location access denied or unavailable"))
      );
    }
  });
};

// Function to get emoji based on weather description
const getWeatherEmoji = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("clear")) return "☀️";
  if (lowerDesc.includes("cloud")) return "☁️";
  if (lowerDesc.includes("rain")) return "🌧️";
  if (lowerDesc.includes("thunderstorm")) return "⛈️";
  if (lowerDesc.includes("drizzle")) return "🌦️";
  if (lowerDesc.includes("snow")) return "❄️";
  if (lowerDesc.includes("mist") || lowerDesc.includes("fog")) return "🌫️";
  return "🌍"; // Default emoji
};

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const { latitude, longitude } = await getCurrentPosition();

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();
      const emoji = getWeatherEmoji(data.weather[0].description);

      return {
        temperature: data.main.temp,
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        emoji: emoji, // Added emoji field
        location: {
          latitude,
          longitude,
          city: data.name,
          country: data.sys.country,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch weather data");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
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
