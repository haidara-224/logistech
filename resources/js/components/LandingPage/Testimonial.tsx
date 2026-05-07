import { useEffect, useState } from "react";
import { FadeIn } from "./ui-primitives";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const TESTIMONIALS_META = [
  { name: "Mamadou Diallo",        roleKey: "testi_1_role", textKey: "testi_1_text", rating: 5, color: "#C8962E" },
  { name: "Fatoumata Camara",      roleKey: "testi_2_role", textKey: "testi_2_text", rating: 5, color: "#E8B84B" },
  { name: "Ibrahima Sory Kouyaté", roleKey: "testi_3_role", textKey: "testi_3_text", rating: 5, color: "#D4A030" },
  { name: "Mariama Baldé",         roleKey: "testi_4_role", textKey: "testi_4_text", rating: 5, color: "#C8962E" },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={14} fill="#C8962E" className="text-[#C8962E]" />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS_META.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const activeMeta = TESTIMONIALS_META[current];

  return (
    <section id="testimonials" className="relative py-32 overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/50 dark:from-[#060D1A] dark:via-[#0B1628] dark:to-[#060D1A]">

      <div
        className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #C8962E 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-amber-400/5 dark:bg-[#C8962E]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Header */}
        <FadeIn className="text-center mb-20">
          <span className="text-amber-600 dark:text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">
            {t('testi_badge')}
          </span>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-5xl lg:text-7xl font-bold mt-3 text-gray-900 dark:text-white"
          >
            {t('testi_title')}
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/40 text-lg max-w-2xl mx-auto">
            {t('testi_subtitle')}
          </p>
        </FadeIn>

        {/* Featured testimonial */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <div className="relative mb-8">
              <Quote size={80} className="text-amber-300/40 dark:text-[#C8962E]/20 mx-auto" strokeWidth={1.5} />
            </div>

            <p
              style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
              className="text-2xl lg:text-3xl leading-relaxed mb-10 text-gray-700 dark:text-white/80"
            >
              "{t(activeMeta.textKey)}"
            </p>

            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeMeta.color}20, ${activeMeta.color}10)`,
                  border: `1px solid ${activeMeta.color}30`,
                }}
              >
                <User size={40} style={{ color: activeMeta.color }} strokeWidth={1.5} />
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{activeMeta.name}</p>
                <p className="text-amber-600 dark:text-[#C8962E] text-sm mt-1">{t(activeMeta.roleKey)}</p>
                <div className="mt-3"><Stars n={activeMeta.rating} /></div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots navigation */}
        <div className="flex justify-center gap-3 mb-20">
          {TESTIMONIALS_META.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: current === i ? "2.5rem" : "0.5rem",
                height: "0.5rem",
                background: current === i ? "#C8962E" : "rgba(200,150,46,0.3)",
              }}
            />
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS_META.map((testimonial, i) => {
            const isActive = current === i;
            return (
              <FadeIn key={testimonial.name} delay={i * 0.1}>
                <button
                  onClick={() => setCurrent(i)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group
                    ${isActive
                      ? "bg-white shadow-xl shadow-amber-100/50 dark:bg-white/3 dark:shadow-none dark:border-[#C8962E]/30"
                      : "bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-amber-300 dark:bg-white/2 dark:border-white/5 dark:hover:border-[#C8962E]/20"
                    }`}
                  style={isActive ? {
                    border: `1px solid ${testimonial.color}30`,
                    boxShadow: `0 20px 40px -12px ${testimonial.color}20`,
                  } : {}}
                >
                  <div className="mb-4"><Stars n={testimonial.rating} /></div>

                  <p className="text-sm leading-relaxed mb-5 line-clamp-3 text-gray-600 dark:text-white/60">
                    "{t(testimonial.textKey)}"
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: isActive ? `${testimonial.color}15` : "rgba(200,150,46,0.08)" }}
                    >
                      <User size={18} style={{ color: isActive ? testimonial.color : "#C8962E" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{testimonial.name}</p>
                      <p className="text-xs text-gray-400 dark:text-white/30 truncate">{t(testimonial.roleKey).split(",")[0]}</p>
                    </div>
                  </div>
                </button>
              </FadeIn>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20 pt-8 border-t border-gray-200/50 dark:border-white/5"
        >
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-[#C8962E]/10 flex items-center justify-center">
                <Star size={14} className="text-amber-600 dark:text-[#C8962E]" fill="#C8962E" />
              </div>
              <span className="text-sm text-gray-600 dark:text-white/40">{t('testi_clients')}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-[#C8962E]/10 flex items-center justify-center">
                <Quote size={14} className="text-amber-600 dark:text-[#C8962E]" />
              </div>
              <span className="text-sm text-gray-600 dark:text-white/40">{t('testi_rate')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
