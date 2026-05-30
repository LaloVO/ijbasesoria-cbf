import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSiteUser } from '@/hooks/useSiteUser';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { site } = useSiteUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/#inicio', label: 'Inicio', sectionId: 'inicio' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/oportunidades', label: 'Oportunidades' },
    { href: '/propiedades', label: 'Propiedades' },
    { href: '/mapa', label: 'Mapa' },
  ];

  const handleNavClick = (link: { href: string; label: string; sectionId?: string }) => {
    setIsMobileMenuOpen(false);
    if (link.sectionId && isHomePage) {
      const element = document.getElementById(link.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl rounded-full bg-white/70 dark:bg-slate-950/75 backdrop-blur-xl border border-white/40 dark:border-slate-800/40 shadow-elegant py-3 px-6 md:px-8'
            : 'top-0 left-0 w-full py-6 px-6 md:px-12 bg-transparent'
        } flex justify-between items-center`}
      >
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-slate-900 dark:text-white transition-colors"
        >
          {site?.site_name ?? 'IJB Asesoría'}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm uppercase tracking-widest font-sans font-semibold">
          {navLinks.map((link) => (
            link.sectionId && isHomePage ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 font-sans"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors duration-300 font-sans"
              >
                {link.label}
              </Link>
            )
          ))}
          <Link
            to="/solicita-inmueble"
            className="bg-primary text-white font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-5 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Búsqueda Inteligente
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-900 dark:text-white z-50"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-background/98 dark:bg-slate-950/98 backdrop-blur-md z-45 md:hidden flex flex-col items-center justify-center gap-6 transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          link.sectionId && isHomePage ? (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              className="font-sans text-2xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ) : (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans text-2xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          )
        ))}
        <Link
          to="/solicita-inmueble"
          onClick={() => setIsMobileMenuOpen(false)}
          className="mt-4 bg-primary text-white font-sans text-sm uppercase tracking-widest font-bold py-3.5 px-8 rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md"
        >
          Búsqueda Inteligente
        </Link>
      </div>
    </>
  );
};

export default Navbar;
