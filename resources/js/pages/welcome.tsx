import { About } from "@/components/LandingPage/About";
import { Contact } from "@/components/LandingPage/Contact";
import { CTABanner } from "@/components/LandingPage/CTA";
import { DevisModal } from "@/components/LandingPage/DevisModal";
import { Footer } from "@/components/LandingPage/Footer";
import { Gallery } from "@/components/LandingPage/Gallery";
import { Hero } from "@/components/LandingPage/Hero";
import { Navbar } from "@/components/LandingPage/Navbar";
import { Services } from "@/components/LandingPage/Services";
import { Testimonials } from "@/components/LandingPage/Testimonial";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";


// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function Welcome() {
  const [devisOpen, setDevisOpen] = useState(false);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = devisOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [devisOpen]);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; margin: 0; background: #060D1A; color: #F8F5EF; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060D1A; }
        ::-webkit-scrollbar-thumb { background: #C8962E; border-radius: 3px; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <Navbar onDevis={() => setDevisOpen(true)} />

      <main>
        <Hero onDevis={() => setDevisOpen(true)} />
        <Services onDevis={() => setDevisOpen(true)} />
        <About onDevis={() => setDevisOpen(true)} />
        <Gallery onDevis={() => setDevisOpen(true)} />
        <Testimonials />
        <CTABanner onDevis={() => setDevisOpen(true)} />
        <Contact />
      </main>

      <Footer onDevis={() => setDevisOpen(true)} />

      {/* Floating devis button */}
      <motion.button
        onClick={() => setDevisOpen(true)}
        initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 2 }}
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-black text-sm shadow-2xl"
        style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)", boxShadow: "0 20px 60px rgba(200,150,46,0.5)" }}
      >
        <FileText size={18} />
        <span className="hidden sm:inline">Devis gratuit</span>
      </motion.button>

      {/* Devis Modal */}
      <AnimatePresence>
        {devisOpen && <DevisModal onClose={() => setDevisOpen(false)} />}
      </AnimatePresence>
    </>
  );
}