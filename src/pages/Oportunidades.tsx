import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  TrendingUp, 
  ShieldCheck, 
  Scale, 
  HelpCircle, 
  MapPin, 
  ArrowRight,
  DollarSign,
  AlertTriangle,
  Building,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

interface RemateItem {
  id: string;
  title: string;
  location: string;
  rematePrice: number;
  marketPrice: number;
  status: 'Litigio Avanzado' | 'Cesión Inmediata' | 'Adjudicado';
  rooms: number;
  bathrooms: number;
  sqm: number;
  image: string;
}

const mockRemates: RemateItem[] = [
  {
    id: 'rem-1',
    title: 'Departamento Contemporáneo - Del Valle Centro',
    location: 'Benito Juárez, CDMX',
    rematePrice: 1650000,
    marketPrice: 3800000,
    status: 'Litigio Avanzado',
    rooms: 2,
    bathrooms: 2,
    sqm: 85,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'rem-2',
    title: 'Residencia en Condominio - Lomas de Chapultepec',
    location: 'Miguel Hidalgo, CDMX',
    rematePrice: 8400000,
    marketPrice: 18500000,
    status: 'Cesión Inmediata',
    rooms: 4,
    bathrooms: 3.5,
    sqm: 320,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'rem-3',
    title: 'Departamento Clásico - Roma Sur',
    location: 'Cuauhtémoc, CDMX',
    rematePrice: 1950000,
    marketPrice: 4200000,
    status: 'Adjudicado',
    rooms: 2,
    bathrooms: 1,
    sqm: 72,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop'
  }
];

const Oportunidades = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>Oportunidades de Inversión y Remates Bancarios | IJB Asesoría</title>
        <meta
          name="description"
          content="Accede a propiedades exclusivas en remate bancario en CDMX con hasta 60% de descuento. Asesoría y dictamen legal certificado por expertos."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-20">
        {/* Dynamic visual mesh grids */}
        <div className="absolute top-[-5%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-float" />
        <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

        <div className="w-[92%] md:w-[80%] mx-auto space-y-16">
          
          {/* Header */}
          <div className="text-left max-w-3xl space-y-4">
            <h1 className="font-sans text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Remates Bancarios: Multiplica tu patrimonio.
            </h1>
            <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              Adquiere inmuebles de carteras de recuperación hipotecaria con descuentos de hasta un 60% sobre su valor comercial real en la CDMX. Proceso 100% blindado y dictaminado por nuestro departamento jurídico.
            </p>
          </div>

          {/* CRITICAL WARNING CARD (Data style info) */}
          <div className="bg-slate-950 border border-slate-900 p-6 rounded-3xl text-left flex flex-col md:flex-row items-center gap-6 shadow-elegant text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl shrink-0">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-sans text-lg font-extrabold flex items-center gap-2">
                <span>REGLAS CRÍTICAS DE LOS REMATES BANCARIOS</span>
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                Al adquirir un remate hipotecario debes considerar dos condiciones absolutas: **1. Solo recursos propios:** No se aceptan créditos de ningún tipo (Infonavit, Fovissste o bancarios). La compra se ejecuta al contado. **2. Tiempo de espera:** La cesión ante Notario es inmediata, pero la toma de posesión física depende de la etapa procesal del juicio. En IJB Asesoría dictaminamos cada expediente previamente para garantizar viabilidad jurídica absoluta.
              </p>
            </div>
          </div>

          {/* Steps Breakdown */}
          <div className="space-y-8">
            <h2 className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white text-left">
              Nuestro Proceso de Adquisición Segura
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-card">
                <span className="text-xs font-bold text-primary font-mono tracking-widest block mb-3">[ ETAPA 01 ]</span>
                <h3 className="font-sans text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  Diagnóstico y Dictamen Legal
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Auditamos directamente el expediente judicial en los juzgados correspondientes para verificar que el juicio del banco no presente vicios procesales.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-card">
                <span className="text-xs font-bold text-primary font-mono tracking-widest block mb-3">[ ETAPA 02 ]</span>
                <h3 className="font-sans text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  Cesión de Derechos Notariada
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Realizas la compra mediante una cesión de derechos adjudicatarios o litigiosos firmada directamente ante Notario Público oficial.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-2xl shadow-card">
                <span className="text-xs font-bold text-primary font-mono tracking-widest block mb-3">[ ETAPA 03 ]</span>
                <h3 className="font-sans text-base font-extrabold text-slate-900 dark:text-white mb-2">
                  Posesión y Escrituración
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Nuestros abogados ejecutan el desalojo o la entrega voluntaria, solicitando al juez la escrituración judicial final a tu nombre para la posesión física.
                </p>
              </div>
            </div>
          </div>

          {/* List of Deals (Raw Data style + premium Foreclosure cards) */}
          <div className="space-y-8">
            <h2 className="font-sans text-2xl font-extrabold text-slate-900 dark:text-white text-left">
              Oportunidades Exclusivas Disponibles
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRemates.map((item) => {
                const discount = Math.round(((item.marketPrice - item.rematePrice) / item.marketPrice) * 100);

                return (
                  <div key={item.id} className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 p-4 shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col justify-between hover:scale-[1.01]">
                    <div>
                      {/* Image block */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-5">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                      </div>

                      {/* Info Block */}
                      <div className="px-1 text-left space-y-3">
                        <h3 className="font-sans text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="font-sans text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{item.location}</span>
                        </p>

                        {/* Raw Data comparisons */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl font-mono text-[10px] space-y-2 border border-slate-100 dark:border-slate-900">
                          <div className="flex justify-between items-center text-slate-500">
                            <span>VALOR_COMERCIAL:</span>
                            <span className="line-through">{formatPrice(item.marketPrice)}</span>
                          </div>
                          <div className="flex justify-between items-center text-white">
                            <span className="text-slate-500">VALOR_REMATE:</span>
                            <span className="text-primary font-bold text-sm">{formatPrice(item.rematePrice)}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500">
                            <span>AHORRO_PROYECTADO:</span>
                            <span className="text-primary font-bold">-{discount}%</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500">
                            <span>ESTATUS_PROCESAL:</span>
                            <span className="text-white uppercase font-bold">{item.status}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500 pt-1.5 border-t border-slate-200/50 dark:border-slate-800/50">
                            <span>CAP_RATE_PLUSVALIA:</span>
                            <span className="text-accent">+{Math.round((item.marketPrice / item.rematePrice) * 100)}% ROI</span>
                          </div>
                        </div>

                        {/* Layout details */}
                        <div className="flex gap-4 p-1.5 text-xs text-slate-500 font-sans font-semibold pt-1">
                          <span>{item.rooms} Rec.</span>
                          <span>•</span>
                          <span>{item.bathrooms} Baños</span>
                          <span>•</span>
                          <span>{item.sqm} m² const.</span>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp CTA button */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <a
                        href={`https://wa.me/525516070024?text=Hola%20IJB%20Asesoria,%20me%20interesa%20la%20oportunidad%20de%20remate%20en%20"${encodeURIComponent(item.title)}"%20con%20precio%20de%20${formatPrice(item.rematePrice)}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-sans text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Solicitar Dictamen Jurídico</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Oportunidades;
