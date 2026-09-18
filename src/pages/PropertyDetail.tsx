import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bed, Bath, Square, Car, MapPin, MessageCircle, CalendarCheck, Layers, Home as HomeIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperty, formatPrice, actionLabel, buildWhatsAppUrl } from '@/lib/cbf';
import { useSiteUser } from '@/hooks/useSiteUser';
import { usePropertyCatalog } from '@/hooks/usePropertyCatalog';

function formatFecha(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Date(`${iso}T00:00:00`).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
}

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSiteUser();
  const { childUnitsByParent } = usePropertyCatalog();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id!),
    enabled: !!id,
  });

  const isDevelopment = property?.is_unit === false;
  const childUnits = isDevelopment && id
    ? childUnitsByParent.get(String(id)) ?? childUnitsByParent.get(Number(id)) ?? []
    : [];
  const verticals = property?.development_verticals ?? [];
  const fechaInicio = formatFecha(property?.fecha_inicio);
  const fechaEntrega = formatFecha(property?.fecha_entrega);
  const fromPrice = isDevelopment
    ? (() => {
        const prices = childUnits.map((u) => u.precio).filter((p) => p > 0);
        if (prices.length) return Math.min(...prices);
        return property && property.precio > 0 ? property.precio : null;
      })()
    : null;

  const whatsappUrl = buildWhatsAppUrl(
    user?.telefono_usuario,
    property ? `Hola, me interesa la propiedad: ${property.nombre}` : undefined
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50 px-6 pb-20 pt-32 dark:bg-slate-950 md:px-12">
          <div className="mx-auto w-full max-w-7xl animate-pulse space-y-8">
            <div className="h-5 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="space-y-4">
              <div className="h-12 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-1/3 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="aspect-[16/10] rounded-3xl bg-slate-200 dark:bg-slate-800 lg:col-span-8" />
              <div className="min-h-80 rounded-3xl bg-slate-200 dark:bg-slate-800 lg:col-span-4" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 pt-24 dark:bg-slate-950">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-elegant dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-5 font-sans text-2xl font-extrabold text-slate-900 dark:text-white">Propiedad no encontrada</p>
            <Link to="/mapa" className="inline-flex rounded-full bg-primary px-6 py-3 font-sans text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-primary/90">
              Ver todas las propiedades
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const images = property.imagenes_propiedades ?? [];
  const mainImage = images[0]?.image_url ?? 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop';
  const badge = isDevelopment ? 'Desarrollo' : actionLabel(property.id_tipo_accion);
  const location = [property.colonia, property.direccion].filter(Boolean).join(', ');
  const canonicalUrl = `https://betsabeearias.homepty.com/properties/${property.id}`;
  const propertySchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.nombre,
    description: property.descripcion ?? property.nombre,
    url: canonicalUrl,
    image: images.map((image) => image.image_url),
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.ciudad_nombre ?? property.colonia,
      addressRegion: property.estado_nombre,
      addressCountry: 'MX',
    },
    ...(property.precio > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: property.precio,
            priceCurrency: property.moneda ?? 'MXN',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  return (
    <>
      <Helmet>
        <title>{property.nombre} | {user?.nombre_usuario ?? 'All Home Bienes Raíces'}</title>
        <meta name="description" content={property.descripcion ?? property.nombre} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={property.nombre} />
        <meta property="og:description" content={property.descripcion ?? property.nombre} />
        <meta property="og:image" content={mainImage} />
        <script type="application/ld+json">{JSON.stringify(propertySchema)}</script>
      </Helmet>

      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-24 pt-28 dark:bg-slate-950">
        <div className="pointer-events-none absolute left-[-12%] top-[-6%] h-[420px] w-[420px] rounded-full bg-primary/5 blur-[110px]" />
        <div className="pointer-events-none absolute right-[-10%] top-[32%] h-[380px] w-[380px] rounded-full bg-accent/5 blur-[110px]" />

        <div className="relative z-10 mx-auto w-[92%] max-w-7xl space-y-10 md:w-[80%]">
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 font-sans text-[10px] font-extrabold uppercase tracking-wider text-slate-600 shadow-card transition-all hover:border-primary/30 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Regresar al Catálogo
          </Link>

          <header className="max-w-5xl space-y-5 text-left">
            <h1 className="font-sans text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              {property.nombre}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1.5 font-sans text-[9px] font-extrabold uppercase tracking-widest text-white">
                {badge}
              </span>
              {property.tipo && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-sans text-[9px] font-extrabold uppercase tracking-widest text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {property.tipo}
                </span>
              )}
              {verticals.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-sans text-[9px] font-extrabold uppercase tracking-widest text-primary"
                >
                  <Layers className="h-2.5 w-2.5" />
                  {v}
                </span>
              ))}
            </div>

            {location && (
              <p className="flex items-center gap-2 font-sans text-sm font-medium text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {location}
              </p>
            )}
          </header>

          <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-2 shadow-elegant dark:border-slate-800/80 dark:bg-slate-900 lg:col-span-8">
              <div className="grid gap-2 md:grid-cols-12">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 md:col-span-8 md:aspect-auto md:min-h-[520px] dark:bg-slate-800">
                  <img
                    src={mainImage}
                    alt={property.nombre}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                <div className="hidden gap-2 md:col-span-4 md:grid md:grid-rows-2">
                  {images.slice(1, 3).map((img, i) => (
                    <div key={i} className="min-h-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={img.image_url}
                        alt={`${property.nombre} ${i + 2}`}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                  {images.length < 2 && (
                    <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-6 text-center font-sans text-xs font-medium text-slate-500">
                      Curaduría fotográfica Raquel Meléndrez
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-elegant lg:sticky lg:top-28 lg:col-span-4 md:p-8">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:14px_14px] opacity-20" />
              <div className="relative z-10">
                <span className="mb-2 block font-sans text-[9px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                  {isDevelopment ? 'Precio de las unidades' : 'Precio de la propiedad'}
                </span>
                <p className="mb-1 font-sans text-3xl font-extrabold tracking-tight text-primary md:text-4xl">
                  {isDevelopment
                    ? fromPrice != null
                      ? `Desde ${formatPrice(fromPrice, property.moneda ?? 'MXN')}`
                      : 'Precio a consultar'
                    : formatPrice(property.precio, property.moneda ?? 'MXN')}
                </p>
                <p className="mb-8 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {isDevelopment
                    ? 'desde la unidad más económica'
                    : badge === 'Renta'
                    ? 'por mes'
                    : 'precio total de adquisición'}
                </p>

                <div className="mb-8 flex items-center gap-4 border-b border-slate-800 pb-6">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                    <img
                      src={user?.imagen_perfil_usuario ?? '/raquel.jpeg'}
                      alt={user?.nombre_usuario ?? 'Raquel Meléndrez'}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-extrabold text-white">
                      {user?.nombre_usuario ?? 'Raquel Meléndrez'}
                    </p>
                    <p className="mt-1 font-sans text-[10px] font-bold uppercase tracking-widest text-accent">
                      Fundadora & Asesora Principal
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-5 py-4 font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <MessageCircle className="h-4 w-4" />
                  Agendar Cita Privada
                </a>

                <p className="mt-4 text-center font-sans text-[9px] font-medium uppercase leading-relaxed tracking-widest text-slate-500">
                  Atención exclusiva directa · Respuesta rápida vía WhatsApp
                </p>
              </div>
            </aside>
          </section>

          {isDevelopment ? (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {childUnits.length > 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <HomeIcon className="mb-4 h-5 w-5 text-primary" />
                  <p className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">{childUnits.length}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    {childUnits.length === 1 ? 'Unidad' : 'Unidades'}
                  </p>
                </div>
              )}
              {fechaInicio && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <CalendarCheck className="mb-4 h-5 w-5 text-primary" />
                  <p className="font-sans text-base font-extrabold text-slate-900 dark:text-white">{fechaInicio}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Inicio de obra</p>
                </div>
              )}
              {fechaEntrega && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <CalendarCheck className="mb-4 h-5 w-5 text-accent" />
                  <p className="font-sans text-base font-extrabold text-slate-900 dark:text-white">{fechaEntrega}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Entrega estimada</p>
                </div>
              )}
            </section>
          ) : (
            <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.habitaciones != null && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <Bed className="mb-4 h-5 w-5 text-primary" />
                  <p className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">{property.habitaciones}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Recámaras</p>
                </div>
              )}
              {property.banios != null && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <Bath className="mb-4 h-5 w-5 text-primary" />
                  <p className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">{property.banios}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Baños</p>
                </div>
              )}
              {property.area != null && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <Square className="mb-4 h-5 w-5 text-accent" />
                  <p className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">{property.area}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Metros²</p>
                </div>
              )}
              {property.estacionamientos != null && (
                <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-card dark:border-slate-800/80 dark:bg-slate-900">
                  <Car className="mb-4 h-5 w-5 text-accent" />
                  <p className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white">{property.estacionamientos}</p>
                  <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-widest text-slate-400">Estac.</p>
                </div>
              )}
            </section>
          )}

          {(property.descripcion || property.descripcion_estado || property.descripcion_inversion) && (
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {property.descripcion && (
                <div className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-card dark:border-slate-800/80 dark:bg-slate-900 md:p-9 lg:col-span-2">
                  <h2 className="mb-4 font-sans text-2xl font-extrabold text-slate-900 dark:text-white">Descripción de la Residencia</h2>
                  <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                    {property.descripcion}
                  </p>
                </div>
              )}

              {property.descripcion_estado && (
                <div className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-card dark:border-slate-800/80 dark:bg-slate-900 md:p-8">
                  <h3 className="mb-3 font-sans text-lg font-extrabold text-slate-900 dark:text-white">
                    Estado / Condición del Inmueble
                  </h3>
                  <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {property.descripcion_estado}
                  </p>
                </div>
              )}

              {property.descripcion_inversion && (
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-7 shadow-card dark:border-primary/20 dark:from-primary/10 dark:to-slate-900 md:p-8">
                  <h3 className="mb-3 font-sans text-lg font-extrabold text-slate-900 dark:text-white">
                    Potencial de Inversión
                  </h3>
                  <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {property.descripcion_inversion}
                  </p>
                </div>
              )}
            </section>
          )}

          {isDevelopment && (
            <section className="rounded-3xl border border-slate-200/70 bg-white p-7 shadow-card dark:border-slate-800/80 dark:bg-slate-900 md:p-9">
              <h2 className="mb-6 font-sans text-2xl font-extrabold text-slate-900 dark:text-white">
                Unidades disponibles{childUnits.length > 0 ? ` (${childUnits.length})` : ''}
              </h2>
              {childUnits.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {childUnits.map((unit) => (
                    <PropertyCard key={unit.id} property={unit} variant="compact" />
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-slate-500 dark:text-slate-400">
                  Aún no hay unidades específicas publicadas para este desarrollo.
                </p>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PropertyDetail;
