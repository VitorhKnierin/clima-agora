const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE = 'https://api.openweathermap.org/geo/1.0/direct';

export async function searchCities(query) {
  if (!query.trim()) return [];
  const url = `${BASE}?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.map(c => ({
    name: c.name,
    state: c.state || '',
    country: c.country || '',
    lat: c.lat,
    lon: c.lon
  }));
}