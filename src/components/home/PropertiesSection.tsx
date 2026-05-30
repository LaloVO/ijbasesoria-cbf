import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { useEffect, useRef, useState } from 'react';

const SkeletonCard = () => (
  <div className="min-w-[85vw] md:min-w-[40vw] animate-pulse snap-center">
    <div className="aspect-[4/3] mb-6 rounded-lg bg-muted" />
    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
    <div className="h-4 bg-muted rounded w-1/2" />
  </div>
);

const PropertiesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { properties, isLoading } = useProperties({ limit: 6 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="pb-32 bg-background">
      <div className="px-6 md:px-12 mb-12 flex justify-between items-end luxury-container">
        <h2
          className={`font-serif text-4xl md:text-5xl text-foreground transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          Propiedades Destacadas
        </h2>
        <Link
          to="/mapa"
          className={`hidden md:block text-xs uppercase tracking-widest border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Ver Inventario Completo
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 px-6 md:px-12 pb-10 snap-x hide-scrollbar">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          : properties.map((property, index) => (
              <div
                key={property.id}
                className={`transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
      </div>

      <div className="px-6 md:hidden mt-8">
        <Link
          to="/mapa"
          className="text-xs uppercase tracking-widest border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors"
        >
          Ver Inventario Completo
        </Link>
      </div>
    </section>
  );
};

export default PropertiesSection;
