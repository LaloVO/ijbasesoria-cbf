import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Home, 
  TrendingUp, 
  HandCoins, 
  ArrowUpRight, 
  UserCheck, 
  Scale, 
  ClipboardCheck, 
  MessageSquare, 
  ShieldAlert, 
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Servicios = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'propietario' | 'inquilino'>('propietario');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Smooth scroll to hash if user comes with a hash like #poliza
    if (window.location.hash) {
      setTimeout(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  const services = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Rentas con Póliza Jurídica',
      desc: 'Procesos de arrendamiento ágiles respaldados digitalmente por la tecnología de pulppo® y tuhabi. Garantizamos la solvencia y la certeza jurídica de tu propiedad.',
      span: 'md:col-span-2 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-950',
      action: () => {
        const el = document.getElementById('poliza');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      icon: <Home className="w-6 h-6 text-accent" />,
      title: 'Ventas y Residencial',
      desc: 'Encuentra departamentos nuevos, residenciales y predios listos para escriturar con total transparencia y avalúos dinámicos en la CDMX.',
      span: 'md:col-span-1 bg-white dark:bg-slate-900',
      action: () => navigate('/propiedades?tab=propiedades')
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      title: 'Inversión y Desarrollos',
      desc: 'Sourcing exclusivo de predios en esquina de alta visibilidad comercial y habitacional con análisis de uso de suelo (HM/10/20/Z).',
      span: 'md:col-span-1 bg-white dark:bg-slate-900',
      action: () => navigate('/propiedades?q=Benito Juárez')
    },
    {
      icon: <HandCoins className="w-6 h-6 text-accent" />,
      title: 'Asesoría Hipotecaria',
      desc: 'Tramitación y perfilamiento de créditos hipotecarios bancarios, Infonavit y Cofinavit sin cargos extras, sin burocracia y de forma 100% digital.',
      span: 'md:col-span-2 bg-gradient-to-br from-white to-slate-100 dark:from-slate-900 dark:to-slate-950',
      action: () => navigate('/solicita-inmueble')
    }
  ];

  const landlordBenefits = [
    {
      title: 'Protección de Rentas y Desalojo',
      desc: 'En caso de mora o incumplimiento, cubrimos el costo total del litigio de desalojo sin costo extra para ti.',
      icon: <ShieldAlert className="w-5 h-5 text-primary" />
    },
    {
      title: 'Investigación de Perfil Rigurosa',
      desc: 'Filtramos prospectos realizando un análisis exhaustivo de antecedentes legales, historial crediticio y referencias laborales.',
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />
    },
    {
      title: 'Contratos Personalizados a Medida',
      desc: 'Nuestros abogados redactan contratos de arrendamiento robustos y 100% actualizados bajo el marco legal de la CDMX.',
      icon: <Scale className="w-5 h-5 text-primary" />
    }
  ];

  const tenantBenefits = [
    {
      title: 'Tratos Transparentes y Seguros',
      desc: 'Contratos justos, transparentes y libres de cláusulas abusivas que garantizan una estancia tranquila y legal.',
      icon: <Check className="w-5 h-5 text-accent" />
    },
    {
      title: 'Mediación ante Fricciones',
      desc: 'Brindamos acompañamiento y conciliación neutral en caso de diferencias o dudas contractuales con el arrendador.',
      icon: <MessageSquare className="w-5 h-5 text-accent" />
    },
    {
      title: 'Firma Digital y Agilidad',
      desc: 'Procesos optimizados PropTech para que califiques rápido y firmes tu póliza de forma 100% digital y segura.',
      icon: <UserCheck className="w-5 h-5 text-accent" />
    }
  ];

  return (
    <>
      <Helmet>
        <title>Nuestros Servicios y Póliza Jurídica | IJB Asesoría</title>
        <meta
          name="description"
          content="Consolida tu seguridad al rentar, vender o comprar en CDMX. Conoce nuestras pólizas jurídicas y catálogo de servicios con el estándar PropTech más alto."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
        {/* Decorative mesh */}
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        {/* SECTION 1: SERVICES BENTO */}
        <section id="servicios" className="py-16">
          <div className="w-[92%] md:w-[80%] mx-auto space-y-12">
            <div className="text-left max-w-3xl space-y-4">
              <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Servicios integrales con estándares PropTech.
              </h1>
              <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Fucionamos el acompañamiento profesional inmobiliario y financiero con las herramientas digitales más seguras del sector.
              </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv, i) => (
                <div
                  key={srv.title}
                  onClick={srv.action}
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

        {/* SECTION 2: POLIZA JURIDICA CONSOLE */}
        <section id="poliza" className="py-16 border-t border-slate-200/40 dark:border-slate-800/40">
          <div className="w-[92%] md:w-[80%] mx-auto space-y-12 text-center">
            
            {/* Header */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-accent text-xs uppercase tracking-[0.2em] font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Seguridad Arrendaticia</span>
              </div>
              <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                ¿Qué es una Póliza Jurídica de Arrendamiento?
              </h2>
              <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Es la herramienta legal de protección más confiable al rentar tu propiedad. Acompañamos tanto a arrendadores como arrendatarios, blindando el proceso contractual para prevenir y solucionar fricciones.
              </p>
            </div>

            {/* Dynamic Tab Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-elegant">
              
              {/* Tab buttons */}
              <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full max-w-md mx-auto mb-10">
                <button
                  onClick={() => setActiveTab('propietario')}
                  className={`flex-1 py-3 text-xs md:text-sm font-sans font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'propietario'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Para Propietarios</span>
                </button>
                <button
                  onClick={() => setActiveTab('inquilino')}
                  className={`flex-1 py-3 text-xs md:text-sm font-sans font-bold uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'inquilino'
                      ? 'bg-accent text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Para Inquilinos</span>
                </button>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {(activeTab === 'propietario' ? landlordBenefits : tenantBenefits).map((benefit, i) => (
                  <div
                    key={i}
                    className="bg-slate-50/50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl ${activeTab === 'propietario' ? 'bg-primary/10' : 'bg-accent/10'}`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-extrabold text-slate-900 dark:text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA under grid */}
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-6 text-left">
                <div>
                  <p className="font-sans font-extrabold text-sm text-slate-800 dark:text-white">
                    {activeTab === 'propietario' 
                      ? '¿Quieres rentar tu propiedad con 100% de tranquilidad?' 
                      : '¿Encontraste tu hogar ideal y necesitas calificar rápido?'}
                  </p>
                  <p className="font-sans text-xs text-slate-400">
                    Ponte en contacto con nuestros asesores PropTech y cotiza tu póliza jurídica hoy mismo.
                  </p>
                </div>
                <a
                  href={`https://wa.me/525516070024?text=Hola%20IJB%20Asesoria,%20me%20gustaria%20saber%20mas%20sobre%20sus%20polizas%20juridicas%20para%20${activeTab}s.`}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-6 py-3 rounded-full text-white font-sans text-xs uppercase tracking-widest font-extrabold transition-all duration-300 shadow-md ${
                    activeTab === 'propietario' ? 'bg-primary hover:bg-primary/90' : 'bg-accent hover:bg-accent/90'
                  }`}
                >
                  Cotizar por WhatsApp
                </a>
              </div>

            </div>

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Servicios;
