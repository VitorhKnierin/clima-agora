// src/services/IWeatherProvider.js
// Contrato informal: qualquer provedor deve exportar getWeatherByCity(city)
// e retornar um objeto padronizado:
// { city, temp, description, iconCode }


export async function getWeatherByCity(_city) {
throw new Error('Não implemente aqui. Use um provider concreto (ex.: openWeatherProvider).');
}