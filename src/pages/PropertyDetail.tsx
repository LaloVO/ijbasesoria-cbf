import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Bed, Bath, Square, Car, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchProperty, formatPrice } from '@/lib/cbf';
import { useSiteUser } from '@/hooks/useSiteUser';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useSiteUser();

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => fetchProperty(id!),
    enabled: !!id,
  });

  const whatsappNumber = user?.telefono_usuario?.replace(/\D/g, '') ?? '';
  const whatsappMsg = property
    ? encodeURIComponent(`Hola, me interesa la propiedad: ${property.nombre}`)
    : '';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-background px-6 md:px-12 luxury-container animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-8" />
          <div className="aspect-video bg-muted rounded-xl mb-8" />
          <div className="h-10 bg-muted rounded w-1/2 mb-4" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <Navbar />
        <main className="pt-24 min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-2xl text-muted-foreground mb-4">Propiedad no encontrada</p>
            <Link to="/mapa" className="text-sm underline hover:text-primary transition-colors">
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
  const badge = property.id_tipo_accion === 2 ? 'Renta' : 'Venta';
  const location = [property.colonia, property.direccion].filter(Boolean).join(', ');

  return (
    <>
      <Helmet>
        <title>{property.nombre} | {user?.nombre_usuario ?? 'Agencia'}</title>
        <meta name="description" content={property.descripcion ?? property.nombre} />
      </Helmet>

      <Navbar />

      <main className="pt-20 min-h-screen bg-background">
        {/* Back */}
        <div className="px-6 md:px-12 py-6 luxury-container">
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver todas las propiedades
          </Link>
        </div>

        {/* Images */}
        <div className="px-6 md:px-12 luxury-container mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-xl overflow-hidden">
            <div className="aspect-[4/3] md:aspect-auto md:row-span-2">
              <img src={mainImage} alt={property.nombre} className="w-full h-full object-cover" />
            </div>
            {images.slice(1, 3).map((img, i) => (
              <div key={i} className="aspect-[4/3]">
                <img src={img.image_url} alt={`${property.nombre} ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 md:px-12 luxury-container pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Details */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-primary mb-4">
                <span>{badge}</span>
                {property.tipo && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal normal-case tracking-normal">{property.tipo}</span>
                  </>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
                {property.nombre}
              </h1>

              {location && (
                <p className="flex items-center gap-1.5 text-muted-foreground font-sans text-sm mb-6">
                  <MapPin className="w-4 h-4" />
                  {location}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {property.habitaciones != null && (
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Bed className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-serif text-xl">{property.habitaciones}</p>
                    <p className="text-xs text-muted-foreground font-sans">Recámaras</p>
                  </div>
                )}
                {property.banios != null && (
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Bath className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-serif text-xl">{property.banios}</p>
                    <p className="text-xs text-muted-foreground font-sans">Baños</p>
                  </div>
                )}
                {property.area != null && (
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Square className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-serif text-xl">{property.area}</p>
                    <p className="text-xs text-muted-foreground font-sans">m²</p>
                  </div>
                )}
                {property.estacionamientos != null && (
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Car className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-serif text-xl">{property.estacionamientos}</p>
                    <p className="text-xs text-muted-foreground font-sans">Estacionamientos</p>
                  </div>
                )}
              </div>

              {property.descripcion && (
                <div>
                  <h2 className="font-serif text-xl mb-3">Descripción</h2>
                  <p className="font-sans text-muted-foreground leading-relaxed whitespace-pre-line">
                    {property.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-card">
                <p className="font-serif text-3xl mb-1">{formatPrice(property.precio)}</p>
                <p className="text-xs text-muted-foreground font-sans mb-6">
                  {badge === 'Renta' ? 'por mes' : 'precio total'}
                </p>

                {user && (
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                    {user.imagen_perfil_usuario ? (
                      <img
                        src={user.imagen_perfil_usuario}
                        alt={user.nombre_usuario}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-serif text-xl">
                        {user.nombre_usuario[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-sans font-medium text-sm">{user.nombre_usuario}</p>
                      <p className="font-sans text-xs text-muted-foreground">Asesor Inmobiliario</p>
                    </div>
                  </div>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-xl font-sans font-medium text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contactar por WhatsApp
                </a>

                <div className="my-5 border-t border-border" />

                <div className="space-y-3">
                  <h4 className="font-serif text-lg text-[#2E251E] font-medium">¿No es lo que buscas?</h4>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                    Si esta propiedad no cumple tus expectativas, completa nuestra solicitud inteligente en 6 pasos para perfilar el espacio ideal según tu rutina diaria.
                  </p>
                  <Link
                    to="/solicita-inmueble"
                    className="flex items-center justify-center gap-2 w-full py-3 border border-[#B76E4D] text-[#B76E4D] hover:bg-[#B76E4D] hover:text-white rounded-xl font-sans font-medium text-xs transition-all duration-300"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Búsqueda Inteligente
                  </Link>
                </div>
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
