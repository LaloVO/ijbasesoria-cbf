const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) || "https://nxouqoyppkiqrhfzovny.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54b3Vxb3lwcGtpcXJoZnpvdm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3MDQxODMsImV4cCI6MjA5NDI4MDE4M30" +
  ".zDlAxuD-YISh93Y4CWTWuJJP9HAWlPru32MbAfc3dtA";

const restHeaders = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
});

export interface SellerInquiryPayload {
  advisor_user_id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  id_tipo_accion?: number;
  titulo_propiedad?: string;
  id_tipo_propiedad?: number;
  precio_propiedad?: number;
  id_estado?: number;
  id_ciudad?: number;
  estado_nombre?: string;
  ciudad_nombre?: string;
  codigo_postal?: string;
  colonia?: string;
  direccion?: string;
  referencias?: string;
  latitud?: number | null;
  longitud?: number | null;
  area_propiedad?: number;
  area_construida?: number;
  habitaciones_propiedad?: number;
  banios_propiedad?: number;
  estacionamientos_propiedad?: number;
  numero_plantas?: number;
  descripcion_propiedad?: string;
  descripcion_estado_propiedad?: string;
  descripcion_inversion_propiedad?: string;
  es_herencia?: boolean;
}

export async function uploadSellerFile(
  file: File,
  advisorId: string,
  bucket: "seller-inquiry-images" | "seller-inquiry-docs"
): Promise<string> {
  const sanitizedName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const path = `${advisorId}/${sanitizedName}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al subir archivo");
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export async function submitSellerInquiry(payload: SellerInquiryPayload): Promise<{ id: string }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/seller_inquiries`, {
    method: "POST",
    headers: restHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Error al enviar la solicitud");
  }

  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function insertSellerImages(
  inquiryId: string,
  images: { image_url: string; nombre_imagen: string; orden: number }[]
): Promise<void> {
  if (!images.length) return;
  const payload = images.map((img) => ({ id_seller_inquiry: inquiryId, ...img }));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/seller_inquiry_images`, {
    method: "POST",
    headers: restHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al guardar imágenes");
}

export async function insertSellerDocuments(
  inquiryId: string,
  docs: { nombre_documento: string; file_url: string; required: boolean }[]
): Promise<void> {
  if (!docs.length) return;
  const payload = docs.map((d) => ({ id_seller_inquiry: inquiryId, ...d }));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/seller_inquiry_documents`, {
    method: "POST",
    headers: restHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al guardar documentos");
}

export async function insertSellerAmenidades(
  inquiryId: string,
  amenidadIds: number[]
): Promise<void> {
  if (!amenidadIds.length) return;
  const payload = amenidadIds.map((id) => ({ id_seller_inquiry: inquiryId, id_amenidad: id }));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/seller_inquiry_amenidades`, {
    method: "POST",
    headers: restHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al guardar amenidades");
}

export async function fetchEstados(): Promise<{ id_estado: number; nombre_estado: string }[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/estados?select=id_estado,nombre_estado&order=nombre_estado`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCiudadesByEstado(
  idEstado: number
): Promise<{ id_ciudad: number; nombre_ciudad: string }[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/ciudades?select=id_ciudad,nombre_ciudad&id_estado=eq.${idEstado}&order=nombre_ciudad`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAmenidades(): Promise<
  { id_amenidad: number; nombre_amenidad: string }[]
> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/amenidades?select=id_amenidad,nombre_amenidad&order=nombre_amenidad`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  if (!res.ok) return [];
  return res.json();
}

export async function geocodeAddress(
  direccion: string,
  ciudad: string,
  estado: string,
  mapboxToken: string
): Promise<{ lat: number; lng: number } | null> {
  if (!mapboxToken || !direccion) return null;
  try {
    const query = encodeURIComponent(`${direccion}, ${ciudad}, ${estado}, México`);
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxToken}&limit=1&country=mx`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const [lng, lat] = feature.center;
    return { lat, lng };
  } catch {
    return null;
  }
}
