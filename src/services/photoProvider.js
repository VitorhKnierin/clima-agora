// src/services/photoProvider.js
// Ordem de busca: Wikipedia (pt → en) por título → Wikimedia geosearch (lat/lon) → Pixabay (fallback)

const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_KEY;

// --------- Helpers ---------
function sanitizeTitle(label = "") {
  // Usa apenas o nome da cidade como título (sem país/estado), remove espaços extras.
  return String(label).split(",")[0].split(" - ")[0].trim();
}

// Wikipedia REST Summary por título (idioma pt ou en)
async function getFromWikipediaByTitle(label, lang = "pt") {
  if (!label) return null;
  const title = sanitizeTitle(label);
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  try {
    const res = await fetch(url, { headers: { "accept": "application/json" } });
    if (!res.ok) return null;
    const json = await res.json();
    // Preferência: original -> thumbnail
    const thumb = json?.originalimage?.source || json?.thumbnail?.source;
    return thumb || null;
  } catch {
    return null;
  }
}

// Wikimedia Commons por coordenadas (geosearch)
async function getFromWikimediaByGeo(lat, lon) {
  if (typeof lat !== "number" || typeof lon !== "number") return null;

  const url =
    `https://commons.wikimedia.org/w/api.php?` +
    `action=query&generator=geosearch&ggscoord=${lat}|${lon}` +
    `&ggsradius=15000&ggslimit=40&prop=pageimages|imageinfo` +
    `&iiprop=url&piprop=thumbnail|name&pithumbsize=1280&format=json&origin=*`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const pages = json?.query?.pages ? Object.values(json.query.pages) : [];
    // Ordena por largura do thumb (tende a pegar fotos melhores)
    const ordered = pages.sort((a, b) => (b?.thumbnail?.width || 0) - (a?.thumbnail?.width || 0));
    const pic = ordered.find(p => p?.thumbnail?.source || p?.imageinfo?.[0]?.url);
    return pic?.thumbnail?.source || pic?.imageinfo?.[0]?.url || null;
  } catch {
    return null;
  }
}

// Pixabay (fallback textual com enriquecimento)
async function getFromPixabay(label) {
  if (!PIXABAY_KEY || !label) return null;
  // Enriquecer a busca para fugir de ambiguidades (“Liberty”, “Bag” etc.)
  const enriched = `${sanitizeTitle(label)} cidade Brasil Rio Grande do Sul landscape skyline`;
  const url =
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(enriched)}` +
    `&image_type=photo&orientation=horizontal&category=places&per_page=12&safesearch=true`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const hit = json.hits?.[0];
    return hit?.largeImageURL || hit?.webformatURL || null;
  } catch {
    return null;
  }
}

// --------- API principal ---------
export async function getCityPhoto(cityArg) {
  // cityArg: { name, state?, country?, lat?, lon? } OU string
  let lat, lon, label;

  if (cityArg && typeof cityArg === "object") {
    lat = cityArg.lat;
    lon = cityArg.lon;
    // name pode vir “Bagé, BR” — tudo bem; vamos sanitizar dentro dos helpers
    label = cityArg.name || "";
  } else {
    label = String(cityArg || "");
  }

  // 1) Wikipedia PT pelo título da cidade (mais preciso e rápido)
  const wikiPT = await getFromWikipediaByTitle(label, "pt");
  if (wikiPT) return wikiPT;

  // 2) Tenta Wikipedia EN (caso a página PT não tenha thumbnail)
  const wikiEN = await getFromWikipediaByTitle(label, "en");
  if (wikiEN) return wikiEN;

  // 3) Wikimedia por coordenadas (excelente para cidade pequena)
  const wmGeo = await getFromWikimediaByGeo(lat, lon);
  if (wmGeo) return wmGeo;

  // 4) Fallback final: Pixabay textual enriquecido
  const pixa = await getFromPixabay(label);
  if (pixa) return pixa;

  // 5) Sem imagem
  return null;
}
