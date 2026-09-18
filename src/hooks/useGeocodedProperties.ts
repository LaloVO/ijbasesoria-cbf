import { useEffect, useMemo, useState } from "react";
import { CBFProperty } from "@/lib/cbf";

const geocodeCache = new Map<string, { lat: number; lng: number } | null>();

async function geocode(query: string, mapboxToken: string) {
  if (geocodeCache.has(query)) return geocodeCache.get(query) ?? null;

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1&country=mx`
    );
    if (!response.ok) {
      geocodeCache.set(query, null);
      return null;
    }
    const payload = await response.json();
    const center = payload.features?.[0]?.center;
    if (!Array.isArray(center) || center.length < 2) {
      geocodeCache.set(query, null);
      return null;
    }
    const result = { lng: Number(center[0]), lat: Number(center[1]) };
    geocodeCache.set(query, result);
    return result;
  } catch {
    geocodeCache.set(query, null);
    return null;
  }
}

function addressQuery(property: CBFProperty) {
  const parts = [property.colonia, property.ciudad_nombre, property.estado_nombre]
    .filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index);
  return parts.length > 0 ? `${parts.join(", ")}, México` : null;
}

export function useGeocodedProperties<T extends CBFProperty>(properties: T[], mapboxToken: string): T[] {
  const [resolved, setResolved] = useState<Record<string, { lat: number; lng: number }>>({});
  const missing = useMemo(
    () => properties.filter((property) =>
      (property.latitud == null || property.longitud == null) && addressQuery(property)
    ),
    [properties]
  );
  const missingKey = missing.map((property) => property.id).join(",");

  useEffect(() => {
    if (!mapboxToken || missing.length === 0) return;
    let cancelled = false;

    void Promise.all(missing.map(async (property) => {
      const query = addressQuery(property);
      if (!query) return null;
      const coordinates = await geocode(query, mapboxToken);
      return coordinates ? ([String(property.id), coordinates] as const) : null;
    })).then((entries) => {
      if (cancelled) return;
      const next: Record<string, { lat: number; lng: number }> = {};
      entries.forEach((entry) => {
        if (entry) next[entry[0]] = entry[1];
      });
      if (Object.keys(next).length > 0) setResolved((current) => ({ ...current, ...next }));
    });

    return () => { cancelled = true; };
  }, [mapboxToken, missingKey, missing]);

  // Memoizado: sin esto la identidad del array cambia en cada render y el mapa
  // destruye y recrea todos los markers una y otra vez (los clicks se pierden).
  return useMemo(
    () =>
      properties.map((property) => {
        if (property.latitud != null && property.longitud != null) return property;
        const coordinates = resolved[String(property.id)];
        return coordinates
          ? { ...property, latitud: coordinates.lat, longitud: coordinates.lng }
          : property;
      }),
    [properties, resolved]
  );
}
