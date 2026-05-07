import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeIn, SectionHeading, SectionLabel } from './ui-primitives';
import { getServicesData } from '@/lib/data';
import { useTranslation } from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

interface ServicesProps { onDevis: () => void }

function ServiceCarousel({ images, color, title }: { images: string[]; color: string; title: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const go = useCallback((next: number) => {
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  }, [idx]);

  const prev = () => go((idx - 1 + images.length) % images.length);
  const next = () => go((idx + 1) % images.length);

  useEffect(() => {
    if (images.length < 2) { return; }

    const startAutoAdvance = () => {
      if (autoTimerRef.current) { clearInterval(autoTimerRef.current); }
      autoTimerRef.current = setInterval(() => {
        if (!isHovering) {
          setDir(1);
          setIdx(i => (i + 1) % images.length);
        }
      }, isMobile ? 6000 : 4500);
    };

    startAutoAdvance();

    return () => {
      if (autoTimerRef.current) { clearInterval(autoTimerRef.current); }
    };
  }, [images.length, isHovering, isMobile]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: '0%', opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl"
      style={{ aspectRatio: '4/3' }}
      onMouseEnter={() => !isMobile && setIsHovering(true)}
      onMouseLeave={() => !isMobile && setIsHovering(false)}
    >
      <AnimatePresence custom={dir} mode="popLayout">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`${title} ${idx + 1}`}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: isMobile ? 0.4 : 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: 'transform, opacity' }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}60, transparent)` }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <ChevronLeft size={isMobile ? 12 : 16} className="text-gray-700" />
          </button>
          <button
            onClick={next}
            className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            }`}
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            <ChevronRight size={isMobile ? 12 : 16} className="text-gray-700" />
          </button>

          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === idx ? (isMobile ? 12 : 20) : (isMobile ? 3 : 6),
                  height: isMobile ? 3 : 6,
                  background: i === idx ? color : 'rgba(255,255,255,0.55)',
                  boxShadow: i === idx ? `0 0 8px ${color}80` : 'none',
                }}
              />
            ))}
          </div>
        </>
      )}

      {images.length > 1 && !isMobile && (
        <div
          className="absolute bottom-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white z-10"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        >
          {idx + 1}/{images.length}
        </div>
      )}
    </div>
  );
}

