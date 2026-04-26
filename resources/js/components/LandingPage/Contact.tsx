import { CheckCircle, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nom: "", email: "", tel: "", message: "" });
  };

  return (
    <section id="contact" className="relative py-32" style={{ background: "#060D1A" }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.3),transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Contactez-nous</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-5xl lg:text-7xl font-bold text-white mt-3">
            Parlons de votre projet
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <FadeIn dir="right" className="space-y-6">
            <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Contact info */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {[
                  { icon: MapPin, label: "Adresse", value: "Conakry, Guinée" },
                  { icon: Phone, label: "Téléphone", value: "+224 600 000 000" },
                  { icon: Mail, label: "Email", value: "contact@logistech-equip.com" },
                  { icon: Clock, label: "Horaires", value: "Lun–Sam: 08h–18h" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(200,150,46,0.1)" }}>
                      <item.icon size={18} className="text-[#C8962E]" />
                    </div>
                    <div>
                      <p className="text-white/30 text-xs">{item.label}</p>
                      <p className="text-white text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "nom", label: "Nom", placeholder: "Votre nom" },
                    { key: "tel", label: "Téléphone", placeholder: "+224 ..." },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">{f.label}</label>
                      <input type="text" placeholder={f.placeholder}
                        value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onFocus={e => e.target.style.borderColor = "#C8962E"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Email</label>
                  <input type="email" placeholder="email@exemple.com"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => e.target.style.borderColor = "#C8962E"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <div>
                  <label className="text-white/40 text-xs uppercase tracking-widest mb-1.5 block">Message</label>
                  <textarea rows={4} placeholder="Décrivez votre besoin..."
                    value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => e.target.style.borderColor = "#C8962E"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <CheckCircle size={18} className="text-emerald-400" />
                      <span className="text-emerald-400 text-sm">Message envoyé ! Nous vous répondons sous 24h.</span>
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

          {/* Map */}
          <FadeIn dir="left" className="flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden flex-1" style={{ minHeight: "480px", border: "1px solid rgba(200,150,46,0.2)" }}>
              {/* Embedded OSM map centered on Conakry */}
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-13.7797,9.4650,-13.5797,9.6650&layer=mapnik&marker=9.5654,-13.6773"
                width="100%" height="100%"
                style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg) brightness(0.7) contrast(1.2) saturate(0.5)", minHeight: "480px" }}
                loading="lazy"
                title="LOGISTECH EQUIP+ - Conakry"
              />
              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl" style={{ background: "rgba(6,13,26,0.95)", border: "1px solid rgba(200,150,46,0.25)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
                    <MapPin size={18} className="text-black" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">LOGISTECH EQUIP+</p>
                    <p className="text-white/40 text-xs">Conakry, République de Guinée</p>
                  </div>
                  <a href="https://www.google.com/maps?q=Conakry,Guinea" target="_blank" rel="noreferrer"
                    className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium text-[#C8962E] hover:bg-[rgba(200,150,46,0.1)] transition-colors border border-[rgba(200,150,46,0.2)]">
                    Itinéraire
                  </a>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm text-white/50 hover:text-white transition-all hover:border-[rgba(200,150,46,0.3)]"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
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