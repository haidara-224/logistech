import { ArrowRight, Award, Clock, FileText, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

const VALUES = [
  { 
    icon: Clock,  
    title: "Respect des Délais",   
    desc: "Organisation rigoureuse, chaque projet livré dans les temps.",       
    color: "#C8962E" 
  },
  { 
    icon: Zap,    
    title: "Rapidité d'Exécution", 
    desc: "Équipe réactive, montage rapide et efficace.",               
    color: "#E8B84B" 
  },
  { 
    icon: Shield, 
    title: "Qualité du Travail",    
    desc: "Structures solides et durables. Satisfaction client garantie.",                
    color: "#C8962E" 
  },
  { 
    icon: Award,  
    title: "Expertise Reconnue",    
    desc: "Près de deux décennies d'expérience cumulée.",                    
    color: "#E8B84B" 
  },
];

const ACHIEVEMENTS = [
  { value: "50+", label: "Projets réalisés", icon: TrendingUp },
  { value: "100%", label: "Clients satisfaits", icon: Users },
  { value: "24/7", label: "Support disponible", icon: Sparkles },
];

export function About({ onDevis }: { onDevis: () => void }) {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      
      {/* Fond épuré */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-[#0A0F1A] dark:via-[#0B1120] dark:to-[#0A0F1A]" />
      
      {/* Cercles décoratifs minimalistes */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C8962E]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E8B84B]/5 blur-3xl" />
      
      {/* Ligne décorative */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Partie gauche : Image élégante ── */}
          <FadeIn dir="right" className="relative">
            <div className="relative group">
              {/* Cadre décoratif */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#C8962E]/20 to-[#E8B84B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
              
              {/* Image principale */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.17 PM (1).jpeg"
                  alt="LOGISTECH EQUIP+"
                  className="w-full h-[500px] md:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Badges flottants */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute -left-4 top-12 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#C8962E]/20"
              >
                <div className="text-2xl font-bold text-[#C8962E]">2020</div>
                <div className="text-xs text-gray-500 dark:text-white/50">Fondation</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -right-4 bottom-12 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-[#C8962E]/20"
              >
                <div className="text-2xl font-bold text-[#C8962E]">5+</div>
                <div className="text-xs text-gray-500 dark:text-white/50">Années</div>
              </motion.div>

              {/* Ligne dorée */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#C8962E] to-[#E8B84B] rounded-full" />
            </div>
          </FadeIn>

          {/* ── Partie droite : Contenu ── */}
          <div>
            <FadeIn>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8962E]/10 border border-[#C8962E]/20 mb-6">
                <Sparkles className="w-3 h-3 text-[#C8962E]" />
                <span className="text-[#C8962E] text-xs font-semibold uppercase tracking-wider">
                  Notre histoire
                </span>
              </div>

              {/* Titre */}
              <h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Une entreprise bâtie sur la passion
              </h2>

              {/* Description */}
              <p className="text-gray-600 dark:text-white/60 text-base md:text-lg leading-relaxed mb-8">
                Depuis 2020, LOGISTECH EQUIP+ accompagne ses clients dans la réalisation de projets ambitieux. 
                Fondée par des passionnés expérimentés, l'entreprise allie savoir-faire et engagement pour 
                répondre aux exigences des professionnels.
              </p>
            </FadeIn>

            {/* Valeurs - Design carte moderne */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {VALUES.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.1}>
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="group p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-[#C8962E]/30 transition-all duration-300"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                      style={{ background: `${v.color}15` }}
                    >
                      <v.icon size={18} style={{ color: v.color }} />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      {v.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">
                      {v.desc}
                    </p>
                  </motion.div>
                </FadeIn>
              ))}
            </div>

            {/* Achievements */}
            <FadeIn delay={0.4}>
              <div className="flex items-center gap-8 pt-6 border-t border-gray-200 dark:border-white/10">
                {ACHIEVEMENTS.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#C8962E]" />
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {item.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-white/40">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* CTA Button */}
            <FadeIn delay={0.5}>
              <motion.button
                onClick={onDevis}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#C8962E] to-[#E8B84B] shadow-lg hover:shadow-xl transition-all"
              >
                <FileText size={16} />
                Discuter de votre projet
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Ligne décorative bas */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />
    </section>
  );
}