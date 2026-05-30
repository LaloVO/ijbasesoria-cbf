import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Home, TrendingUp, HandCoins, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhilosophySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Rentas con Póliza Jurídica',
      desc: 'Procesos de arrendamiento ágiles respaldados digitalmente por la tecnología de pulppo® y tuhabi. Garantizamos la solvencia y la certeza jurídica de tu propiedad.',
      link: '/#poliza',
      span: 'md:col-span-2 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-950',
      isSectionScroll: true,
      sectionId: 'poliza'
    },
    {
      icon: <Home className="w-6 h-6 text-accent" />,
      title: 'Ventas y Residencial',
      desc: 'Encuentra departamentos nuevos, residenciales y predios listos para escriturar con total transparencia y avalúos dinámicos en la CDMX.',
      link: '/mapa?accion=1',
      span: 'md:col-span-1 bg-white dark:bg-slate-900',
      isSectionScroll: false
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Inversión y Desarrollos',
      desc: 'Sourcing exclusivo de predios en esquina de alta visibilidad comercial y habitacional con análisis de uso de suelo (HM/10/20/Z).',
      link: '/mapa?q=Benito Juárez',
      span: 'md:col-span-1 bg-white dark:bg-slate-900',
      isSectionScroll: false
    },
    {
      icon: <HandCoins className="w-6 h-6 text-accent" />,
      title: 'Asesoría Hipotecaria',
      desc: 'Tramitación y perfilamiento de créditos hipotecarios bancarios, Infonavit y Cofinavit sin cargos extras, sin burocracia y de forma 100% digital.',
      link: '/solicita-inmueble',
      span: 'md:col-span-2 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-950',
      isSectionScroll: false
    }
  ];

  const handleLinkClick = (srv: typeof services[0]) => {
    if (srv.isSectionScroll && srv.sectionId) {
      const element = document.getElementById(srv.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(srv.link);
    }
  };

  return (
    <section ref={sectionRef} id="servicios" className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden border-t border-slate-100 dark:border-slate-900">
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="luxury-container max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-left">
          <div className="max-w-xl space-y-4">
            <span className={`text-primary text-xs uppercase tracking-[0.2em] font-bold block transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Nuestros Servicios
            </span>
            <h2 className={`font-sans text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Un enfoque contemporáneo en bienes raíces
            </h2>
          </div>
          <p className={`font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-md transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Fucionamos el acompañamiento humano experto con los estándares tecnológicos y de seguridad más altos de la industria PropTech.
          </p>
        </div>

        {/* Bento Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {services.map((srv, i) => (
            <div
              key={srv.title}
              onClick={() => handleLinkClick(srv)}
              className={`group cursor-pointer p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-card hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left gap-6 ${srv.span}`}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">
                  {srv.icon}
                </div>
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-sans text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  {srv.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
