import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FormularioVenderPropiedad, { STEPS } from '@/components/home/FormularioVenderPropiedad';
import { useSiteUser } from '@/hooks/useSiteUser';
import { ShieldCheck, FileCheck, Lock, Clock, Check } from 'lucide-react';

const VenderPropiedad = () => {
  const { user } = useSiteUser();
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <Helmet>
        <title>Vender o Rentar mi Propiedad | {user?.nombre_usuario ?? 'IJB Asesoría Inmobiliaria'}</title>
        <meta
          name="description"
          content="Registra tu inmueble en la CDMX con IJB Asesoría. Valuación comercial, póliza jurídica garantizada e intermediación profesional."
        />
      </Helmet>

      <Navbar />

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-28 pb-24 relative overflow-hidden">
        {/* Halos decorativos de fondo */}
        <div className="absolute top-10 left-[-10%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-[92%] md:w-[88%] max-w-7xl mx-auto relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Columna 1: Panel Corporativo Sticky (4 Cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 text-left self-stretch">
              <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-card h-full flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                      Comercializa tu inmueble con respaldo legal absoluto.
                    </h1>

                    <p className="font-sans text-slate-300 text-xs leading-relaxed font-normal">
                      Estructuramos el expediente técnico de tu propiedad, dictamen jurídico preventivo y valuación comercial basada en Big Data transaccional de la Ciudad de México.
                    </p>
                  </div>

                  {/* Métricas y Garantías */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-primary shrink-0">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white">Póliza Jurídica Garantizada</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Perfilamiento y filtro biológico de inquilinos con score crediticio.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-accent shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white">Colocación Promedio</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">10 días promedio de colocación efectiva en la CDMX.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-sans font-bold text-xs text-white">Expediente Cifrado</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Protección de escrituras y documentos con cifrado notarial.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between text-[10px] font-sans text-slate-400 mt-auto">
                  <span className="font-bold text-white">IJB Legal Engine</span>
                  <span className="text-primary font-bold">Sin Burocracia</span>
                </div>
              </div>
            </div>

            {/* Columna 2: Stepper Vertical (2 Cols) — Alineado superiormente sin padding extra */}
            <div className="lg:col-span-2 lg:sticky lg:top-28 self-stretch">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 rounded-3xl p-6 shadow-card h-full flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start gap-5 text-left">
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-slate-400 hidden lg:block mb-1">
                  Pasos
                </span>

                {STEPS.map((step, idx) => {
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  const isLast = idx === STEPS.length - 1;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-row lg:flex-col items-center lg:items-start w-full gap-2">
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-sans font-bold text-xs transition-all duration-300 shrink-0
                            ${isCompleted ? "bg-primary border-primary text-white" : ""}
                            ${isCurrent && !isCompleted ? "border-primary bg-white dark:bg-slate-900 text-primary scale-105 shadow-sm" : ""}
                            ${!isCurrent && !isCompleted ? "border-slate-300 dark:border-slate-800 bg-transparent text-slate-400" : ""}
                          `}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>

                        <div className="hidden lg:flex flex-col text-left">
                          <span className={`text-xs font-sans font-bold leading-tight ${isCurrent ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            {step.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-sans">Paso 0{step.id}</span>
                        </div>
                      </div>

                      {!isLast && (
                        <div className="hidden lg:block w-[2px] h-5 bg-slate-200 dark:bg-slate-800 ml-[17px] rounded" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Columna 3: Formulario en Tarjeta Limpia (6 Cols) */}
            <div className="lg:col-span-6 self-stretch">
              <FormularioVenderPropiedad currentStep={currentStep} onStepChange={setCurrentStep} />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default VenderPropiedad;
