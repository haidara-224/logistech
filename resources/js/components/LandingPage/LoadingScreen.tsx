import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minDisplayTime?: number;
}

export function LoadingScreen({ onLoadingComplete, minDisplayTime = 2000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete?.();
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onLoadingComplete]);

  // Ne pas rendre le contenu qui dépend de window pendant le SSR
  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #060D1A 0%, #0A1525 50%, #060D1A 100%)"
          }}
        >
          {/* Background animated particles - Version sans window */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => {
              // Utiliser des valeurs fixes ou calculées avec Math.random() qui est disponible
              const randomX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000;
              const randomY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 800;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-[#C8962E]/20"
                  initial={{
                    x: randomX,
                    y: randomY,
                  }}
                  animate={{
                    y: [null, -100, -200],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear",
                  }}
                />
              );
            })}
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4">
            {/* Animated rings */}
            <div className="relative mb-8">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "2px solid rgba(200,150,46,0.3)",
                  width: "140px",
                  height: "140px",
                  marginLeft: "-10px",
                  marginTop: "-10px",
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: "1px solid rgba(200,150,46,0.6)",
                  width: "130px",
                  height: "130px",
                  marginLeft: "-5px",
                  marginTop: "-5px",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />

              {/* Logo container */}
              <motion.div
                className="relative w-[120px] h-[120px] rounded-2xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #C8962E, #E8B84B)",
                  boxShadow: "0 0 60px rgba(200,150,46,0.4)",
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                <div className="w-[110px] h-[110px] rounded-xl overflow-hidden bg-[#060D1A]/20 backdrop-blur-sm flex items-center justify-center">
                  <img 
                    src="/logo.jpeg" 
                    alt="LOGISTECH EQUIP+" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "radial-gradient(circle, rgba(200,150,46,0.8) 0%, transparent 70%)",
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center mb-6"
            >
              <h1 
                className="text-3xl lg:text-4xl font-bold tracking-wider"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <motion.span
                  className="bg-gradient-to-r from-[#C8962E] via-[#E8B84B] to-[#C8962E] bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: "200% auto" }}
                >
                  LOGISTECH
                </motion.span>
              </h1>
              <p className="text-[#C8962E] text-sm tracking-[0.3em] font-light mt-2">
                EQUIP+
              </p>
            </motion.div>

            {/* Loading progress bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="h-[2px] bg-white/10 rounded-full overflow-hidden"
              style={{ width: "200px" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #C8962E, #E8B84B)",
                }}
                animate={{
                  width: ["0%", "100%"],
                }}
                transition={{
                  duration: minDisplayTime / 1000,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/40 text-xs mt-4 tracking-wider"
            >
              CHARGEMENT...
            </motion.p>

            {/* Dots animation */}
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#C8962E]"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom gradient bar */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, transparent, #C8962E, transparent)",
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}