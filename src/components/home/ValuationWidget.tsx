import { useState, type FormEvent } from 'react';
import { AlertCircle, Bath, Bed, Car, Loader2, MapPin, RotateCcw, Sparkles, Square, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteUser } from '@/hooks/useSiteUser';
import { formatPrice, submitValuation, type ValuationResult } from '@/lib/cbf';

const TIPO_OPTIONS = [
  { value: 2, label: 'Casa' },
  { value: 3, label: 'Casa en Condominio' },
  { value: 4, label: 'Departamento' },
];

const CONSERVACION_OPTIONS = [
  { value: 'malo', label: 'Malo' },
  { value: 'regular', label: 'Regular' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'excelente', label: 'Excelente' },
] as const;

const CONFIDENCE_LABEL: Record<number, string> = {
  0.2: 'Baja',
  0.4: 'Media-baja',
  0.65: 'Media',
  0.85: 'Alta',
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-900';

const ValuationWidget = () => {
  const { site } = useSiteUser();
  const mapboxToken = (site?.platform_config?.mapbox_token ?? '').trim();
  const [direccion, setDireccion] = useState('');
  const [tipo, setTipo] = useState(4);
  const [superficie, setSuperficie] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [banos, setBanos] = useState('');
  const [estacionamientos, setEstacionamientos] = useState('');
  const [conservacion, setConservacion] = useState<'malo' | 'regular' | 'bueno' | 'excelente'>('bueno');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [result, setResult] = useState<ValuationResult | null>(null);

  const geocode = async (query: string) => {
    if (!mapboxToken) {
      setGeoError('El mapa no está disponible en este momento.');
      return null;
    }

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&limit=1&types=neighborhood,locality,place,address&country=mx`
    );
    if (!response.ok) return null;
    const payload = await response.json();
    const center = payload.features?.[0]?.center;
    return Array.isArray(center) ? { lon: Number(center[0]), lat: Number(center[1]) } : null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setGeoError(null);
    setResult(null);

    if (!direccion.trim()) {
      setError('Escribe una colonia o zona para ubicar la propiedad.');
      return;
    }

    setLoading(true);
    try {
      const coordinates = await geocode(direccion.trim());
      if (!coordinates) {
        setError('No pudimos ubicar esa zona. Prueba con una colonia o ciudad más específica.');
        return;
      }

      const response = await submitValuation({
        ...coordinates,
        direccion: direccion.trim(),
        tipo_inmueble: tipo,
        superficie_construida: superficie ? Number(superficie) : undefined,
        habitaciones: habitaciones ? Number(habitaciones) : undefined,
        banos: banos ? Number(banos) : undefined,
        estacionamientos: estacionamientos ? Number(estacionamientos) : undefined,
        estado_conservacion: conservacion,
      });

      if (!response.success || !response.data) {
        setError(response.message ?? 'No hay suficientes comparables en esa zona para estimar con calidad. Prueba con una zona más céntrica.');
        return;
      }
      setResult(response.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Ocurrió un error al obtener la valuación.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setGeoError(null);
  };

  return (
    <section className="border-t border-slate-200 bg-slate-50 px-4 py-20 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-5">
          <h2 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
            ¿Cuánto vale tu <span className="text-primary">propiedad</span>?
          </h2>
          <p className="text-base leading-relaxed text-slate-600">
            Estimación inteligente con análisis de avalúos comparables de la zona, calibración de mercado y explicación generada por inteligencia artificial.
          </p>
          <div className="flex items-start gap-3 text-sm text-slate-500">
            <TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" />
            <p>El valor estimado es una referencia de mercado, no una valuación formal. Para una tasación certificada, contáctanos.</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-elegant md:p-8">
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Zona o colonia</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" />
                    <input className={`${inputClass} pl-11`} placeholder="Ej. Polanco, Ciudad de México" value={direccion} onChange={(event) => setDireccion(event.target.value)} disabled={loading} />
                  </div>
                  {geoError && <p className="mt-1 text-xs text-red-600">{geoError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>Tipo</label>
                    <select className={inputClass} value={tipo} onChange={(event) => setTipo(Number(event.target.value))} disabled={loading}>
                      {TIPO_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Conservación</label>
                    <select className={inputClass} value={conservacion} onChange={(event) => setConservacion(event.target.value as typeof conservacion)} disabled={loading}>
                      {CONSERVACION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </div>
                  <NumberField label="m² construidos" icon={<Square />} value={superficie} onChange={setSuperficie} placeholder="120" disabled={loading} min={1} />
                  <NumberField label="Habitaciones" icon={<Bed />} value={habitaciones} onChange={setHabitaciones} placeholder="3" disabled={loading} />
                  <NumberField label="Baños" icon={<Bath />} value={banos} onChange={setBanos} placeholder="2" disabled={loading} />
                  <NumberField label="Estacionamientos" icon={<Car />} value={estacionamientos} onChange={setEstacionamientos} placeholder="2" disabled={loading} />
                </div>

                {error && <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="mt-0.5 size-4 shrink-0" /><span>{error}</span></div>}

                <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary px-8 py-6 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-primary/90 disabled:opacity-60">
                  {loading ? <><Loader2 className="mr-2 size-4 animate-spin" /> Analizando mercado…</> : <><Sparkles className="mr-2 size-4" /> Estimar valor</>}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Valor estimado · {direccion}</p>
                    <p className="mt-2 text-4xl font-extrabold text-slate-900 md:text-5xl">{formatPrice(result.valor)}</p>
                    <p className="mt-1 text-sm text-slate-500">Rango: {formatPrice(result.rango[0])} – {formatPrice(result.rango[1])}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={reset} className="shrink-0 rounded-full" title="Nueva valuación"><RotateCcw className="size-4" /></Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                  <Metric label="Precio por m²" value={result.valor_m2 ? formatPrice(result.valor_m2) : '—'} />
                  <Metric label="Confianza" value={CONFIDENCE_LABEL[result.confidence] ?? 'Baja'} />
                  <Metric label="Comparables" value={String(result.comparables)} />
                </div>

                {result.explanation && (
                  <div className="space-y-4 rounded-2xl border border-primary/20 bg-slate-50 p-5">
                    <p className="text-sm leading-relaxed text-slate-700">{result.explanation.summary}</p>
                    {result.explanation.keyInsights.length > 0 && <ul className="space-y-2">{result.explanation.keyInsights.map((insight) => <li key={insight} className="flex items-start gap-2 text-sm text-slate-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{insight}</li>)}</ul>}
                    {result.explanation.recommendations.length > 0 && <div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900">Recomendaciones</p><ul className="space-y-2">{result.explanation.recommendations.map((recommendation) => <li key={recommendation} className="flex items-start gap-2 text-sm text-slate-600"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-900" />{recommendation}</li>)}</ul></div>}
                  </div>
                )}

                <p className="text-xs text-slate-400">Estimación generada con análisis de avalúos comparables y calibración de mercado. Referencia informativa, no constituye una valuación formal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const NumberField = ({ label, icon, value, onChange, placeholder, disabled, min = 0 }: { label: string; icon: React.ReactElement; value: string; onChange: (value: string) => void; placeholder: string; disabled: boolean; min?: number }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary [&>svg]:size-4">{icon}</span>
      <input className={`${inputClass} pl-11`} type="number" min={min} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} />
    </div>
  </div>
);

const Metric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-slate-50 px-4 py-3"><p className="text-xs text-slate-500">{label}</p><p className="font-bold text-slate-900">{value}</p></div>
);

export default ValuationWidget;
