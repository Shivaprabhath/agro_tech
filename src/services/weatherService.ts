import { toast } from "@/hooks/use-toast";

export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface WeatherForecast {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherData[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface WeatherAlert {
  id: string;
  city: string;
  condition: string;
  description: string;
  timestamp: string;
  read: boolean;
}

// OpenWeatherMap API Key
const API_KEY = "c17516d078812be0a1975acab68acb44";

export const fetchWeatherForecast = async (
  city: string
): Promise<WeatherForecast> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&cnt=17`
    );

    if (!response.ok) {
      throw new Error(`Weather data fetch failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchWeatherForecastByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherForecast> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&cnt=17`
    );

    if (!response.ok) {
      throw new Error(`Weather data fetch failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const checkIrregularWeather = (
  weatherData: WeatherData
): string | null => {
  // Check for irregular weather conditions
  const weather = weatherData.weather[0];

  if (weather.main === "Rain" && weather.description.includes("heavy")) {
    return `Heavy rain expected: ${weather.description}`;
  }

  if (weather.main === "Thunderstorm") {
    return `Thunderstorm expected: ${weather.description}`;
  }

  if (weather.main === "Snow") {
    return `Snow expected: ${weather.description}`;
  }

  if (weatherData.wind.speed > 10) {
    return `Extreme wind expected: ${weatherData.wind.speed} m/s`;
  }

  if (weatherData.main.temp > 35) {
    return `High temperature expected: ${weatherData.main.temp}°C`;
  }

  if (weatherData.main.temp < 5) {
    return `Low temperature expected: ${weatherData.main.temp}°C`;
  }

  return null;
};

// Mock function for sending SMS notifications
// In a real app, this would integrate with Twilio or another SMS service
export const sendSmsNotification = async (
  phoneNumber: string,
  city: string,
  alertMessage: string
): Promise<boolean> => {
  console.log(
    `SMS notification would be sent to ${phoneNumber} for ${city}: ${alertMessage}`
  );
  toast({
    title: "SMS Notification",
    description: `Would send SMS to ${phoneNumber}: ${alertMessage}`,
  });
  return true;
};

// Function to store alerts in MongoDB
export const storeWeatherAlert = async (
  city: string,
  condition: string,
  description: string
): Promise<WeatherAlert> => {
  try {
    const alertData = {
      city,
      condition,
      description,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // In a real implementation, this would be a call to your backend API
    console.log("Store weather alert:", alertData);

    // For now, return a mock response with a generated ID
    return {
      ...alertData,
      id: `alert-${Date.now()}`,
    };
  } catch (error) {
    console.error("Error storing weather alert:", error);
    throw error;
  }
};
