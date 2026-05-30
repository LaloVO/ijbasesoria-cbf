import { useEffect, useRef, useState } from 'react';
import { Terminal, ShieldCheck, Activity, Cpu, Percent, Zap } from 'lucide-react';

const AIFeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const metrics = [
    { label: 'PRECISIÓN VALUACIÓN', value: '98.4%', desc: 'Algoritmo de Big Data comparativo CDMX' },
    { label: 'PROMEDIO DE RENTA', value: '10 Días', desc: 'Filtro PropTech express vs 45 estándar' },
    { label: 'RIESGO DE INCUMPLIMIENTO', value: '0.02%', desc: 'Bajo perfilamiento de Póliza Jurídica IJB' },
    { label: 'CAP RATE PROMEDIO', value: '7.4%', desc: 'Retorno proyectado en desarrollos Benito Juárez' }
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 md:px-12 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900"
    >
      {/* Background digital grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[92%] md:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left Column: Data-focused Slogans & Stats */}
        <div className="lg:col-span-6 text-left space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span>PropTech Engine v1.0.4</span>
            </div>

            <h2
              className={`font-sans text-4xl md:text-5xl font-extrabold leading-tight text-white transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Datos invisibles,<br />
              <span className="text-primary font-light italic font-sans">resultados tangibles.</span>
            </h2>

            <p
              className={`font-sans text-sm md:text-base font-normal text-slate-400 leading-relaxed max-w-md transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Eliminamos los contenedores tradicionales de marketing. Nuestro ecosistema de datos extrae e interpreta variables transaccionales de la CDMX en tiempo real para optimizar precios y mitigar riesgos contractuales.
            </p>
          </div>

          {/* Raw Metrics Grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-900/60 transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {metrics.map((m, idx) => (
              <div key={idx} className="space-y-1.5 text-left border-l border-slate-800 pl-4">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  {m.label}
                </span>
                <span className="block text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {m.value}
                </span>
                <span className="block text-[10px] text-slate-400 leading-tight">
                  {m.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sleek Data Telemetry Console */}
        <div
          className={`lg:col-span-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-elegant text-left font-mono text-[11px] leading-relaxed">
            
            {/* Terminal Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ijb-metrics-telemetry.log</span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            </div>

            {/* Terminal Console Logs */}
            <div className="p-5 space-y-4 text-slate-300">
              <div className="space-y-1">
                <p className="text-slate-500">$ ijb-engine --profile --zone "Hipódromo Condesa"</p>
                <p className="text-emerald-400">[INFO] Database connection established to VITE_CBF_API.</p>
                <p className="text-emerald-400">[INFO] Fetching active listing parameters...</p>
              </div>

              {/* Data Telemetry Blocks */}
              <div className="space-y-2.5 py-3 border-y border-slate-800/80">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-sans">MARKET_BENCHMARK</span>
                  <span className="text-primary font-bold">+$320,000 MXN</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[84%]" />
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 font-sans">LEGAL_POLICY_SCORE</span>
                  <span className="text-accent font-bold">980 / 1000 (A+)</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[98%]" />
                </div>

                <div className="flex justify-between items-center pt-1.5">
                  <span className="text-slate-500 font-sans">URBAN_CONNECTIVITY</span>
                  <span className="text-emerald-400 font-bold">95 % Consolidada</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[95%]" />
                </div>
              </div>

              {/* Log diagnostics output */}
              <div className="space-y-1">
                <p className="text-slate-500">$ ijb-engine --verify-lease --id "Los Laureles"</p>
                <p className="text-emerald-400">[OK] Biométrica e identificación validadas.</p>
                <p className="text-emerald-400">[OK] Buro de Crédito verificado. Score: 742.</p>
                <p className="text-primary font-extrabold animate-pulse">[SUCCESS] Póliza Jurídica express aprobada digitalmente.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default AIFeatureSection;
