import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FileText, ArrowRight, ChevronDown, HardHat, Truck, Snowflake, Building2, Package, Shield, Award, Play, Circle, Zap } from 'lucide-react';
import { Counter } from './ui-primitives';

const HERO_IMAGES = [
  {
    url: "/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.00.52 PM (1).jpeg",
    title: "Froid Industriel",
    description: "Solutions de refroidissement haute performance"
  },
  {
    url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM.jpeg",
    title: "Installation Technique",
    description: "Équipements dernier cri"
  },
  {
    url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.37 PM (1).jpeg",
    title: "Transport & Logistique",
    description: "Flotte moderne et réactive"
  },
  {
    url: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg",
    title: "Charpente Métallique",
    description: "Structures robustes et durables"
  },
];

const STATS = [
  { value: 5, suffix: '+', label: "Années d'expérience", icon: Award },
  { value: 200, suffix: '+', label: 'Produits disponibles', icon: Package },
  { value: 50, suffix: '+', label: 'Clients satisfaits', icon: Shield },
];

const SERVICES = [
  { name: "Charpente Métallique", icon: HardHat, gradient: "from-amber-500 to-yellow-600", color: "#C8962E" },
  { name: "Transport Routier", icon: Truck, gradient: "from-blue-500 to-blue-600", color: "#3B82F6" },
  { name: "Froid Industriel", icon: Snowflake, gradient: "from-cyan-500 to-cyan-600", color: "#06B6D4" },
  { name: "Bâtiment & Construction", icon: Building2, gradient: "from-emerald-500 to-emerald-600", color: "#10B981" },
];

interface HeroProps { onDevis: () => void }

export function Hero({ onDevis }: HeroProps) {
  const { scrollY } = useScroll();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  
  const yOffset = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.5]);

  // Carousel images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter pour les services
  useEffect(() => {
    const currentService = SERVICES[serviceIndex].name;
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setTypedText(prev => prev.slice(0, -1));
        if (typedText === "") {
          setIsDeleting(false);
          setServiceIndex((prev) => (prev + 1) % SERVICES.length);
        }
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setTypedText(currentService.slice(0, typedText.length + 1));
        if (typedText.length + 1 === currentService.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 60);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, serviceIndex]);

  // Curseur
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  const currentService = SERVICES[serviceIndex];
  const CurrentIcon = currentService.icon;
  const currentColor = currentService.color;

  return (
    <section className="relative min-h-screen overflow-hidden">
      
      {/* Background Carousel avec effet cinématique */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <img
              src={HERO_IMAGES[currentIndex].url}
              alt={HERO_IMAGES[currentIndex].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Overlay élégant pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        
        {/* Effet de lumière qui bouge */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ background: `${currentColor}20` }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Contenu principal */}
      <motion.div 
        className="relative z-10 min-h-screen flex items-center"
        style={{ y: yOffset, opacity }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full py-20">
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Colonne gauche - Texte */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
              >
                <Zap className="w-4 h-4 text-[#C8962E]" />
                <span className="text-[#C8962E] text-sm font-semibold uppercase tracking-wider">
                  Leader en Guinée
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8962E] animate-pulse" />
              </motion.div>

              {/* Titre */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                L'excellence en{" "}
                <span 
                  className="relative inline-block"
                  style={{ color: currentColor }}
                >
                  {typedText}
                  <span 
                    className="inline-block w-[3px] h-10 align-middle ml-1"
                    style={{ 
                      background: currentColor,
                      opacity: showCursor ? 1 : 0,
                    }}
                  />
                </span>
                <br />
                à votre service
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed max-w-lg"
              >
                Solutions intégrées pour l'industrie et la construction en Guinée.
                De la conception à la réalisation, nous bâtissons l'avenir ensemble.
              </motion.p>

              {/* Boutons */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <a
                 href="#gallery"
                  className="group px-8 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-xl text-base"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentColor}, ${currentColor}dd)`,
                    boxShadow: `0 10px 30px ${currentColor}40`
                  }}
                >
                  <FileText className="w-5 h-5" />
                  Gallerie
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#services"
                  className="px-8 py-4 rounded-xl font-semibold text-white border border-white/30 backdrop-blur-sm flex items-center justify-center gap-2 transition-all hover:bg-white/10"
                >
                  Nos services
                  <ChevronDown className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex gap-8 pt-8 border-t border-white/20"
              >
                {STATS.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <stat.icon className="w-5 h-5 text-[#C8962E]" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        <Counter to={stat.value} suffix={stat.suffix} />
                      </div>
                      <p className="text-white/40 text-xs uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Colonne droite - Carte d'image active */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Carte flottante */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={HERO_IMAGES[currentIndex].url}
                        alt={HERO_IMAGES[currentIndex].title}
                        className="w-full h-[500px] object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl" />
                      
                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {HERO_IMAGES[currentIndex].title}
                        </h3>
                        <p className="text-white/60">
                          {HERO_IMAGES[currentIndex].description}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Indicateurs */}
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
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Explorer</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5 text-white/40" />
        </motion.div>
      </motion.div>

      {/* Miniatures mobiles */}
      <div className="absolute bottom-20 left-0 right-0 lg:hidden z-20">
        <div className="flex justify-center gap-2 px-4">
          {HERO_IMAGES.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-12 h-12 opacity-100' 
                  : 'w-10 h-10 opacity-50'
              } rounded-lg overflow-hidden`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}