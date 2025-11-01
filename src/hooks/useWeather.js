// Hook personalizado que centraliza a lógica de busca do clima
// Aplica o princípio SRP: cada parte do código tem uma responsabilidade clara

import { useCallback, useState } from 'react';
import { getWeatherByCity, getWeatherByCoords } from '../services';

export function useWeather() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Função responsável por chamar a API de clima
  // Usa useCallback para evitar recriação desnecessária
  const fetchWeather = useCallback(async (cityArg) => {
    try {
      setError('');
      setLoading(true);
      let result;

      // Verifica se o argumento é coordenada ou nome
      if (cityArg && typeof cityArg === 'object' && cityArg.lat && cityArg.lon) {
        result = await getWeatherByCoords(cityArg.lat, cityArg.lon);
      } else if (cityArg && typeof cityArg === 'object' && cityArg.name) {
        result = await getWeatherByCity(cityArg.name);
      } else {
        result = await getWeatherByCity(String(cityArg || ''));
      }

      setData(result);
    } catch (err) {
      console.log('[DEBUG] Erro ao buscar clima:', err);
      setError(err.message || 'Erro inesperado');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, fetchWeather };
}