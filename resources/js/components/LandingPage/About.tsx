import { ArrowRight, Award, Clock, FileText, Shield, Zap } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { motion } from "framer-motion";

export function About({ onDevis }: { onDevis: () => void }) {
  const values = [
    { icon: Clock, title: "Respect des Délais", desc: "Organisation rigoureuse, chaque projet livré dans les temps. Le planning est sacré.", color: "#C8962E" },
    { icon: Zap, title: "Rapidité d'Exécution", desc: "Équipe réactive, montage rapide et efficace. Nous limitons les interruptions.", color: "#E8B84B" },
    { icon: Shield, title: "Qualité du Travail", desc: "Structures solides et durables. La satisfaction client guide chaque décision.", color: "#C8962E" },
    { icon: Award, title: "Expertise Reconnue", desc: "Près de deux décennies d'expérience cumulée au cœur de chaque chantier.", color: "#E8B84B" },
  ];

  return (
    <section id="about" className="relative py-32" style={{ background: "#0B1628" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(200,150,46,0.04) 0%, transparent 60%)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: image stack */}
          <FadeIn dir="right" className="relative">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" alt="About" className="w-full h-full object-cover" style={{ filter: "brightness(0.75) saturate(0.8)" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.8) 0%, transparent 50%)" }} />
              </div>
              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 top-12 p-5 rounded-2xl"
                style={{ background: "rgba(11,22,40,0.95)", border: "1px solid rgba(200,150,46,0.25)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
              >
                <p className="text-[#C8962E] text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond',serif" }}>2020</p>
                <p className="text-white/50 text-xs mt-0.5">Année de fondation</p>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -left-8 bottom-16 p-5 rounded-2xl"
                style={{ background: "rgba(11,22,40,0.95)", border: "1px solid rgba(200,150,46,0.25)", backdropFilter: "blur(20px)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
              >
                <p className="text-[#C8962E] text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond',serif" }}>20+</p>
                <p className="text-white/50 text-xs mt-0.5">Ans d'expérience cumulée</p>
              </motion.div>
              {/* Gold bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ background: "linear-gradient(90deg,#C8962E,#E8B84B,#C8962E)" }} />
            </div>
          </FadeIn>

          {/* Right: text */}
          <div>
            <FadeIn>
              <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Notre histoire</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-5xl lg:text-6xl font-bold text-white mt-3 mb-6">
                Une entreprise bâtie sur la passion du métier
              </h2>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                Depuis 2020, LOGISTECH EQUIP+ accompagne ses clients dans la réalisation de projets ambitieux. Fondée par des passionnés forts de près de deux décennies d'expérience, l'entreprise allie savoir-faire et engagement pour répondre aux exigences des professionnels guinéens et africains.
              </p>
            </FadeIn>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {values.map((v, i) => (
                <FadeIn key={v.title} delay={i * 0.1}>
                  <div className="p-5 rounded-xl group hover:border-[rgba(200,150,46,0.25)] transition-all duration-300"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: v.color + "15" }}>
                      <v.icon size={20} style={{ color: v.color }} />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1.5">{v.title}</h4>
                    <p className="text-white/40 text-xs leading-relaxed">{v.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={0.4}>
              <button onClick={onDevis} className="group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-black transition-all duration-300 hover:brightness-110"
                style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)", boxShadow: "0 20px 50px rgba(200,150,46,0.3)" }}>
                <FileText size={18} /> Parlons de votre projet
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
