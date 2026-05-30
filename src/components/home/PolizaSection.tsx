import { ShieldCheck, UserCheck, Scale, ClipboardCheck, MessageSquare, ShieldAlert, Check } from 'lucide-react';
import { useState } from 'react';

const PolizaSection = () => {
  const [activeTab, setActiveTab] = useState<'propietario' | 'inquilino'>('propietario');

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
    <section id="poliza" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden border-t border-slate-100 dark:border-slate-900">
      {/* Visual background accents */}
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="luxury-container max-w-6xl mx-auto relative z-10 text-center space-y-16">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-accent text-xs uppercase tracking-[0.2em] font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Seguridad Arrendaticia PropTech</span>
          </div>
          <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            ¿Qué es una Póliza Jurídica de Arrendamiento?
          </h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Es la herramienta legal de protección más confiable al rentar tu propiedad. Acompañamos tanto a arrendadores como arrendatarios, blindando el proceso contractual para prevenir y solucionar fricciones.
          </p>
        </div>

        {/* Dynamic Tab Panel */}
        <div className="bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-900 max-w-4xl mx-auto shadow-elegant">
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
                className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4"
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
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6 text-left">
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
  );
};

export default PolizaSection;
