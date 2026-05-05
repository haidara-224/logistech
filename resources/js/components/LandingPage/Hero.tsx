import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, ChevronDown, HardHat, Truck, Snowflake, Building2, Package, Shield, Award, Zap } from 'lucide-react';
import { Counter } from './ui-primitives';
import { useTranslation } from '@/hooks/use-translation';

const HERO_IMAGES = [
  { url: "/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.00.52 PM (1).jpeg", titleKey: 'svc_froid_title', descKey: 'hero_img1_desc' },
  { url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM.jpeg", titleKey: 'hero_img2_title', descKey: 'hero_img2_desc' },
  { url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.37 PM (1).jpeg", titleKey: 'svc_transport_title', descKey: 'hero_img3_desc' },
  { url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg", titleKey: 'svc_charpente_title', descKey: 'hero_img4_desc' },
];

const STATS = [
  { value: 5, suffix: '+', labelKey: 'hero_stat_years', icon: Award },
  { value: 200, suffix: '+', labelKey: 'hero_stat_products', icon: Package },
  { value: 50, suffix: '+', labelKey: 'hero_stat_clients', icon: Shield },
];

const SERVICES_KEYS = [
  { nameKey: 'svc_charpente_title', icon: HardHat, color: "#C8962E" },
  { nameKey: 'svc_transport_title', icon: Truck, color: "#3B82F6" },
  { nameKey: 'svc_froid_title', icon: Snowflake, color: "#06B6D4" },
  { nameKey: 'svc_batiment_title', icon: Building2, color: "#10B981" },
];

export function Hero(_: { onDevis: () => void }) {
  const { t, locale } = useTranslation();
  const { scrollY } = useScroll();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset typewriter on locale change
  useEffect(() => {
    setTypedText('');
    setIsDeleting(false);
    setServiceIndex(0);
  }, [locale]);

  const yOffset = useTransform(scrollY, [0, 500], [0, isMobile ? 30 : 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, isMobile ? 0.7 : 0.5]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, isMobile ? 5000 : 7000);
    return () => clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const currentServiceName = t(SERVICES_KEYS[serviceIndex].nameKey);
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
        if (typedText === "") {
          setIsDeleting(false);
          setServiceIndex((prev) => (prev + 1) % SERVICES_KEYS.length);
        }
      }, isMobile ? 60 : 40);
    } else {
      timeout = setTimeout(() => {
        setTypedText(currentServiceName.slice(0, typedText.length + 1));
        if (typedText.length + 1 === currentServiceName.length) {
          setTimeout(() => setIsDeleting(true), isMobile ? 3000 : 2500);
        }
      }, isMobile ? 90 : 60);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, serviceIndex, isMobile]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), isMobile ? 800 : 500);
    return () => clearInterval(interval);
  }, [isMobile]);

  const currentService = SERVICES_KEYS[serviceIndex];
  const currentColor = currentService.color;

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* Background Carousel */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: isMobile ? 1 : 1.5, ease: "easeInOut" }}
          >
            <img
              src={HERO_IMAGES[currentIndex].url}
              alt={t(HERO_IMAGES[currentIndex].titleKey)}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {!isMobile && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
            style={{ background: `${currentColor}20` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
      </div>

      {/* Contenu principal */}
      <motion.div
        className="relative z-10 min-h-screen flex items-center"
        style={{ y: yOffset, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-16 sm:py-20">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Colonne gauche - Texte */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0.3 : 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 sm:mb-8"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8962E]" />
                <span className="text-[#C8962E] text-[10px] sm:text-sm font-semibold uppercase tracking-wider">
                  {t('hero_badge')}
                </span>
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#C8962E] animate-pulse" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0 : 0.1 }}
                className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('hero_title1')}{" "}
                <span
                  className="relative inline-block"
                  style={{ color: currentColor }}
                >
                  {isMobile ? typedText.slice(0, 15) + (typedText.length > 15 ? '...' : '') : typedText}
                  <span
                    className="inline-block w-[2px] sm:w-[3px] h-6 sm:h-10 align-middle ml-0.5 sm:ml-1"
                    style={{
                      background: currentColor,
                      opacity: showCursor ? 1 : 0,
                    }}
                  />
                </span>
                <br />
                {t('hero_title2')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0.1 : 0.2 }}
                className="text-white/70 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed max-w-lg"
              >
                {isMobile ? t('hero_subtitle_short') : t('hero_subtitle_full')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0.2 : 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12"
              >
                <a
                  href="#gallery"
                  className="group px-5 sm:px-8 py-2.5 sm:py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl text-sm sm:text-base"
                  style={{
                    background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
                    boxShadow: `0 10px 30px ${currentColor}40`
                  }}
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('hero_gallery')}
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#services"
                  className="px-5 sm:px-8 py-2.5 sm:py-4 rounded-xl font-semibold text-white border border-white/30 backdrop-blur-sm flex items-center justify-center gap-2 transition-all hover:bg-white/10 text-sm sm:text-base"
                >
                  {t('hero_services')}
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: isMobile ? 0 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0.3 : 0.4 }}
                className="flex gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-white/20"
              >
                {STATS.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C8962E]" />
                    <div>
                      <div className="text-lg sm:text-2xl font-bold text-white">
                        <Counter to={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-white/40 text-[8px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
                        {isMobile ? t(stat.labelKey).split(' ')[0] : t(stat.labelKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Colonne droite - Carte image active (cachée sur mobile) */}
            {!isMobile && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={HERO_IMAGES[currentIndex].url}
                      alt={t(HERO_IMAGES[currentIndex].titleKey)}
                      className="w-full h-[500px] object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {t(HERO_IMAGES[currentIndex].titleKey)}
                      </h3>
                      <p className="text-white/60">
                        {t(HERO_IMAGES[currentIndex].descKey)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-2 mt-6">
                    {HERO_IMAGES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentIndex
                            ? 'w-8 h-1.5 bg-[#C8962E]'
                            : 'w-1.5 h-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator - caché sur mobile */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs uppercase tracking-widest">{t('hero_explore')}</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      )}

      {/* Miniatures mobiles */}
      {isMobile && (
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="flex justify-center gap-1.5 px-4">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 h-1 rounded-full ${
                  idx === currentIndex ? 'w-6 bg-[#C8962E]' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
