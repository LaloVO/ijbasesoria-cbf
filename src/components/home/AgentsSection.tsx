import { agents, achievements } from '@/data/properties';
import { useEffect, useRef, useState } from 'react';

const AgentsSection = () => {
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

  return (
    <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-secondary text-secondary-foreground relative overflow-hidden">
      <div className="luxury-container">
        {/* Achievements */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="text-center md:text-left"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="block text-4xl md:text-5xl font-serif text-primary mb-2">
                {achievement.value}
              </span>
              <span className="text-xs uppercase tracking-widest text-secondary-foreground/70">
                {achievement.label}
              </span>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <span
              className={`text-primary text-xs uppercase tracking-[0.2em] font-bold block mb-4 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Nuestro Equipo
            </span>
            <h2
              className={`font-serif text-4xl md:text-5xl transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              Expertos en el arte
              <br />
              <span className="italic font-light">de habitar.</span>
            </h2>
          </div>
          <p
            className={`font-sans text-secondary-foreground/70 max-w-md font-light leading-relaxed transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Un equipo selecto de profesionales que combinan décadas de experiencia
            con las herramientas más avanzadas del mercado.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              className={`group cursor-pointer transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${600 + index * 150}ms` }}
            >
              <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 image-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <div className="flex justify-between text-luxury-white text-xs">
                    <span>{agent.sales} Ventas</span>
                    <span>{agent.experience} Años Exp.</span>
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-xl text-secondary-foreground mb-1 group-hover:text-primary transition-colors">
                {agent.name}
              </h3>
              <p className="font-sans text-sm text-secondary-foreground/60">
                {agent.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
