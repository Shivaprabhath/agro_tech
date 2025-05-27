import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useWeather } from "@/contexts/WeatherContext";
import WeatherCard from "@/components/weather/WeatherCard";
import WeatherAlerts from "@/components/weather/WeatherAlerts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cloud, RefreshCw, MapPin, Search, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

const Weather: React.FC = () => {
  const { t } = useTranslation();
  const {
    forecast,
    loading,
    error,
    city,
    setCity,
    refreshForecast,
    phoneNumber,
    setPhoneNumber,
    smsEnabled,
    setSmsEnabled,
  } = useWeather();

  const [searchInput, setSearchInput] = useState(city);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput.trim());
    }
  };

  const groupedForecast = React.useMemo(() => {
    if (!forecast?.list) return [];

    return forecast.list.reduce((groups, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {} as Record<string, typeof forecast.list>);
  }, [forecast]);

  return (
    <Layout>
      <div className="bg-neutral dark:bg-gray-900 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('weather.title')}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t('weather.subtitle')}
              </p>
            </div>
            <WeatherAlerts />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-10">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 mb-6"
            >
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('weather.searchPlaceholder')}
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" className="flex items-center gap-2">
                <Search className="h-4 w-4" /> {t('weather.search')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => refreshForecast()}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                {t('weather.refresh')}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t('weather.notificationSettings')}</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sms-notifications"
                    checked={smsEnabled}
                    onCheckedChange={setSmsEnabled}
                  />
                  <Label htmlFor="sms-notifications">{t('weather.smsNotifications')}</Label>
                </div>

                {smsEnabled && (
                  <div className="relative flex-grow">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone-number"
                      placeholder={t('weather.phoneNumber')}
                      className="pl-9"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-lg">Loading forecast data...</p>
              </div>
            </div>
          ) : forecast ? (
            <div className="space-y-8">
              {Object.entries(groupedForecast).map(([date, items]) => (
                <div key={date}>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Cloud className="mr-2 h-6 w-6" />
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <WeatherCard key={item.dt} data={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-2">
                {t('weather.noForecast')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('weather.noForecastMessage')}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Weather;
