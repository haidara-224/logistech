import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, Menu, X, FileText } from 'lucide-react';
import AppearanceToggleTab from './Appearancetoggletab';

const NAV_LINKS = [
  { label: 'Accueil',  href: '#hero'         },
  { label: 'Services', href: '#services'     },
  { label: 'À Propos', href: '#about'        },
  { label: 'Galerie',  href: '#gallery'      },
  { label: 'Avis',     href: '#testimonials' },
  { label: 'Contact',  href: '#contact'      },
];

interface NavbarProps { onDevis: () => void }

export function Navbar({ onDevis }: NavbarProps) {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background:     scrolled ? 'rgba(6,13,26,0.96)'              : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)'                       : 'none',
          borderBottom:   scrolled ? '1px solid rgba(200,150,46,0.12)' : 'none',
          boxShadow:      scrolled ? '0 4px 40px rgba(0,0,0,0.4)'     : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
          <a href="#hero" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}>
              <HardHat size={22} className="text-black" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none tracking-wider">LOGISTECH</p>
              <p className="text-[#C8962E] text-xs tracking-[0.3em] font-light">EQUIP+</p>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="text-white/60 hover:text-[#C8962E] text-sm tracking-wide transition-colors relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8962E] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
            <AppearanceToggleTab/>
          </div>

          <button onClick={onDevis}
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-black transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}>
            <FileText size={15} /> Demander un devis
          </button>

          <button onClick={() => setOpen(o => !o)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-lg"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-[99] lg:hidden px-4 pb-4"
          >
            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: 'rgba(6,13,26,0.98)', border: '1px solid rgba(200,150,46,0.2)', backdropFilter: 'blur(20px)' }}>
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                  className="text-white/70 hover:text-[#C8962E] text-lg font-medium py-1 border-b border-white/5 transition-colors">
                  {l.label}
                </a>
              ))}
              <button onClick={() => { onDevis(); setOpen(false); }}
                className="mt-2 py-3 rounded-xl text-black font-bold"
                style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}>
                Demander un devis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}