import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="h-8 w-8 text-yellow-500" />;
  if (code >= 1 && code <= 3) return <Cloud className="h-8 w-8 text-muted-foreground" />;
  if (code >= 51 && code <= 67) return <CloudRain className="h-8 w-8 text-blue-500" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="h-8 w-8 text-blue-300" />;
  if (code >= 80 && code <= 82) return <CloudRain className="h-8 w-8 text-blue-600" />;
  return <Cloud className="h-8 w-8 text-muted-foreground" />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 56 && code <= 57) return "Freezing drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 75) return "Snowfall";
  if (code === 77) return "Snow grains";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Pune coordinates
        const lat = 18.5204;
        const lon = 73.8567;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
        );
        
        if (!response.ok) throw new Error("Failed to fetch weather");
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
        });
      } catch (err) {
        setError("Unable to load weather");
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <Card className="glass-card overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-info/10 via-transparent to-primary/5" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/20 group-hover:scale-110 transition-transform duration-300">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {weather.temperature}
                </span>
                <span className="text-lg text-muted-foreground">°C</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {getWeatherDescription(weather.weatherCode)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground">
              <Droplets className="h-3.5 w-3.5 text-info" />
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-xs text-muted-foreground">
              <Wind className="h-3.5 w-3.5 text-accent" />
              <span className="font-medium">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Pune, Maharashtra</p>
        </div>
      </CardContent>
    </Card>
  );
};
