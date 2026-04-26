import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';
import { FadeIn, SectionHeading, SectionLabel } from './ui-primitives';
import { SERVICES_DATA } from '@/lib/data';

interface ServicesProps {
  onDevis: () => void;
}

export function Services({ onDevis }: ServicesProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const svc = SERVICES_DATA[activeIdx];

  console.log('Services render - activeIdx:', activeIdx);
  console.log('Service actuel:', svc?.title);

  return (
    <section 
      id="services" 
      className="relative py-32 overflow-hidden" 
      style={{ background: '#060D1A', position: 'relative', zIndex: 10 }}
    >
      {/* Dot pattern background - s'assurer qu'il ne bloque pas les clics */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C8962E 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,150,46,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <SectionLabel>Ce que nous faisons</SectionLabel>
          <SectionHeading>Nos Expertises</SectionHeading>
          <p className="text-white/40 mt-4 max-w-xl mx-auto text-lg">
            Cinq domaines d'excellence au service de vos ambitions
          </p>
        </FadeIn>

        {/* Tab buttons */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {SERVICES_DATA.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIdx === i;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('🔘 Bouton cliqué - index:', i, 'service:', s.title);
                    console.log('Active avant:', activeIdx);
                    setActiveIdx(i);
                    console.log('Active après:', i);
                  }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer relative z-30"
                  style={{
                    background: isActive ? `${s.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? s.color : 'rgba(255,255,255,0.07)'}`,
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                    boxShadow: isActive ? `0 0 30px ${s.color}25` : 'none',
                  }}
                >
                  <Icon size={15} style={{ color: isActive ? s.color : 'rgba(255,255,255,0.3)' }} />
                  {s.short}
                </button>
              );
            })}
          </div>
        </FadeIn>

        {/* Content panel - ajouter un key plus fort */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`service-${activeIdx}-${svc.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text side */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}30` }}
                >
                  <svc.icon size={24} style={{ color: svc.color }} />
                </div>
                <div
                  className="h-px flex-1"
                  style={{ background: `linear-gradient(90deg, ${svc.color}50, transparent)` }}
                />
              </div>

              <h3
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                {svc.title}
              </h3>

              <p className="text-white/60 text-lg leading-relaxed mb-8">{svc.desc}</p>

              <div className="grid grid-cols-2 gap-3 mb-10">
                {svc.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: svc.color }} />
                    <span className="text-white/70 text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={onDevis}
                className="group flex items-center gap-3 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:brightness-110 active:scale-95 relative z-30"
                style={{ background: `linear-gradient(135deg, ${svc.color}, ${svc.color}CC)`, color: '#000' }}
              >
                <FileText size={16} /> Devis {svc.short}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Image side */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="w-full h-full object-cover transition-all duration-700"
                  style={{ filter: 'brightness(0.85)' }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, rgba(6,13,26,0.2), ${svc.color}15)` }}
                />
              </div>
              <div
                className="absolute -top-3 -right-3 w-full h-full rounded-2xl border pointer-events-none"
                style={{ borderColor: `${svc.color}30` }}
              />
              <div
                className="absolute -bottom-3 -left-3 w-16 h-16 rounded-xl pointer-events-none"
                style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}30` }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}