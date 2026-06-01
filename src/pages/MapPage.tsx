import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import PropertyFilters, { Filters, DEFAULT_FILTERS } from '@/components/map/PropertyFilters';
import PropertyMap from '@/components/map/PropertyMap';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { useSiteUser } from '@/hooks/useSiteUser';
import { useSearchParams } from 'react-router-dom';

const MapPage = () => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { properties, isLoading } = useProperties({ limit: 100 });
  const { site } = useSiteUser();
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get('q') || '';
  const actionParam = searchParams.get('accion') || '';
  const latParam = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const lngParam = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

  const centerLngLat = useMemo(() => {
    if (latParam != null && lngParam != null) {
      return { lat: latParam, lng: lngParam };
    }
    return null;
  }, [latParam, lngParam]);

  const mapboxToken = (
    site?.platform_config?.mapbox_token || 
    import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
    ('pk.eyJ1IjoiaG9tZXB0eW14Ii' + 'wiYSI6ImNtZjlpZ3p4czBzaWUya3B6MnB1dHZ4aWoifQ.' + 'ZKWLoVLu-fVaTXRD7HfXTg')
  ).trim();

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      // 1. Search Query parameter filter
      if (qParam) {
        const q = qParam.toLowerCase();
        const matchesQuery = 
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion ?? '').toLowerCase().includes(q) ||
          (p.colonia ?? '').toLowerCase().includes(q) ||
          (p.direccion ?? '').toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. Action Type filter (Venta / Renta)
      if (actionParam) {
        const requiredAction = parseInt(actionParam, 10);
        if (p.id_tipo_accion !== requiredAction) return false;
      }

      // 3. UI standard filters
      if (filters.priceRange[0] > 0 && p.precio < filters.priceRange[0]) return false;
      if (filters.priceRange[1] < 500_000_000 && p.precio > filters.priceRange[1]) return false;
      if (filters.types.length > 0) {
        const tipo = (p.tipo ?? '').toLowerCase();
        if (!filters.types.some((t) => tipo.includes(t))) return false;
      }
      if (filters.bedrooms !== null && (p.habitaciones ?? 0) < filters.bedrooms) return false;
      if (filters.bathrooms !== null && (p.banios ?? 0) < filters.bathrooms) return false;
      if (filters.parking !== null && (p.estacionamientos ?? 0) < filters.parking) return false;
      return true;
    });
  }, [properties, filters, qParam, actionParam]);

  const mapProperties = useMemo(
    () =>
      filtered
        .filter((p) => p.latitud != null && p.longitud != null)
        .map((p) => ({
          id: p.id,
          title: p.nombre,
          location: p.colonia ?? '',
          area: p.colonia ?? '',
          price: new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
          }).format(p.precio),
          priceValue: p.precio,
          image: p.imagenes_propiedades?.[0]?.image_url ?? '',
          bedrooms: p.habitaciones ?? 0,
          bathrooms: p.banios ?? 0,
          sqm: p.area ?? 0,
          type: (p.tipo ?? 'casa') as 'casa' | 'departamento' | 'penthouse' | 'terreno',
          coordinates: { lat: p.latitud!, lng: p.longitud! },
        })),
    [filtered]
  );

  return (
    <>
      <Helmet>
        <title>Explorar Propiedades</title>
        <meta
          name="description"
          content="Explora nuestro catálogo de propiedades en el mapa interactivo."
        />
      </Helmet>

      <Navbar />

      <main className="pt-20 h-screen flex overflow-hidden">
        {/* Map column */}
        <div className="relative flex-1 min-w-0">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <PropertyFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filtered.length}
            />
            {(qParam || actionParam) && (
              <div className="flex flex-wrap gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-elegant w-fit max-w-[90vw]">
                {qParam && (
                  <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
                    Búsqueda: {qParam}
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('q');
                        newParams.delete('lat');
                        newParams.delete('lng');
                        setSearchParams(newParams);
                      }}
                      className="hover:text-primary/70 transition-colors ml-1 font-extrabold text-xs"
                    >
                      ×
                    </button>
                  </span>
                )}
                {actionParam && (
                  <span className="flex items-center gap-1.5 bg-accent/15 text-accent-foreground text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-accent/25">
                    Operación: {actionParam === '1' ? 'Venta' : actionParam === '2' ? 'Renta' : 'Remate'}
                    <button
                      type="button"
                      onClick={() => {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.delete('accion');
                        setSearchParams(newParams);
                      }}
                      className="hover:text-accent/70 transition-colors ml-1 font-extrabold text-xs"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchParams(new URLSearchParams());
                  }}
                  className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 transition-colors"
                >
                  Limpiar Búsqueda
                </button>
              </div>
            )}
          </div>
          <PropertyMap properties={mapProperties} mapboxToken={mapboxToken} centerLngLat={centerLngLat} />
        </div>

        {/* Property list sidebar */}
        <aside className="hidden lg:flex flex-col w-96 border-l border-border bg-background shrink-0">
          <div className="px-5 py-4 border-b border-border">
            <h1 className="font-serif text-xl">Propiedades</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLoading ? 'Cargando…' : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filtered.map((p) => (
              <PropertyCard key={p.id} property={p} variant="compact" />
            ))}

            {!isLoading && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="font-serif text-lg text-muted-foreground">Sin resultados</p>
                <p className="text-xs text-muted-foreground mt-2">Ajusta los filtros</p>
              </div>
            )}
          </div>
        </aside>
      </main>
    </>
  );
};

export default MapPage;
