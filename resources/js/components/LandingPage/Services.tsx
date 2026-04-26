import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { FadeIn, SectionHeading, SectionLabel } from './ui-primitives';
import { SERVICES_DATA } from '@/lib/data';

interface ServicesProps { onDevis: () => void }

export function Services({ onDevis }: ServicesProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const svc = SERVICES_DATA[activeIdx];

  return (
    <section id="services" className="relative py-32 overflow-hidden bg-slate-300 dark:bg-[#060D1A]">

      <div className="absolute inset-0 opacity-0 dark:opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle,#C8962E 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

   
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-amber-500/30 to-transparent dark:via-amber-500/30" />

     
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,rgba(200,150,46,0.08)_0%,transparent_70%)] dark:bg-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

   
        <FadeIn className="text-center mb-16">
          <SectionLabel>Ce que nous faisons</SectionLabel>
          <SectionHeading>Nos Expertises</SectionHeading>
          <p className="mt-4 max-w-xl mx-auto text-lg text-gray-600 dark:text-white/40">
            Cinq domaines d'excellence au service de vos ambitions
          </p>
        </FadeIn>

        
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {SERVICES_DATA.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIdx === i;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`
            flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium 
            transition-all duration-300 cursor-pointer
            ${isActive
                      ? "text-white shadow-lg"
                      : `
                bg-white border border-gray-300 text-gray-700 
                hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-900
                dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-white/50 
                dark:hover:bg-white/[0.08] dark:hover:text-white/80
              `
                    }
          `}
                  style={isActive ? {
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}`,
                    boxShadow: `0 0 30px ${s.color}20`,
                  } : {}}
                >
                  <Icon
                    size={16}
                    style={{ color: isActive ? s.color : undefined }}
                    className={!isActive ? "text-gray-500 group-hover:text-amber-600 dark:text-inherit" : ""}
                  />
                  <span className={!isActive ? "group-hover:text-amber-600 dark:group-hover:text-white/80" : ""}>
                    {s.short}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Panel contenu */}
        <AnimatePresence mode="wait">
          <motion.div key={activeIdx}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Texte */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}>
                  <svc.icon size={24} style={{ color: svc.color }} />
                </div>
                <div className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg,${svc.color}50,transparent)` }} />
              </div>

              <h3 style={{ fontFamily: "'Cormorant Garamond',serif" }}
                className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {svc.title}
              </h3>

              <p className="text-lg leading-relaxed mb-8 text-gray-600 dark:text-white/60">
                {svc.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {svc.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: svc.color }} />
                    <span className="text-sm text-gray-700 dark:text-white/70">{f}</span>
                  </div>
                ))}
              </div>

              <button type="button" onClick={onDevis}
                className="group flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-600 dark:text-white shadow-md transition-all hover:brightness-110 active:scale-95">
                <FileText size={16} /> Devis {svc.short}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/30 dark:shadow-none">
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="w-full h-full object-cover brightness-90 dark:brightness-85"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black/5 to-transparent dark:from-black/10" />
              </div>
              <div className="absolute -top-3 -right-3 w-full h-full rounded-2xl border pointer-events-none"
                style={{ borderColor: `${svc.color}30` }} />
              <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-xl pointer-events-none"
                style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30` }} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Appliquer le style au bouton de façon dynamique */}
      <style>{`
        button[style*="linear-gradient"] {
          background: linear-gradient(135deg, ${svc.color}, ${svc.color}CC) !important;
        }
      `}</style>
    </section>
  );
}