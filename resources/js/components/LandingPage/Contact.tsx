import { CheckCircle, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const CONTACT_INFO = [
  { icon: MapPin, label: "Adresse",   value: "Conakry, Guinée"             },
  { icon: Phone,  label: "Téléphone", value: "+224 600 000 000"             },
  { icon: Mail,   label: "Email",     value: "contact@logistech-equip.com" },
  { icon: Clock,  label: "Horaires",  value: "Lun–Sam : 08h–18h"          },
];

const inputBase = `
  w-full rounded-xl px-4 py-3 text-sm outline-none transition-all
  bg-stone-100 border border-stone-300 text-slate-900 placeholder:text-slate-400
  focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20
  dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25
  dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/20
`;

export function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nom: "", email: "", tel: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-32 bg-stone-50 dark:bg-[#060D1A]">
      {/* Séparateur haut */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.3),transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Contactez-nous</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }}
            className="text-5xl lg:text-7xl font-bold mt-3 text-slate-900 dark:text-white">
            Parlons de votre projet
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Formulaire ── */}
          <FadeIn dir="right">
            <div className="p-8 rounded-2xl
              bg-white border border-stone-200 shadow-lg shadow-stone-200/60
              dark:bg-white/[0.02] dark:border-white/[0.07] dark:shadow-none">

              {/* Infos contact */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {CONTACT_INFO.map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl
                    bg-stone-50 dark:bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#C8962E]/10">
                      <item.icon size={18} className="text-[#C8962E]" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 dark:text-white/30">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Champs */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "nom", label: "Nom",       placeholder: "Votre nom",  type: "text" },
                    { key: "tel", label: "Téléphone", placeholder: "+224 …",     type: "tel"  },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-xs uppercase tracking-widest mb-1.5 block text-slate-500 dark:text-white/40">
                        {f.label}
                      </label>
                      <input type={f.type} placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className={inputBase} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest mb-1.5 block text-slate-500 dark:text-white/40">Email</label>
                  <input type="email" placeholder="email@exemple.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className={inputBase} />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest mb-1.5 block text-slate-500 dark:text-white/40">Message</label>
                  <textarea rows={4} placeholder="Décrivez votre besoin…"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className={inputBase + " resize-none"} />
                </div>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="ok"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200
                        dark:bg-emerald-500/10 dark:border-emerald-500/30">
                      <CheckCircle size={18} className="text-emerald-500 dark:text-emerald-400" />
                      <span className="text-emerald-700 dark:text-emerald-400 text-sm">
                        Message envoyé ! Nous vous répondons sous 24h.
                      </span>
                    </motion.div>
                  ) : (
                    <button onClick={handleSend}
                      className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-3 transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
                      <Mail size={18} /> Envoyer le message
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>

          {/* ── Carte + réseaux ── */}
          <FadeIn dir="left" className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden flex-1
              border border-stone-200 dark:border-[#C8962E]/20
              shadow-lg shadow-stone-200/60 dark:shadow-none"
              style={{ minHeight: "480px" }}>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-13.7797,9.4650,-13.5797,9.6650&layer=mapnik&marker=9.5654,-13.6773"
                width="100%" height="100%"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) brightness(0.7) contrast(1.2) saturate(0.5)", minHeight: "480px" }}
                loading="lazy" title="LOGISTECH EQUIP+ - Conakry"
              />
              {/* Label overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-xl
                bg-white/95 border border-stone-200 shadow-md
                dark:bg-[#060D1A]/95 dark:border-[#C8962E]/25">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
                    <MapPin size={18} className="text-black" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-white">LOGISTECH EQUIP+</p>
                    <p className="text-xs text-slate-500 dark:text-white/40">Conakry, République de Guinée</p>
                  </div>
                  <a href="https://www.google.com/maps?q=Conakry,Guinea" target="_blank" rel="noreferrer"
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium text-[#C8962E] border border-[#C8962E]/20 hover:bg-[#C8962E]/10 transition-colors">
                    Itinéraire
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              {[
                { icon: Facebook,  href: "#", label: "Facebook"  },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin,  href: "#", label: "LinkedIn"  },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm transition-all
                    bg-white border border-stone-200 text-slate-500 hover:text-slate-900 hover:border-amber-300 shadow-sm
                    dark:bg-white/[0.03] dark:border-white/[0.07] dark:text-white/50 dark:hover:text-white dark:hover:border-[#C8962E]/30">
                  <s.icon size={16} /> {s.label}
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}