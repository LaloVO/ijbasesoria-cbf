import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, CalendarCheck, ArrowUpRight, Building2, Layers, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDesarrollos } from '@/hooks/useDesarrollos';
import { useSiteUser } from '@/hooks/useSiteUser';
import { formatPrice } from '@/lib/cbf';
import { cn } from '@/lib/utils';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';

function formatFechaEntrega(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}

const Desarrollos = () => {
  const { user } = useSiteUser();
  const { desarrollos, isLoading } = useDesarrollos();

  return (
    <>
      <Helmet>
        <title>Desarrollos y Preventas | {user?.nombre_usuario ?? 'IJB Asesoría Inmobiliaria'}</title>
        <meta
          name="description"
          content="Explora desarrollos en preventa e inversión inmobiliaria con acompañamiento jurídico e hipotecario en CDMX."
        />
      </Helmet>

      <Navbar />

      <main className="pt-28 min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 relative overflow-hidden">
        {/* Halos decorativos de fondo */}
        <div className="absolute top-10 left-[-10%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-[92%] md:w-[85%] max-w-7xl mx-auto relative z-10 text-left space-y-12">

          {/* Header Corporativo IJB */}
          <div className="max-w-3xl space-y-4">
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
              Desarrollos residenciales y proyectos de inversión.
            </h1>

            <p className="font-sans text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
              Catálogo exclusivo de desarrollos en preventa y construcción. Estructuración de proyectos inmobiliarios con dictamen jurídico y análisis de rentabilidad.
            </p>
          </div>

          {/* Loading skeletons */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse">
                  <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800" />
                  <div className="p-8 space-y-4">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-1/3" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && desarrollos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Building2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">
                  Próximos lanzamientos en dictamen
                </h3>
                <p className="font-sans text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Muy pronto verás publicados aquí nuevos desarrollos validados legalmente por IJB Asesoría.
                </p>
              </div>
              <Link
                to="/mapa"
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs uppercase tracking-widest font-sans font-extrabold hover:bg-primary/90 transition-all duration-300 rounded-full shadow-md"
              >
                Ver Mapa de Propiedades
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Grid de desarrollos */}
          {!isLoading && desarrollos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              {desarrollos.map((dev, i) => {
                const imagen = dev.imagenes_propiedades?.[0]?.image_url ?? FALLBACK_IMG;
                const verticals = dev.development_verticals ?? [];
                const entrega = formatFechaEntrega(dev.fecha_entrega);
                const featured = i === 0;

                return (
                  <Link
                    key={dev.id}
                    to={`/properties/${dev.id}`}
                    className={cn(
                      'group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl shadow-card hover:shadow-xl transition-all duration-500 block text-left',
                      featured ? 'md:col-span-6' : 'md:col-span-3'
                    )}
                  >
                    <div className={cn('grid', featured ? 'md:grid-cols-12' : 'grid-cols-1')}>
                      <div className={cn('relative overflow-hidden', featured ? 'md:col-span-7 aspect-[16/10] md:aspect-auto md:h-full' : 'aspect-[16/10]')}>
                        <img
                          src={imagen}
                          alt={dev.nombre}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG; }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/20" />
                      </div>

                      <div className={cn('p-7 md:p-8 flex flex-col justify-between gap-6', featured ? 'md:col-span-5' : '')}>
                        <div className="space-y-4">
                          <h2
                            className={cn(
                              'font-sans font-extrabold text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors duration-300',
                              featured ? 'text-2xl sm:text-3xl' : 'text-xl'
                            )}
                          >
                            {dev.nombre}
                          </h2>

                          {(dev.tipo || verticals.length > 0) && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {dev.tipo && (
                                <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-sans font-extrabold px-3 py-1.5 rounded-full border border-slate-700">
                                  {dev.tipo}
                                </span>
                              )}
                              {verticals.slice(0, 2).map((v) => (
                                <span
                                  key={v}
                                  className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest font-sans font-extrabold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full"
                                >
                                  <Layers className="w-2.5 h-2.5" />
                                  {v}
                                </span>
                              ))}
                            </div>
                          )}

                          {dev.descripcion && (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans font-normal leading-relaxed line-clamp-2">
                              {dev.descripcion}
                            </p>
                          )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {(dev.ciudad_nombre || dev.estado_nombre) && (
                              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans font-bold">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {dev.ciudad_nombre ?? dev.estado_nombre}
                              </span>
                            )}
                            {entrega && (
                              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans font-bold">
                                <CalendarCheck className="w-3.5 h-3.5 text-primary" />
                                Entrega {entrega}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div>
                              {dev.fromPrice != null ? (
                                <p className="font-sans font-extrabold text-primary text-base md:text-lg">
                                  Desde {formatPrice(dev.fromPrice)}
                                </p>
                              ) : (
                                <p className="font-sans text-xs text-slate-400 uppercase tracking-widest font-bold">Precio a consultar</p>
                              )}
                              {dev.unitCount > 0 && (
                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                                  {dev.unitCount} {dev.unitCount === 1 ? 'unidad disponible' : 'unidades disponibles'}
                                </p>
                              )}
                            </div>

                            <span className="flex items-center gap-1 text-primary text-xs uppercase tracking-widest font-sans font-extrabold group-hover:translate-x-0.5 transition-transform duration-300 shrink-0">
                              <span>Ver Proyecto</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Desarrollos;
