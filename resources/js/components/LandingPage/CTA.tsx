import { ArrowRight, BarChart3, FileText, Phone } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

export function CTABanner({ onDevis }: { onDevis: () => void }) {
  return (
    <section className="relative py-24 overflow-hidden
      bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800
      dark:from-[#0A1520] dark:via-[#1A2B4A] dark:to-[#0A1520]">

      {/* Lignes animées */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute h-px w-full"
            style={{
              top: `${i * 20}%`,
              background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.2),transparent)",
              transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-[#C8962E]/15 border border-[#C8962E]/30">
            <BarChart3 size={14} className="text-[#C8962E]" />
            <span className="text-[#C8962E] text-xs uppercase tracking-[0.25em] font-medium">Lancez votre projet</span>
          </div>

          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }}
            className="text-5xl lg:text-7xl font-bold mb-6 text-white dark:text-white">
            Votre projet mérite le meilleur
          </h2>

          <p className="text-slate-300 dark:text-white/60 text-lg mb-10 max-w-2xl mx-auto">
            Discutons ensemble de vos besoins. Notre équipe vous répond sous 24h ouvrables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
            <a href="tel:+224600000000"
              className="px-10 py-5 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all border border-white/20 hover:bg-white/10">
              <Phone size={20} /> +224 600 000 000
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}