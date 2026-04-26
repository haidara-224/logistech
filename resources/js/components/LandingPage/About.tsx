import { ArrowRight, Award, Clock, FileText, Shield, Zap } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

const VALUES = [
  { icon: Clock,  title: "Respect des Délais",   desc: "Organisation rigoureuse, chaque projet livré dans les temps. Le planning est sacré.",       color: "#C8962E" },
  { icon: Zap,    title: "Rapidité d'Exécution", desc: "Équipe réactive, montage rapide et efficace. Nous limitons les interruptions.",               color: "#E8B84B" },
  { icon: Shield, title: "Qualité du Travail",    desc: "Structures solides et durables. La satisfaction client guide chaque décision.",                color: "#C8962E" },
  { icon: Award,  title: "Expertise Reconnue",    desc: "Près de deux décennies d'expérience cumulée au cœur de chaque chantier.",                    color: "#E8B84B" },
];

export function About({ onDevis }: { onDevis: () => void }) {
  return (
    <section id="about" className="
      relative py-32
      bg-stone-100 dark:bg-[#0B1628]
    ">
      {/* Fond déco */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,150,46,0.06)_0%,transparent_60%)]
        dark:bg-[radial-gradient(ellipse_at_80%_50%,rgba(200,150,46,0.04)_0%,transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* ── Image stack ── */}
          <FadeIn dir="right" className="relative">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                  alt="À propos"
                  className="w-full h-full object-cover brightness-75 saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/80 to-transparent dark:from-[#060D1A]/80" />
              </div>

              {/* Carte flottante droite */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 top-12 p-5 rounded-2xl
                  bg-white/95 border border-amber-200 shadow-xl shadow-amber-100/50
                  dark:bg-[#0B1628]/95 dark:border-[#C8962E]/25 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]
                  backdrop-blur-xl"
              >
                <p className="text-[#C8962E] text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond',serif" }}>2020</p>
                <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">Année de fondation</p>
              </motion.div>

              {/* Carte flottante gauche */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -left-8 bottom-16 p-5 rounded-2xl
                  bg-white/95 border border-amber-200 shadow-xl shadow-amber-100/50
                  dark:bg-[#0B1628]/95 dark:border-[#C8962E]/25 dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)]
                  backdrop-blur-xl"
              >
                <p className="text-[#C8962E] text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond',serif" }}>20+</p>
                <p className="text-slate-500 dark:text-white/50 text-xs mt-0.5">Ans d'expérience</p>
              </motion.div>

              {/* Barre or */}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                style={{ background: "linear-gradient(90deg,#C8962E,#E8B84B,#C8962E)" }} />
            </div>
          </FadeIn>

          {/* ── Texte ── */}
          <div>
            <FadeIn>
              <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Notre histoire</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }}
                className="text-5xl lg:text-6xl font-bold mt-3 mb-6
                  text-slate-900 dark:text-white">
                Une entreprise bâtie sur la passion du métier
              </h2>
              <p className="text-lg leading-relaxed mb-8 text-slate-600 dark:text-white/55">
                Depuis 2020, LOGISTECH EQUIP+ accompagne ses clients dans la réalisation de projets ambitieux.
                Fondée par des passionnés forts de près de deux décennies d'expérience, l'entreprise allie
                savoir-faire et engagement pour répondre aux exigences des professionnels guinéens et africains.
              </p>
            </FadeIn>

            {/* Valeurs */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {VALUES.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.1}>
                  <div className="p-5 rounded-xl transition-all duration-300 group
                    bg-white border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50
                    dark:bg-white/[0.02] dark:border-white/[0.06] dark:hover:border-[#C8962E]/25 dark:shadow-none">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${v.color}18` }}>
                      <v.icon size={20} style={{ color: v.color }} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1.5 text-slate-900 dark:text-white">{v.title}</h4>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-white/40">{v.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}