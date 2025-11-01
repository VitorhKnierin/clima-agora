import { useEffect, useState } from 'react';
import { getCityPhoto } from '../services/photoProvider';

export default function WeatherCard({ data }) {
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!data) return;

    // Envia name (ex.: "Bagé, BR") e coordenadas vindas do OpenWeather
    const cityObj = {
      name: data.city,               // "Bagé, BR" — o provider sanitiza internamente
      lat: data.coord?.lat,
      lon: data.coord?.lon,
    };

    getCityPhoto(cityObj).then(setPhoto);
  }, [data?.city, data?.coord?.lat, data?.coord?.lon]);

  if (!data) return null;

  const { city, temp, description, iconCode } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <div
      className="card"
      style={{
        backgroundImage: photo ? `url(${photo})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="overlay">
        <div className="city">{city}</div>
        <img src={iconUrl} alt={description} width={80} height={80} />
        <div className="temp">{temp}°C</div>
        <div className="desc">{description}</div>
      </div>
    </div>
  );
}
