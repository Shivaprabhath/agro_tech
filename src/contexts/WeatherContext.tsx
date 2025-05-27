
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  fetchWeatherForecast, 
  fetchWeatherForecastByCoords,
  checkIrregularWeather, 
  storeWeatherAlert,
  sendSmsNotification,
  WeatherForecast,
  WeatherAlert
} from "@/services/weatherService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface WeatherContextType {
  forecast: WeatherForecast | null;
  loading: boolean;
  error: string | null;
  city: string;
  setCity: (city: string) => void;
  alerts: WeatherAlert[];
  refreshForecast: () => Promise<void>;
  phoneNumber: string;
  setPhoneNumber: (number: string) => void;
  smsEnabled: boolean;
  setSmsEnabled: (enabled: boolean) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("London");
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [smsEnabled, setSmsEnabled] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const checkAndProcessAlerts = (weatherData: WeatherForecast) => {
    const newAlerts: WeatherAlert[] = [];
    
    weatherData.list.forEach((item) => {
      const alertMessage = checkIrregularWeather(item);
      
      if (alertMessage) {
        const date = new Date(item.dt * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formattedDate = date.toLocaleDateString();
        
        const alertDescription = `${formattedDate} ${formattedTime}: ${alertMessage}`;
        
        // Store alert and add to state
        storeWeatherAlert(weatherData.city.name, item.weather[0].main, alertDescription)
          .then((alert) => {
            setAlerts(prev => [...prev, alert]);
            
            // Show toast notification for each new alert
            toast({
              title: `Weather Alert for ${weatherData.city.name}`,
              description: alertDescription,
              variant: "destructive",
            });
            
            // Send SMS if enabled
            if (smsEnabled && phoneNumber) {
              sendSmsNotification(
                phoneNumber, 
                weatherData.city.name, 
                alertDescription
              );
            }
          })
          .catch(err => console.error("Failed to store alert:", err));
      }
    });

    return newAlerts;
  };

  const refreshForecast = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      if (user?.locationString) {
        // First try using the location string if available
        data = await fetchWeatherForecast(user.locationString);
      } else if (user?.location?.coordinates && 
          Array.isArray(user.location.coordinates) && 
          user.location.coordinates.length === 2) {
        // Fall back to coordinates if available
        const [longitude, latitude] = user.location.coordinates;
        data = await fetchWeatherForecastByCoords(latitude, longitude);
      } else if (city) {
        // Fall back to the city name if no other location data is available
        data = await fetchWeatherForecast(city);
      } else {
        throw new Error("No location data available");
      }

      setForecast(data);
      checkAndProcessAlerts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshForecast();
    
    const intervalId = setInterval(refreshForecast, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [city, user?.location]);

  const value = {
    forecast,
    loading,
    error,
    city,
    setCity,
    alerts,
    refreshForecast,
    phoneNumber,
    setPhoneNumber,
    smsEnabled,
    setSmsEnabled
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};
