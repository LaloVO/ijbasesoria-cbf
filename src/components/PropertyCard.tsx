import { Link } from 'react-router-dom';
import { Bed, Bath, Square } from 'lucide-react';
import { CBFProperty, formatPrice } from '@/lib/cbf';

interface PropertyCardProps {
  property: CBFProperty;
  variant?: 'default' | 'compact';
}

const PropertyCard = ({ property, variant = 'default' }: PropertyCardProps) => {
  const image = property.imagenes_propiedades?.[0]?.image_url ?? 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop';
  const badge = property.id_tipo_accion === 2 ? 'Renta' : 'Venta';
  const location = [property.colonia, property.direccion].filter(Boolean).join(' • ') || '';

  if (variant === 'compact') {
    return (
      <Link to={`/properties/${property.id}`} className="group block bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={image} alt={property.nombre} className="w-full h-full object-cover image-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent animate-pulse" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-white font-sans font-bold text-lg">
              {formatPrice(property.precio)}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-wider">
            <span className="text-primary">{badge}</span>
            <div className="flex gap-2.5 text-slate-400">
              {property.habitaciones != null && <span>{property.habitaciones} Rec.</span>}
              {property.banios != null && <span>{property.banios} B.</span>}
            </div>
          </div>
          <h3 className="font-sans text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug truncate">
            {property.nombre}
          </h3>
          <p className="font-sans text-xs text-muted-foreground truncate">{location}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/properties/${property.id}`} className="min-w-[85vw] md:min-w-[40vw] group cursor-pointer snap-center block text-left">
      <div className="relative aspect-[4/3] mb-5 overflow-hidden rounded-2xl">
        <img src={image} alt={property.nombre} className="w-full h-full object-cover image-zoom" />
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-primary">
            <span>{badge}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal normal-case tracking-normal">{property.area ? `${property.area}m²` : ''}</span>
          </div>
          <h3 className="font-sans text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
            {property.nombre}
          </h3>
          <p className="font-sans text-xs text-muted-foreground">
            {location}
          </p>
        </div>
        <span className="font-sans font-extrabold text-lg text-primary whitespace-nowrap md:text-right">
          {formatPrice(property.precio)}
        </span>
      </div>
    </Link>
  );
};

export default PropertyCard;
