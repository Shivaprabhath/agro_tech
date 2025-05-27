
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData } from "@/services/weatherService";
import { 
  Cloud, 
  CloudDrizzle, 
  CloudLightning, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Wind,
  Thermometer,
  Droplets
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const day = date.toLocaleDateString(undefined, { weekday: 'short' });
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const temp = Math.round(data.main.temp);
  const weatherType = data.weather[0].main;
  const description = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  
  // Determine if this weather represents irregular conditions
  const isIrregular = 
    (weatherType === 'Rain' && description.includes('heavy')) ||
    weatherType === 'Thunderstorm' ||
    weatherType === 'Snow' ||
    windSpeed > 10 ||
    temp > 35 ||
    temp < 5;

  // Weather icon based on condition
  const getWeatherIcon = () => {
    switch (weatherType) {
      case 'Clear':
        return <Sun size={24} className="text-yellow-500" />;
      case 'Clouds':
        return <Cloud size={24} className="text-gray-500" />;
      case 'Rain':
        return description.includes('heavy') 
          ? <CloudRain size={24} className="text-blue-600" /> 
          : <CloudDrizzle size={24} className="text-blue-400" />;
      case 'Thunderstorm':
        return <CloudLightning size={24} className="text-purple-500" />;
      case 'Snow':
        return <CloudSnow size={24} className="text-blue-200" />;
      default:
        return <Cloud size={24} className="text-gray-400" />;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all ${isIrregular ? 'border-red-500 dark:border-red-700' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">
            {day}, {time}
          </div>
          {isIrregular && (
            <Badge variant="destructive" className="text-xs">
              Alert
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-muted p-2 rounded-full">
            {getWeatherIcon()}
          </div>
          <div>
            <div className="text-2xl font-bold">{temp}°C</div>
            <div className="text-sm capitalize text-muted-foreground">{description}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Droplets size={16} className="mr-1 text-blue-500" />
            <span>{humidity}% humidity</span>
          </div>
          <div className="flex items-center">
            <Wind size={16} className="mr-1 text-gray-500" />
            <span>{windSpeed} m/s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
