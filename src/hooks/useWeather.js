// src/hooks/useWeather.js
import { useCallback, useState } from 'react';
import { getWeatherByCity, getWeatherByCoords } from '../services';

export function useWeather() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const fetchWeather = useCallback(async (cityArg) => {
    try {
      setError('');
      setLoading(true);

      let result;
      if (cityArg && typeof cityArg === 'object' && cityArg.lat && cityArg.lon) {
        // Busca por coordenadas
        result = await getWeatherByCoords(cityArg.lat, cityArg.lon);
      } else if (cityArg && typeof cityArg === 'object' && cityArg.name) {
        // Busca pelo nome
        result = await getWeatherByCity(cityArg.name);
      } else {
        result = await getWeatherByCity(String(cityArg || ''));
      }

      setData(result);
    } catch (err) {
      console.log('[DEBUG] fetchWeather error:', err);
      setError(err.message || 'Erro inesperado');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, fetchWeather };
}
