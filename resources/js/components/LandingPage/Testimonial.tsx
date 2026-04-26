import { useEffect, useState } from "react";
import { FadeIn } from "./ui-primitives";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  { name: "Mamadou Diallo",        role: "Directeur, Société Minière de Guinée", rating: 5, text: "LOGISTECH EQUIP+ a réalisé notre hangar industriel dans les délais impartis. Qualité irréprochable, équipe professionnelle. Je recommande sans hésitation.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { name: "Fatoumata Camara",      role: "Gérante, Supermarché Le Marché",       rating: 5, text: "Nos chambres froides ont été installées avec une précision remarquable. Le service après-vente est réactif et disponible. Excellent partenaire.",               avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { name: "Ibrahima Sory Kouyaté", role: "PDG, Import-Export IK",                rating: 5, text: "Le transport de nos marchandises depuis Conakry vers la Côte d'Ivoire se passe toujours sans accroc. Fiabilité et ponctualité au rendez-vous.",               avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
  { name: "Mariama Baldé",         role: "Promotrice immobilière",                rating: 5, text: "La construction de notre résidence a été menée avec rigueur. L'équipe a su respecter nos exigences qualité tout en livrant dans les temps.",                  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => <Star key={i} size={12} fill="#C8962E" className="text-[#C8962E]" />)}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const active = TESTIMONIALS[current];

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-amber-50 dark:bg-[#0B1628]">
      {/* Glow décoratif */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,150,46,0.08)_0%,transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,150,46,0.05)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <FadeIn className="text-center mb-20">
          <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Témoignages</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }}
            className="text-5xl lg:text-7xl font-bold mt-3 text-slate-900 dark:text-white">
            Ils nous font confiance
          </h2>
        </FadeIn>

        {/* Témoignage vedette */}
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center mb-16">
            <Quote size={60} className="text-[#C8962E]/30 mx-auto mb-6" />
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" }}
              className="text-xl lg:text-2xl leading-relaxed mb-8 text-slate-700 dark:text-white/80">
              "{active.text}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src={active.avatar} alt={active.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#C8962E]/30" />
              <div className="text-left">
                <p className="font-semibold text-slate-900 dark:text-white">{active.name}</p>
                <p className="text-[#C8962E] text-sm">{active.role}</p>
                <div className="mt-1"><Stars n={active.rating} /></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-16">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="rounded-full transition-all duration-300"
              style={{ width: current === i ? "2rem" : "0.5rem", height: "0.5rem",
                background: current === i ? "#C8962E" : "rgba(200,150,46,0.25)" }} />
          ))}
        </div>

        {/* Cartes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.1}>
              <button onClick={() => setCurrent(i)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 border
                  ${current === i
                    ? "bg-white border-amber-300 shadow-lg shadow-amber-100 dark:bg-[#C8962E]/06 dark:border-[#C8962E]/25 dark:shadow-none"
                    : "bg-white/60 border-stone-200 hover:border-amber-300 dark:bg-white/[0.02] dark:border-white/[0.05] dark:hover:border-[#C8962E]/20"
                  }`}>
                <div className="mb-3"><Stars n={t.rating} /></div>
                <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-slate-600 dark:text-white/60">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-slate-400 dark:text-white/30">{t.role.split(",")[0]}</p>
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}