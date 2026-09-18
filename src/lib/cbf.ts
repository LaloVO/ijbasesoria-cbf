const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_CBF_API_URL as string;
  if (envUrl && envUrl.trim() !== "" && envUrl.trim() !== "undefined") {
    return envUrl.trim();
  }
  
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:3000/api/cbf";
    }
  }
  return "https://homepty-cbf-tite-testing-chi.vercel.app/api/cbf"; // fallback producción
};

const BASE_URL = getBaseUrl();
const API_KEY = (import.meta.env.VITE_CBF_API_KEY as string) || "cbf_live_PENDING_UUID";

export interface CBFImage {
  image_url: string;
}

export interface CBFAmenity {
  id?: number;
  id_amenidad: number;
  amenidades?: { nombre_amenidad?: string | null } | null;
}

export interface CBFTaxonomyEntry {
  vertical_id?: number | null;
  vertical_name?: string | null;
  segment_ids?: number[];
  segment_names?: string[];
  tipologia_ids?: number[];
  tipologia_names?: string[];
  subsegment_ids?: number[];
  subsegment_names?: string[];
}

export interface CBFTaxonomySubsegment {
  id: number;
  segmentId: number;
  nombre: string;
}

export interface CBFTaxonomySegment {
  id: number;
  verticalId: number;
  nombre: string;
  subsegments: CBFTaxonomySubsegment[];
}

export interface CBFTaxonomyTipologia {
  id: number;
  verticalId: number;
  nombre: string;
}

export interface CBFTaxonomyVertical {
  id: number;
  nombre: string;
  icono?: string | null;
  segments: CBFTaxonomySegment[];
  tipologias: CBFTaxonomyTipologia[];
}

export interface CBFTaxonomyTree {
  verticals: CBFTaxonomyVertical[];
}

export interface CBFProperty {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo?: string;
  precio: number;
  moneda?: string | null;
  area?: number;
  area_construida?: number;
  dimension_terreno?: number | null;
  habitaciones?: number;
  banios?: number;
  medios_banios?: number | null;
  estacionamientos?: number;
  numero_pisos?: number | null;
  nivel_piso?: number | null;
  direccion?: string;
  colonia?: string;
  ciudad_nombre?: string;
  estado_nombre?: string;
  id_tipo_accion?: number;
  latitud?: number;
  longitud?: number;
  caracteristicas?: string;
  imagenes_propiedades?: CBFImage[];
  amenidades_propiedades?: CBFAmenity[];
  taxonomy_entries?: CBFTaxonomyEntry[] | null;
  // Campos de desarrollo
  is_unit?: boolean | null;
  parent_id?: number | null;
  development_verticals?: string[] | null;
  fecha_entrega?: string | null;
  fecha_inicio?: string | null;
  comision?: number | null;
  descripcion_estado?: string | null;
  descripcion_inversion?: string | null;
}

export interface CBFUser {
  id: string;
  nombre_usuario: string;
  email_usuario: string;
  telefono_usuario?: string;
  imagen_perfil_usuario?: string;
}

export interface CBFSite {
  id: string;
  site_name: string;
  subdomain?: string;
  theme_config?: { logo?: string; primaryColor?: string };
  platform_config?: { mapbox_token?: string | null };
}

const headers = () => {
  if (!BASE_URL || API_KEY === "cbf_live_PENDING_UUID") {
    throw new Error("La conexión CBF requiere configuración autorizada");
  }

  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
};

export async function fetchSiteUser(): Promise<{ user: CBFUser; site: CBFSite }> {
  const res = await fetch(`${BASE_URL}/user`, { headers: headers() });
  if (!res.ok) throw new Error("Error al cargar datos del sitio");
  const json = await res.json();
  return json.data;
}

export async function fetchTaxonomy(): Promise<CBFTaxonomyTree> {
  const res = await fetch(`${BASE_URL}/taxonomy`, { headers: headers() });
  if (!res.ok) throw new Error("Error al cargar taxonomía inmobiliaria");
  const json = await res.json();
  return json.data;
}

export async function fetchProperties(params?: {
  limit?: number;
  offset?: number;
  tipo?: string;
  id_tipo_accion?: number;
  is_unit?: boolean;
  parent_id?: string | number;
}): Promise<{ data: CBFProperty[]; pagination: { limit: number; offset: number; total: number } }> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.tipo) query.set("tipo", params.tipo);
  if (params?.id_tipo_accion !== undefined)
    query.set("id_tipo_accion", String(params.id_tipo_accion));
  if (params?.is_unit !== undefined)
    query.set("is_unit", String(params.is_unit));
  if (params?.parent_id !== undefined)
    query.set("parent_id", String(params.parent_id));

  const res = await fetch(`${BASE_URL}/properties?${query}`, { headers: headers() });
  if (!res.ok) throw new Error("Error al cargar propiedades");
  return res.json();
}

