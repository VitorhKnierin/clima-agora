// src/services/index.js
// Aqui escolhemos qual provider concreto usar. Para trocar a fonte,
// basta alterar a importação abaixo (não mexe no resto da app):
export { getWeatherByCity, getWeatherByCoords } from './openWeatherProvider';