export function Services({ onDevis }: ServicesProps) {
  const { t, locale } = useTranslation();
  const { landing } = usePage().props as any;
  const SERVICES_DATA = getServicesData(t, locale, landing?.services);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const svc = SERVICES_DATA[activeIdx];
  const images: string[] = (svc as any).images?.length
    ? (svc as any).images
    : [(svc as any).img].filter(Boolean);

  const goToNextService = useCallback(() => {
    const nextIdx = (activeIdx + 1) % SERVICES_DATA.length;
    setActiveIdx(nextIdx);
  }, [activeIdx, SERVICES_DATA.length]);

  const resetInactivityTimer = useCallback(() => {
    setIsUserInteracting(true);
    if (inactivityTimerRef.current) { clearTimeout(inactivityTimerRef.current); }
    inactivityTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, isMobile ? 12000 : 8000);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) { return; }
    if (!isUserInteracting) {
      if (autoScrollTimerRef.current) { clearInterval(autoScrollTimerRef.current); }
      autoScrollTimerRef.current = setInterval(() => { goToNextService(); }, 10000);
    }
    return () => {
      if (autoScrollTimerRef.current) { clearInterval(autoScrollTimerRef.current); }
    };
  }, [isUserInteracting, goToNextService, isMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) { return; }
    const handleUserInteraction = () => { if (!isMobile) { resetInactivityTimer(); } };
    if (!isMobile) {
      section.addEventListener('click', handleUserInteraction);
      section.addEventListener('touchstart', handleUserInteraction);
      section.addEventListener('mousemove', handleUserInteraction);
      section.addEventListener('keydown', handleUserInteraction);
    }
    return () => {
      section.removeEventListener('click', handleUserInteraction);
      section.removeEventListener('touchstart', handleUserInteraction);
      section.removeEventListener('mousemove', handleUserInteraction);
      section.removeEventListener('keydown', handleUserInteraction);
      if (inactivityTimerRef.current) { clearTimeout(inactivityTimerRef.current); }
      if (autoScrollTimerRef.current) { clearInterval(autoScrollTimerRef.current); }
    };
  }, [resetInactivityTimer, isMobile]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-16 sm:py-28 overflow-hidden bg-[#F9F7F3] dark:bg-[#07101F]"
    >
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #C8962E 1px, transparent 1px)', backgroundSize: '44px 44px' }}
      />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/25 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 relative z-10">

        {/* ── Header ── */}
        <FadeIn className="text-center mb-10 sm:mb-14">
          <SectionLabel>{t('services_title')}</SectionLabel>
          <SectionHeading>{t('services_heading')}</SectionHeading>
          <p className="mt-2 sm:mt-3 max-w-lg mx-auto text-sm sm:text-base text-gray-500 dark:text-white/40">
            {t('services_desc')}
          </p>
        </FadeIn>

        {/* ── Tab pills ── */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2.5 mb-10 sm:mb-14 relative">
            {SERVICES_DATA.map((s, i) => {
              const Icon = s.icon;
              const isActive = activeIdx === i;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveIdx(i);
                    if (!isMobile) { resetInactivityTimer(); }
                  }}
                  whileHover={!isMobile ? { y: -2 } : {}}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-[13px] font-medium transition-all duration-300"
                  style={
                    isActive
                      ? {
                          background: `${s.color}14`,
                          border: `1px solid ${s.color}`,
                          color: s.color,
                          boxShadow: `0 4px 20px ${s.color}22`,
                        }
                      : {
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          color: '#6B7280',
                        }
                  }
                >
                  <Icon size={isMobile ? 12 : 15} style={{ color: isActive ? s.color : '#9CA3AF' }} />
                  {s.short}
                </motion.button>
              );
            })}
          </div>
        </FadeIn>

        {/* ── Content panel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, y: isMobile ? 15 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isMobile ? -10 : -18 }}
            transition={{ duration: isMobile ? 0.3 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          >
            {/* ── Left: text ── */}
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                  style={{ background: `${svc.color}18`, border: `1px solid ${svc.color}35` }}
                >
                  <svc.icon size={isMobile ? 18 : 22} style={{ color: svc.color }} />
                </div>
                <div
                  className="h-px flex-1 hidden sm:block"
                  style={{ background: `linear-gradient(90deg, ${svc.color}60, transparent)` }}
                />
              </div>

              <h3
                className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.02em' }}
              >
                {svc.title}
              </h3>

              <p className="text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 text-gray-500 dark:text-white/55">
                {isMobile ? svc.desc.slice(0, 100) + (svc.desc.length > 100 ? '...' : '') : svc.desc}
              </p>

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-y-2 sm:gap-y-3 gap-x-4 mb-6 sm:mb-10`}>
                {svc.features.slice(0, isMobile ? 3 : 4).map((f: string) => (
                  <div key={f} className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: svc.color }}
                    />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-white/65">{f}</span>
                  </div>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={onDevis}
                whileHover={!isMobile ? { scale: 1.04, y: -2 } : {}}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${svc.color}, ${svc.color}CC)`,
                  boxShadow: `0 8px 24px ${svc.color}35`,
                }}
              >
                <FileText size={isMobile ? 13 : 15} />
                {t('services_quote_btn')}
                <ArrowRight size={isMobile ? 12 : 15} className="group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>
            </div>

            {/* ── Right: image carousel ── */}
            <div className="relative">
              <div
                className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-full h-full rounded-2xl pointer-events-none hidden sm:block"
                style={{ border: `1.5px solid ${svc.color}25` }}
              />

              <ServiceCarousel images={images} color={svc.color} title={svc.title} />

              <div
                className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 w-10 h-10 sm:w-14 sm:h-14 rounded-xl pointer-events-none hidden sm:block"
                style={{ background: `${svc.color}12`, border: `1.5px solid ${svc.color}25` }}
              />

              <div
                className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.88)',
                  backdropFilter: 'blur(8px)',
                  color: svc.color,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}
              >
                <svc.icon size={isMobile ? 10 : 12} />
                {svc.short}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress bar ── */}
        {!isMobile && (
          <div className="mt-10 sm:mt-14 flex gap-1.5 justify-center">
            {SERVICES_DATA.map((s, i) => (
              <div
                key={s.id}
                className="relative h-0.5 rounded-full transition-all duration-500 overflow-hidden"
                style={{ width: activeIdx === i ? 40 : 8, background: 'rgba(0,0,0,0.12)' }}
              >
                {activeIdx === i && !isUserInteracting && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: s.color }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {!isMobile && !isUserInteracting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-5 sm:mt-6"
          >
            <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-white/25 uppercase tracking-wider">
              {t('services_auto')}
            </p>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />
    </section>
  );
}