export async function fetchAllProperties(params?: {
  tipo?: string;
  id_tipo_accion?: number;
  is_unit?: boolean;
  parent_id?: string | number;
}): Promise<CBFProperty[]> {
  const all: CBFProperty[] = [];
  const limit = 100;
  let offset = 0;

  while (true) {
    const response = await fetchProperties({ ...params, limit, offset });
    const page = response.data ?? [];
    all.push(...page);

    const total = response.pagination?.total;
    if (page.length < limit || (typeof total === "number" && all.length >= total)) break;
    offset += page.length;
  }

  return all;
}

export async function fetchProperty(id: string): Promise<CBFProperty> {
  const res = await fetch(`${BASE_URL}/properties/${id}`, { headers: headers() });
  if (!res.ok) throw new Error("Propiedad no encontrada");
  const json = await res.json();
  return json.data ?? json;
}

export function formatPrice(precio: number, moneda: string = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: moneda || "MXN",
    maximumFractionDigits: 0,
  }).format(precio);
}

export interface LeadSubmission {
  nombre_completo: string;
  email: string;
  telefono: string;
  tipo_operacion: "compra" | "renta";
  tipo_propiedad: string;
  num_habitaciones?: string;
  num_banos?: string;
  num_estacionamientos?: string;
  metros_cuadrados_min?: string;
  metros_cuadrados_max?: string;
  estados_deseados: string[];
  ciudades_deseadas?: string[];
  zonas_especificas?: string;
  estilo_vida_descripcion: string;
  presupuesto_min: string;
  presupuesto_max: string;
  metodo_pago: string[];
  tiene_precalificacion_crediticia?: boolean;
  institucion_crediticia?: string;
  uso_destino: "vivienda_propia" | "inversion" | "negocio" | "vacacional" | "otro";
  detalles_uso?: string;
  documentos_disponibles?: string[];
  documentos_urls?: Record<string, string>;
  cita_virtual_solicitada?: boolean;
  cita_virtual_fecha_hora?: string;
}

export async function submitLead(lead: LeadSubmission): Promise<{ success: boolean; data: unknown }> {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || "Error al enviar la solicitud de búsqueda inteligente");
  }
  return res.json();
}

export async function fetchBusySlots(): Promise<Array<{ start: string; end: string }>> {
  const res = await fetch(`${BASE_URL}/calendar/busy-slots`, { headers: headers() });
  if (!res.ok) throw new Error("Error al cargar horarios ocupados");
  const json = await res.json();
  return json.busySlots || [];
}

export interface CBFPost {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  post_type: "post" | "blog";
  created_at: string;
  property?: CBFProperty | null;
}

export async function fetchPosts(params?: {
  post_type?: "post" | "blog";
  limit?: number;
}): Promise<{ data: CBFPost[] }> {
  const query = new URLSearchParams();
  if (params?.post_type) query.set("post_type", params.post_type);
  if (params?.limit) query.set("limit", String(params.limit));

  const res = await fetch(`${BASE_URL}/posts?${query}`, { headers: headers() });
  if (!res.ok) throw new Error("Error al cargar posts");
  return res.json();
}

export function actionLabel(id?: number): string {
  const map: Record<number, string> = {
    1: "Venta",
    2: "Renta",
    3: "Traspaso",
    4: "Pre-Venta",
    5: "Aportación",
    6: "Remate",
    7: "Permuta",
  };
  return id ? (map[id] ?? "Venta") : "Venta";
}

export function normalizeWhatsAppNumber(value?: string): string {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (digits.length === 10) return `52${digits}`;
  if (digits.startsWith("521") && digits.length === 13) return `52${digits.slice(3)}`;
  return digits;
}

export function buildWhatsAppUrl(phone?: string, message?: string): string {
  const number = normalizeWhatsAppNumber(phone);
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return number ? `https://wa.me/${number}${query}` : "https://wa.me/";
}

export interface ValuationRequest {
  lat: number;
  lon: number;
  direccion: string;
  tipo_inmueble?: number;
  superficie_construida?: number;
  tamano_terreno?: number;
  habitaciones?: number;
  banos?: number;
  estacionamientos?: number;
  vivienda_nueva_usada?: "Nueva" | "Usada";
  antiguedad_anos?: number;
  estado_conservacion?: "malo" | "regular" | "bueno" | "excelente";
  radius?: number;
  clase_inmueble?: number;
  cvegeo?: string;
}

export interface ValuationExplanation {
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  riskFactors: string[];
  opportunities: string[];
  confidence: number;
}

export interface ValuationResult {
  valor: number;
  valor_m2: number | null;
  rango: [number, number];
  confidence: number;
  explanation: ValuationExplanation | null;
  comparables: number;
  status: "estimated" | "insufficient_comparables";
  search_params?: Record<string, unknown>;
}

export interface ValuationResponse {
  success: boolean;
  data?: ValuationResult;
  code?: "INSUFFICIENT_COMPARABLES";
  message?: string;
  comparableCount?: number;
  suggestedNextSteps?: string[];
}

export async function submitValuation(request: ValuationRequest): Promise<ValuationResponse> {
  const res = await fetch(`${BASE_URL}/intelligence/valuation`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || "Error al obtener la valuación");
  }

  return res.json();
}
