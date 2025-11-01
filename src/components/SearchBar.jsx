import { useState, useEffect } from 'react';
import { searchCities } from '../services/geoProvider';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length > 2) {
        const results = await searchCities(query);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
      setSelected(null);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  function handleSelect(city) {
    const label = [city.name, city.state, city.country].filter(Boolean).join(' - ');
    setQuery(label);
    setSuggestions([]);
    setSelected(city);
    onSearch(city); // envia objeto completo com {name,state,country,lat,lon}
  }

  return (
    <div className="search" style={{ position: 'relative' }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite a cidade..."
        aria-label="Cidade"
      />
      <button onClick={() => onSearch(selected ?? { name: query })}>
        Buscar
      </button>

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((c, i) => (
            <li key={i} onClick={() => handleSelect(c)}>
              {c.name}{c.state ? ` - ${c.state}` : ''}, {c.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
