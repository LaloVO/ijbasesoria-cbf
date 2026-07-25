import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bed, Bath, Square, Car, MapPin, MessageCircle, CalendarCheck, Layers, Home as HomeIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { fetchProperty, formatPrice, actionLabel } from '@/lib/cbf';
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
  const childUnits = isDevelopment && id ? childUnitsByParent.get(Number(id)) ?? [] : [];
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

  const whatsappNumber = user?.telefono_usuario?.replace(/\D/g, '') ?? '';
  const whatsappMsg = property
    ? encodeURIComponent(`Hola, me interesa la propiedad: ${property.nombre}`)
    : '';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-surface px-6 md:px-12 max-w-[90rem] mx-auto animate-pulse">
          <div className="h-8 bg-primary/10 rounded w-1/3 mb-8" />
          <div className="aspect-video bg-primary/10 rounded-none mb-8" />
          <div className="h-10 bg-primary/10 rounded w-1/2 mb-4" />
          <div className="h-4 bg-primary/10 rounded w-1/3" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-surface flex items-center justify-center">
          <div className="text-center text-primary">
            <p className="font-serif text-2xl font-light mb-4">Propiedad no encontrada</p>
            <Link to="/mapa" className="text-xs uppercase tracking-widest border-b border-accent pb-1 text-accent hover:text-primary hover:border-primary transition-colors">
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

  return (
    <>
      <Helmet>
        <title>{property.nombre} | {user?.nombre_usuario ?? 'All Home Bienes Raíces'}</title>
        <meta name="description" content={property.descripcion ?? property.nombre} />
      </Helmet>

      <Navbar />

      <main className="pt-20 min-h-screen bg-[#FAF7F2]">
        
        {/* Navigation back */}
        <div className="px-6 md:px-12 py-6 max-w-[90rem] mx-auto">
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-medium text-[#6E6259]/65 hover:text-[#B76E4D] transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#B76E4D]" />
            Regresar al Catálogo
          </Link>
        </div>

        {/* Dynamic high-end masonry layout for images */}
        <div className="px-6 md:px-12 max-w-[90rem] mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-hidden">
            {/* Main Picture */}
            <div className="md:col-span-2 aspect-[4/3] bg-[#E9DDCF]/10">
              <img
                src={mainImage}
                alt={property.nombre}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Supporting Pictures */}
            <div className="flex flex-col gap-3 h-full">
              {images.slice(1, 3).map((img, i) => (
                <div key={i} className="aspect-[4/3] md:aspect-auto md:flex-1 bg-[#E9DDCF]/10 overflow-hidden">
                  <img
                    src={img.image_url}
                    alt={`${property.nombre} ${i + 2}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
              {images.length < 2 && (
                <div className="hidden md:flex flex-1 bg-[#E9DDCF]/5 items-center justify-center border border-[#E9DDCF]/30 border-dashed text-[#6E6259]/30 text-xs font-serif italic">
                  Curaduría fotográfica Raquel Meléndrez
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Structure */}
        <div className="px-6 md:px-12 max-w-[90rem] mx-auto pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Main Pane: Details */}
            <div className="lg:col-span-8 text-[#6E6259]">
              
              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-[#B76E4D] text-white text-[9px] uppercase tracking-widest font-sans font-bold">
                  {badge}
                </span>
                {property.tipo && (
                  <span className="px-3 py-1 bg-white border border-[#E9DDCF] text-[#6E6259]/80 text-[9px] uppercase tracking-widest font-sans font-semibold">
                    {property.tipo}
                  </span>
                )}
                {verticals.map((v) => (
                  <span
                    key={v}
                    className="flex items-center gap-1 px-3 py-1 bg-[#B76E4D]/10 border border-[#B76E4D]/25 text-[#B76E4D] text-[9px] uppercase tracking-widest font-sans font-semibold"
                  >
                    <Layers className="w-2.5 h-2.5" />
                    {v}
                  </span>
                ))}
              </div>

              {/* Title & Location */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight mb-4">
                {property.nombre}
              </h1>

              {location && (
                <p className="flex items-center gap-2 text-[#6E6259]/70 font-sans text-xs uppercase tracking-wider mb-8 font-light">
                  <MapPin className="w-3.5 h-3.5 text-[#B76E4D]" />
                  {location}
                </p>
              )}

              {/* Technical Specifications Grid with clean white boxes */}
              {isDevelopment ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  {childUnits.length > 0 && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <HomeIcon className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-xl text-[#6E6259]">{childUnits.length}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">
                        {childUnits.length === 1 ? 'Unidad' : 'Unidades'}
                      </p>
                    </div>
                  )}
                  {fechaInicio && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <CalendarCheck className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-sm text-[#6E6259]">{fechaInicio}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Inicio de obra</p>
                    </div>
                  )}
                  {fechaEntrega && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <CalendarCheck className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-sm text-[#6E6259]">{fechaEntrega}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Entrega estimada</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                  {property.habitaciones != null && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <Bed className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-xl text-[#6E6259]">{property.habitaciones}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Recámaras</p>
                    </div>
                  )}
                  {property.banios != null && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <Bath className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-xl text-[#6E6259]">{property.banios}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Baños</p>
                    </div>
                  )}
                  {property.area != null && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <Square className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-xl text-[#6E6259]">{property.area}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Metros²</p>
                    </div>
                  )}
                  {property.estacionamientos != null && (
                    <div className="bg-white border border-[#E9DDCF]/40 p-4 text-center shadow-sm">
                      <Car className="w-4 h-4 mx-auto mb-2 text-[#B76E4D]" />
                      <p className="font-serif text-xl text-[#6E6259]">{property.estacionamientos}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#6E6259]/50 font-sans font-medium mt-1">Estac.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Description section */}
              {(property.descripcion || property.descripcion_estado || property.descripcion_inversion) && (
                <div className="border-t border-[#E9DDCF]/35 pt-8 space-y-8">
                  {property.descripcion && (
                    <div>
                      <h2 className="font-serif text-xl text-[#6E6259] mb-4 font-normal">Descripción de la Residencia</h2>
                      <p className="font-sans text-sm sm:text-base text-[#6E6259]/85 leading-relaxed font-light whitespace-pre-line">
                        {property.descripcion}
                      </p>
                    </div>
                  )}

                  {property.descripcion_estado && (
                    <div>
                      <h3 className="text-[9px] uppercase tracking-widest text-[#B76E4D] font-sans font-bold mb-3">
                        Estado / Condición del Inmueble
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-[#6E6259]/85 leading-relaxed font-light whitespace-pre-line">
                        {property.descripcion_estado}
                      </p>
                    </div>
                  )}

                  {property.descripcion_inversion && (
                    <div>
                      <h3 className="text-[9px] uppercase tracking-widest text-[#B76E4D] font-sans font-bold mb-3">
                        Potencial de Inversión
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-[#6E6259]/85 leading-relaxed font-light whitespace-pre-line">
                        {property.descripcion_inversion}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Unidades disponibles del desarrollo */}
              {isDevelopment && (
                <div className="border-t border-[#E9DDCF]/35 pt-8 mt-8">
                  <h2 className="font-serif text-xl text-[#6E6259] mb-5 font-normal">
                    Unidades disponibles{childUnits.length > 0 ? ` (${childUnits.length})` : ''}
                  </h2>
                  {childUnits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {childUnits.map((unit) => (
                        <PropertyCard key={unit.id} property={unit} />
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-[#6E6259]/70">
                      Aún no hay unidades específicas publicadas para este desarrollo.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Right Pane: Sticky Luxury contact card */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-white border border-[#E9DDCF]/55 p-6 md:p-8 shadow-elegant text-[#6E6259]">
                <span className="block text-[9px] uppercase tracking-widest text-[#6E6259]/45 mb-1 font-sans">
                  {isDevelopment ? 'Precio de las unidades' : 'Precio de la propiedad'}
                </span>
                <p className="font-sans font-bold text-3xl md:text-4xl text-[#B76E4D] mb-1">
                  {isDevelopment
                    ? fromPrice != null
                      ? `Desde ${formatPrice(fromPrice)}`
                      : 'Precio a consultar'
                    : formatPrice(property.precio)}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-[#6E6259]/60 font-sans mb-8">
                  {isDevelopment
                    ? 'desde la unidad más económica'
                    : badge === 'Renta'
                    ? 'por mes'
                    : 'precio total de adquisición'}
                </p>

                {/* Profile card of advisor */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#E9DDCF]/35">
                  <div className="relative w-12 h-12 overflow-hidden bg-[#E9DDCF]/10 shrink-0">
                    <img
                      src="/raquel.jpeg"
                      alt="Raquel Meléndrez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm text-[#6E6259] uppercase tracking-wider">
                      Raquel Meléndrez
                    </p>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-[#B76E4D] font-medium mt-0.5">
                      Fundadora & Asesora Principal
                    </p>
                  </div>
                </div>

                {/* Highly contrast Terracotta button for contact */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-4 bg-[#B76E4D] hover:bg-[#6E6259] text-white font-sans uppercase text-[10px] tracking-[0.25em] font-semibold transition-all duration-300 shadow-md hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Agendar Cita Privada
                </a>

                <p className="text-center font-sans text-[9px] uppercase tracking-widest text-[#6E6259]/50 mt-4 leading-relaxed font-light">
                  Atención exclusiva directa · Respuesta rápida vía WhatsApp
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default PropertyDetail;
