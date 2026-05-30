import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useSiteUser } from '@/hooks/useSiteUser';

const Footer = () => {
  const { site, user } = useSiteUser();

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10 px-6 md:px-12 border-t border-slate-800">
      <div className="luxury-container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-sans font-extrabold text-2xl tracking-tight text-white hover:text-primary transition-colors block"
            >
              {site?.site_name ?? 'IJB Asesoría'}
            </Link>
            <p className="font-sans text-sm text-slate-400 max-w-xs leading-relaxed">
              Procesos inmobiliarios ágiles, seguros y con los más altos estándares PropTech.
              Renta con Póliza Jurídica y encuentra tu patrimonio con total tranquilidad.
            </p>
          </div>

          {/* Quick Links & Contact */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            {/* Quick Sections */}
            <div className="space-y-3">
              <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-primary">Navegación</h4>
              <ul className="space-y-2 text-sm text-slate-400 font-sans">
                <li>
                  <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors block text-left">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/servicios" className="hover:text-primary transition-colors block text-left">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to="/oportunidades" className="hover:text-primary transition-colors block text-left">
                    Oportunidades
                  </Link>
                </li>
                <li>
                  <Link to="/propiedades" className="hover:text-primary transition-colors block text-left">
                    Propiedades
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="font-sans text-xs uppercase tracking-widest font-bold text-primary">Contacto</h4>
              <ul className="space-y-2.5 text-sm text-slate-400 font-sans">
                <li className="flex items-start gap-2 max-w-xs">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Nuevo León 276, Hipódromo Condesa, Cuauhtémoc, CDMX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a 
                    href="https://wa.me/525516070024" 
                    target="_blank" 
                    rel="noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    55 1607 0024
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <a 
                    href="mailto:contacto@ijbasesoria.com" 
                    className="hover:text-primary transition-colors"
                  >
                    contacto@ijbasesoria.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal & Platform Info */}
        <div className="mt-16 pt-8 border-t border-slate-800 text-[11px] text-slate-500 uppercase tracking-widest flex flex-col sm:flex-row justify-between gap-4 font-sans">
          <span>
            © {new Date().getFullYear()} {site?.site_name ?? 'IJB Asesoría'} | PropTech Real Estate
          </span>
          <span className="flex items-center gap-1">
            Desarrollado con <span className="text-primary font-bold">✦</span> CBF Connect
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
