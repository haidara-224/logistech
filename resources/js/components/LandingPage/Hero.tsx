import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, ChevronDown, HardHat, Truck, Snowflake, Building2, Package } from 'lucide-react';
import { Counter } from './ui-primitives';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1920&q=80',
];

const STATS = [
  { val: 5,   suf: '+', label: "Années d'expérience" },
  { val: 200, suf: '+', label: 'Produits'    },
  { val: 50,  suf: '+', label: 'Clients satisfaits'  },

];

const WORDS = [
  "Charpente Métallique",
  "Transport Routier",
  "Froid Industriel",
  "Bâtiment & Construction",
  "Logistique & Stockage"
];

const WORD_COLORS = {
  "Charpente Métallique": "#C8962E",
  "Transport Routier": "#3B82F6",
  "Froid Industriel": "#06B6D4",
  "Bâtiment & Construction": "#10B981",
  "Logistique & Stockage": "#8B5CF6"
};

const WORD_ICONS = {
  "Charpente Métallique": HardHat,
  "Transport Routier": Truck,
  "Froid Industriel": Snowflake,
  "Bâtiment & Construction": Building2,
  "Logistique & Stockage": Package
};

interface HeroProps { onDevis: () => void }

export function Hero({ onDevis }: HeroProps) {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 180]);
  const fadeOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const [imgIdx, setImgIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const currentWord = WORDS[wordIndex];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        if (displayText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % WORDS.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 80);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setCursorVisible(prev => !prev), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const CurrentIcon = WORD_ICONS[WORDS[wordIndex] as keyof typeof WORD_ICONS];
  const currentColor = WORD_COLORS[WORDS[wordIndex] as keyof typeof WORD_COLORS];

  return (
    <section id="hero" className="relative h-screen min-h-[600px] sm:min-h-[700px] flex items-center overflow-hidden">

   
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={imgIdx}
            src={HERO_IMAGES[imgIdx]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(6,13,26,0.95) 0%, rgba(11,22,40,0.85) 50%, rgba(6,13,26,0.95) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(200,150,46,0.12) 0%, transparent 70%)' }} />
        
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(200,150,46,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(200,150,46,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <motion.div 
          className="absolute top-1/4 -left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${currentColor}40, transparent)` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>

      <div className="absolute top-0 right-0 w-px h-full opacity-30 hidden sm:block"
        style={{ background: 'linear-gradient(180deg, transparent, #C8962E 40%, #C8962E 60%, transparent)' }} />

      {/* ── Content ── */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full" style={{ opacity: fadeOpacity }}>
        <div className="max-w-4xl">

          {/* Badge - version mobile plus compacte */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 sm:gap-3 mb-5 sm:mb-8 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full backdrop-blur-sm"
            style={{ 
              background: 'rgba(200,150,46,0.08)', 
              border: '1px solid rgba(200,150,46,0.25)',
              boxShadow: '0 4px 20px rgba(200,150,46,0.1)'
            }}>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C8962E] animate-pulse" />
            <span className="text-[#C8962E] text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] font-medium whitespace-nowrap">
              Leader Guinée
            </span>
          </motion.div>

          {/* Heading - tailles réduites sur mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.1 }}
            className="text-4xl sm:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6"
          >
            <span className="text-white">L'excellence en</span>
            <br />
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
              <span 
                className="inline-block transition-all duration-300 text-2xl sm:text-5xl lg:text-7xl"
                style={{ color: currentColor }}
              >
                {displayText}
                <span 
                  className="inline-block w-[2px] sm:w-[3px] h-6 sm:h-10 lg:h-12 ml-0.5 sm:ml-1"
                  style={{ 
                    background: currentColor,
                    opacity: cursorVisible ? 1 : 0,
                    boxShadow: `0 0 4px ${currentColor}`
                  }}
                />
              </span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                style={{ 
                  background: `${currentColor}15`,
                  border: `1px solid ${currentColor}30`
                }}
              >
             <CurrentIcon 
  className="w-4 h-4 sm:w-6 sm:h-6" 
  style={{ color: currentColor }} 
/>
              </motion.div>
            </div>
            <span className="text-[#C8962E] block text-3xl sm:text-5xl lg:text-7xl mt-2 sm:mt-4">à votre service.</span>
          </motion.h1>

          {/* Description - texte plus petit sur mobile */}
          <motion.p
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-white/50 text-sm sm:text-lg lg:text-xl mb-6 sm:mb-10 max-w-2xl leading-relaxed backdrop-blur-sm"
          >
            Charpentes métalliques, transport, froid, construction et logistique —
            des solutions sur mesure pour bâtir l'Afrique.
          </motion.p>

          {/* Boutons CTA - version mobile plus compacte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-5"
          >
      <button 
  onClick={onDevis}
  className="group relative overflow-hidden px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm sm:text-base"
  style={{ 
    background: 'linear-gradient(135deg, #C8962E, #E8B84B)', 
    boxShadow: '0 20px 40px rgba(200,150,46,0.3)'
  }}
>
  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
  Devis gratuit
  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
</button>

<a 
  href="#services"
  className="group px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm text-sm sm:text-base"
  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
>
  Découvrir 
  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform" />
</a>
          </motion.div>

          {/* Stats - version mobile responsive */}
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 1.4 }}
            className="flex flex-wrap justify-between sm:justify-start gap-4 sm:gap-12 mt-10 sm:mt-20 pt-6 sm:pt-8 border-t border-white/10 backdrop-blur-sm"
          >
            {STATS.map((s, i) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1 }}
                className="flex-1 sm:flex-none text-center sm:text-left"
              >
                <p className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] bg-clip-text text-transparent" 
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <Counter to={s.val} suffix={s.suf} />
                </p>
                <p className="text-white/20 text-[8px] sm:text-xs uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - caché sur très petit mobile */}
      <motion.div
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.8 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20"
      >
        <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Scroll</p>
        <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 backdrop-blur-sm">
          <motion.div
            className="w-1 h-3 rounded-full"
            style={{ background: 'linear-gradient(180deg, #C8962E, #E8B84B)' }}
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </section>
  );
}