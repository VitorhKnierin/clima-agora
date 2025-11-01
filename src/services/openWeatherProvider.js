const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city) {
  if (!API_KEY) throw new Error('API key ausente.');
  const url = `${BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
  return fetchAndNormalize(url);
}

export async function getWeatherByCoords(lat, lon) {
  if (!API_KEY) throw new Error('API key ausente.');
  const url = `${BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
  return fetchAndNormalize(url);
}

async function fetchAndNormalize(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    console.error('Erro OpenWeather:', res.status, text);
    throw new Error(`Falha ao buscar clima: ${res.status}`);
  }
  const json = await res.json();
  return {
    city: `${json.name}, ${json.sys?.country ?? ''}`.trim(),
    temp: Math.round(json.main?.temp),
    description: json.weather?.[0]?.description ?? 'N/D',
    iconCode: json.weather?.[0]?.icon ?? '01d',
    coord: { lat: json.coord?.lat, lon: json.coord?.lon },
  };
}
