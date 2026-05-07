import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { HardHat, Truck, Snowflake, Building2, Package } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { usePage } from "@inertiajs/react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minDisplayTime?: number;
}

const ICONS = [HardHat, Truck, Snowflake, Building2, Package];
const ICON_COLORS = ["#C8962E", "#3B82F6", "#06B6D4", "#10B981", "#8B5CF6"];

export function LoadingScreen({ onLoadingComplete, minDisplayTime = 2000 }: LoadingScreenProps) {
  const { t } = useTranslation();
  const { landing } = usePage().props as any;
  const logoSrc = landing?.logo || '/logo.jpg';
  const [isLoading, setIsLoading] = useState(true);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Détecter le thème
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark') ||
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    // Observer les changements de thème
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Rotation des icônes
  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % ICONS.length);
    }, 400);

    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDisplayTime) * 100, 100);
      setProgress(newProgress);
    }, 16);

    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, minDisplayTime);

    return () => {
      clearInterval(iconInterval);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDisplayTime, onLoadingComplete]);

  const CurrentIconComponent = ICONS[currentIcon];
  const currentColor = ICON_COLORS[currentIcon % ICON_COLORS.length];

  // Fond dynamique selon le thème
  const getBackground = () => {
    if (isDark) {
      return "linear-gradient(135deg, #0A0F1A 0%, #0B1120 50%, #0A0F1A 100%)";
    }
    return "linear-gradient(135deg, #FFFFFF 0%, #F8F5F0 50%, #FFFFFF 100%)";
  };

  const getTextColor = () => isDark ? "text-white" : "text-gray-900";
  const getSubTextColor = () => isDark ? "text-white/30" : "text-gray-400";
  const getBorderColor = () => isDark ? "white/10" : "gray-200";

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: getBackground() }}
        >
          {/* Effet de grain subtil */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
          
          {/* Cercles lumineux animés */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, ${currentColor}15, transparent 70%)` }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Contenu principal */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            
            {/* Logo animé */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative mb-8"
            >
              {/* Anneau extérieur */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${currentColor}30`,
                  width: "160px",
                  height: "160px",
                  marginLeft: "-20px",
                  marginTop: "-20px",
                }}
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
              />
              
              {/* Anneau intérieur */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid ${currentColor}60`,
                  width: "140px",
                  height: "140px",
                  marginLeft: "-10px",
                  marginTop: "-10px",
                }}
                animate={{ rotate: -360, scale: [1, 1.03, 1] }}
                transition={{ rotate: { duration: 6, repeat: Infinity, ease: "linear" }, scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" } }}
              />

              {/* Logo central */}
              <motion.div
                className="relative w-[250px] h-[250px] rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${currentColor}, ${currentColor}cc)`,
                  boxShadow: `0 0 40px ${currentColor}40`
                }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-full h-full bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
                  <img 
                    src={logoSrc}
                    alt="LOGISTECH EQUIP+" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Titre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-6"
            >
              <h1 className="text-4xl lg:text-5xl font-bold tracking-wide"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="bg-gradient-to-r from-[#C8962E] via-[#E8B84B] to-[#C8962E] bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% auto" }}>
                  LOGISTECH
                </span>
              </h1>
              <p className="text-[#C8962E] text-sm tracking-[0.3em] font-light mt-1">
                EQUIP+
              </p>
            </motion.div>

            {/* Icône changeante */}
            <motion.div
              key={currentIcon}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="mb-6"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${currentColor}10`, border: `1px solid ${currentColor}30` }}
              >
                <CurrentIconComponent className="w-6 h-6" style={{ color: currentColor }} />
              </div>
            </motion.div>

            {/* Barre de progression élégante */}
            <div className="relative mb-3">
              <div className={`w-48 h-[1px] bg-${getBorderColor()} rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${currentColor}, ${currentColor}80)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
              {/* Points lumineux sur la barre */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C8962E]"
                style={{ left: `${progress}%` }}
                animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Texte de chargement */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`${getSubTextColor()} text-[10px] tracking-[0.3em] font-medium`}
            >
              {t('loading_text')}
            </motion.p>

            {/* Points de progression */}
            <div className="flex gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 rounded-full bg-[#C8962E]"
                  animate={{
                    scale: progress > (i + 1) * 33 ? [1, 1.5, 1] : [1, 1, 1],
                    opacity: progress > (i + 1) * 33 ? [0.5, 1, 0.5] : 0.2,
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>

            {/* Slogan */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`${getSubTextColor()} text-[9px] tracking-wider mt-6 max-w-[200px] text-center opacity/50`}
            >
              {t('loading_slogan')}
            </motion.p>
          </div>

          {/* Ligne lumineuse en bas */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${currentColor}, transparent)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}