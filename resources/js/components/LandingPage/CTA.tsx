import { ArrowRight, Calendar, Clock, FileText, MessageCircle, Phone, Sparkles, Star, ThumbsUp } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

export function CTABanner({ onDevis }: { onDevis: () => void }) {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      
      {/* Fond minimaliste */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-[#0A0F1A] dark:via-[#0B1120] dark:to-[#0A0F1A]" />
      
      {/* Effet de lumière doux */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C8962E]/5 blur-3xl" />
      
      {/* Ligne décorative top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />
      
      {/* Ligne décorative bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8">
        
        {/* Badge */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8962E]/10 border border-[#C8962E]/20">
              <Sparkles className="w-4 h-4 text-[#C8962E]" />
              <span className="text-[#C8962E] text-xs font-semibold uppercase tracking-wider">
                Prêt à démarrer ?
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Titre */}
        <FadeIn delay={0.1}>
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Donnez vie à votre
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#C8962E] to-[#E8B84B]">
              projet industriel
            </span>
          </h2>
        </FadeIn>

        {/* Description */}
        <FadeIn delay={0.2}>
          <p className="text-center text-gray-500 dark:text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-12">
            Une équipe d'experts à votre écoute. Réponse sous 24h pour concrétiser vos ambitions.
          </p>
        </FadeIn>

        {/* Cartes d'engagement */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C8962E]/10">
                <Clock className="w-5 h-5 text-[#C8962E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Réponse rapide</p>
                <p className="text-xs text-gray-500 dark:text-white/40">Sous 24h ouvrables</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C8962E]/10">
                <Star className="w-5 h-5 text-[#C8962E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Qualité garantie</p>
                <p className="text-xs text-gray-500 dark:text-white/40">Matériaux certifiés</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#C8962E]/10">
                <ThumbsUp className="w-5 h-5 text-[#C8962E]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Satisfaction client</p>
                <p className="text-xs text-gray-500 dark:text-white/40">100% de retours positifs</p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Boutons CTA */}
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          

            <motion.a
              href="tel:+224600000000"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl font-semibold text-gray-700 dark:text-white flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:border-[#C8962E] hover:bg-[#C8962E]/5 transition-all"
            >
              <Phone className="w-5 h-5 text-[#C8962E]" />
              +224 614 60 44 44
            </motion.a>
          </div>
        </FadeIn>

        {/* Petite note */}
        <FadeIn delay={0.5}>
          <p className="text-center text-xs text-gray-400 dark:text-white/30 mt-8">
            * Engagement sans obligation. Devis personnalisé sous 24h.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}