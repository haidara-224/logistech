import { ArrowRight, BarChart3, FileText, Phone } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

// ─── CTA BANNER ──────────────────────────────────────────────────────────────
export function CTABanner({ onDevis }: { onDevis: () => void }) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0A1520 0%, #1A2B4A 50%, #0A1520 100%)" }} />
      {/* Gold lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute h-px w-full"
            style={{ top: `${i * 20}%`, background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.15),transparent)", transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)` }}
            animate={{ x: ["-100%", "100%"] }} transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(200,150,46,0.1)", border: "1px solid rgba(200,150,46,0.25)" }}>
            <BarChart3 size={14} className="text-[#C8962E]" />
            <span className="text-[#C8962E] text-xs uppercase tracking-[0.25em]">Lancez votre projet</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-5xl lg:text-7xl font-bold text-white mb-6">
            Votre projet mérite le meilleur
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
            Discutons ensemble de vos besoins. Notre équipe vous répond sous 24h ouvrables.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onDevis} className="group px-10 py-5 rounded-xl font-bold text-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)", boxShadow: "0 30px 80px rgba(200,150,46,0.4)" }}>
              <FileText size={22} /> Obtenir un devis gratuit
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="tel:+224600000000" className="px-10 py-5 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-3 transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <Phone size={20} /> +224 600 000 000
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}