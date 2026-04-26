import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, ChevronDown } from 'lucide-react';
import { Counter } from './ui-primitives';


const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
  'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1920&q=80',
];

const STATS = [
  { val: 5,   suf: '+', label: "Années d'expérience" },
  { val: 200, suf: '+', label: 'Projets réalisés'    },
  { val: 50,  suf: '+', label: 'Clients satisfaits'  },
  { val: 3,   suf: '',  label: 'Pays desservis'      },
];

interface HeroProps { onDevis: () => void }

export function Hero({ onDevis }: HeroProps) {
  const { scrollY }   = useScroll();
  const parallaxY     = useTransform(scrollY, [0, 600], [0, 180]);
  const fadeOpacity   = useTransform(scrollY, [0, 400], [1, 0]);

  const [imgIdx, setImgIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[700px] flex items-center overflow-hidden">

      {/* ── Parallax background ── */}
      <motion.div className="absolute inset-0" style={{ y: parallaxY }}>
        <AnimatePresence mode="sync">
          <motion.img
            key={imgIdx}
            src={HERO_IMAGES[imgIdx]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1,   scale: 1.04 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg,rgba(6,13,26,0.92) 0%,rgba(11,22,40,0.75) 50%,rgba(6,13,26,0.88) 100%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 20% 50%,rgba(200,150,46,0.08) 0%,transparent 60%)' }} />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(200,150,46,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(200,150,46,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </motion.div>

      {/* Gold accent line */}
      <div className="absolute top-0 right-0 w-px h-full opacity-20"
        style={{ background: 'linear-gradient(180deg,transparent,#C8962E 40%,#C8962E 60%,transparent)' }} />

      {/* ── Content ── */}
      <motion.div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full" style={{ opacity: fadeOpacity }}>
        <div className="max-w-3xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
            style={{ background: 'rgba(200,150,46,0.1)', border: '1px solid rgba(200,150,46,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C8962E] animate-pulse" />
            <span className="text-[#C8962E] text-xs uppercase tracking-[0.25em] font-medium">
              Depuis 2020 · Conakry, Guinée
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.05 }}
            className="text-6xl lg:text-8xl font-bold text-white mb-6"
          >
            L'excellence
            <br />
            <span style={{ WebkitTextStroke: '1px rgba(200,150,46,0.6)', color: 'transparent', display: 'block' }}>
              industrielle
            </span>
            <span className="text-[#C8962E]">à votre service.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/60 text-lg lg:text-xl mb-10 max-w-xl leading-relaxed">
            Charpentes métalliques, transport routier, froid industriel et construction —
            LOGISTECH EQUIP+ bâtit votre avenir depuis Conakry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4">
            <button onClick={onDevis}
              className="group relative overflow-hidden px-8 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 20px 60px rgba(200,150,46,0.35)' }}>
              <FileText size={20} />
              Demander un devis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#services"
              className="group px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-3 transition-all hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
              Nos services <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-white/10">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-[#C8962E]" style={{ fontFamily: "'Cormorant Garamond',serif" }}>
                  <Counter to={s.val} suffix={s.suf} />
                </p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <p className="text-white/30 text-xs uppercase tracking-[0.3em]">Défiler</p>
        <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2.5 rounded-full bg-[#C8962E]"
            animate={{ y: [0, 14, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} />
        </div>
      </motion.div>
    </section>
  );
}