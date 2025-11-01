import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { useWeather } from './hooks/useWeather';
import { useEffect, useState } from 'react';
import { getCityPhoto } from './services/photoProvider';

export default function App() {
  const { data, loading, error, fetchWeather } = useWeather();
  const [bgPhoto, setBgPhoto] = useState(null);

  // atualiza o fundo quando a cidade muda
  useEffect(() => {
    if (!data) return;
    const cityObj = { name: data.city, lat: data.coord?.lat, lon: data.coord?.lon };
    getCityPhoto(cityObj).then(setBgPhoto);
  }, [data?.city, data?.coord?.lat, data?.coord?.lon]);

  return (
    <div
      className="page"
      style={{
        backgroundImage: bgPhoto ? `url(${bgPhoto})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transition: 'background-image .6s ease-in-out'
      }}
    >
      <div className="page-overlay">
        <div className="content">
          <h1>Clima Agora</h1>

          <SearchBar onSearch={fetchWeather} />

          {loading && <p>Carregando...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && <WeatherCard data={data} />}

          <footer>
            <small>Fonte: OpenWeatherMap • Projeto Implementação de Software — React + SOLID</small>
          </footer>
        </div>
      </div>
    </div>
  );
}
