import { Sun, CloudSun, Cloud, CloudRain, CloudLightning, CloudFog } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  className?: string;
}

export function WeatherIcon({ condition, className = 'w-5 h-5 text-neutral-800' }: WeatherIconProps) {
  switch (condition) {
    case 'sunny':
      return <Sun className={className} />;
    case 'partly_cloudy':
      return <CloudSun className={className} />;
    case 'cloudy':
      return <Cloud className={className} />;
    case 'rainy':
    case 'heavy_rain':
      return <CloudRain className={className} />;
    case 'thunderstorm':
      return <CloudLightning className={className} />;
    case 'foggy':
      return <CloudFog className={className} />;
    default:
      return <CloudSun className={className} />;
  }
}
