import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, DollarSign, FileSearch, FileText, Heart, Home, MapPin, MapPinned, ScanSearch, ShieldCheck, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormularioMultiStep from "@/components/home/FormularioMultiStep";
import { useSiteUser } from "@/hooks/useSiteUser";

const REQUEST_STEPS = [
  { id: 1, title: "Información", icon: User },
  { id: 2, title: "Características", icon: Home },
  { id: 3, title: "Ubicación", icon: MapPin },
  { id: 4, title: "Presupuesto", icon: DollarSign },
  { id: 5, title: "Uso", icon: Heart },
  { id: 6, title: "Expediente", icon: FileText },
];

export default function SolicitaInmueble() {
  const { user } = useSiteUser();
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <Helmet>
        <title>Búsqueda Inteligente | {user?.nombre_usuario ?? "Agencia"}</title>
        <meta
          name="description"
          content="Completa nuestra solicitud inteligente de 6 pasos para encontrar tu propiedad de lujo ideal. Evaluamos tu estilo de vida para una recomendación perfecta."
        />
      </Helmet>

      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-slate-50 pb-24 pt-28 dark:bg-slate-950">
        <div className="pointer-events-none absolute left-[-10%] top-10 h-[450px] w-[450px] rounded-full bg-primary/5 blur-[100px]" />
        <div className="pointer-events-none absolute right-[-10%] top-[40%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

        <div className="relative z-10 mx-auto w-[92%] max-w-7xl md:w-[88%]">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
            <aside className="self-stretch text-left lg:sticky lg:top-28 lg:col-span-4">
              <div className="flex h-full flex-col justify-between space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-card sm:p-7">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h1 className="font-sans text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                      Búsqueda Inteligente Inmobiliaria
                    </h1>
                    <p className="font-sans text-xs font-normal leading-relaxed text-slate-300">
                      Define tu presupuesto, expediente y cuéntanos sobre tu rutina diaria. Nuestro motor buscará y filtrará las mejores residencias exclusivas para ti.
                    </p>
                  </div>

                  <div className="space-y-3.5 border-t border-slate-800 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl border border-slate-700 bg-slate-800 p-2 text-primary">
                        <ScanSearch className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-sans text-xs font-bold text-white">Perfil de búsqueda preciso</h2>
                        <p className="mt-0.5 text-[10px] text-slate-400">Características, presupuesto y forma de pago reunidos en una sola solicitud.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl border border-slate-700 bg-slate-800 p-2 text-accent">
                        <MapPinned className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-sans text-xs font-bold text-white">Ubicación según tu rutina</h2>
                        <p className="mt-0.5 text-[10px] text-slate-400">La búsqueda considera zonas, movilidad y el estilo de vida que necesitas.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-xl border border-slate-700 bg-slate-800 p-2 text-emerald-400">
                        <FileSearch className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-sans text-xs font-bold text-white">Expediente preparado</h2>
                        <p className="mt-0.5 text-[10px] text-slate-400">Puedes adjuntar documentos o agendar una cita para completar tu perfil.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 font-sans text-[10px] text-slate-400">
                  <span className="font-bold text-white">IJB Property Match</span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    Datos protegidos
                  </span>
                </div>
              </div>
            </aside>

            <nav aria-label="Progreso de la solicitud" className="self-stretch lg:sticky lg:top-28 lg:col-span-2">
              <div className="flex h-full flex-row items-center justify-between gap-5 rounded-3xl border border-slate-200/70 bg-white p-6 text-left shadow-card dark:border-slate-800/80 dark:bg-slate-900 lg:flex-col lg:items-start lg:justify-start">
                <span className="mb-1 hidden font-sans text-[10px] font-extrabold uppercase tracking-widest text-slate-400 lg:block">
                  Pasos
                </span>

                {REQUEST_STEPS.map((step, index) => {
                  const isCompleted = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  const isLast = index === REQUEST_STEPS.length - 1;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex w-full flex-row items-center gap-2 lg:flex-col lg:items-start">
                      <div className="flex w-full items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-sans text-xs font-bold transition-all duration-300
                            ${isCompleted ? "border-primary bg-primary text-white" : ""}
                            ${isCurrent && !isCompleted ? "scale-105 border-primary bg-white text-primary shadow-sm dark:bg-slate-900" : ""}
                            ${!isCurrent && !isCompleted ? "border-slate-300 bg-transparent text-slate-400 dark:border-slate-800" : ""}
                          `}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>

                        <div className="hidden flex-col text-left lg:flex">
                          <span className={`font-sans text-xs font-bold leading-tight ${isCurrent ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                            {step.title}
                          </span>
                          <span className="font-sans text-[9px] text-slate-400">Paso 0{step.id}</span>
                        </div>
                      </div>

                      {!isLast && <div className="ml-[17px] hidden h-5 w-[2px] rounded bg-slate-200 dark:bg-slate-800 lg:block" />}
                    </div>
                  );
                })}
              </div>
            </nav>

            <div className="self-stretch lg:col-span-6">
              <FormularioMultiStep onStepChange={setCurrentStep} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
