import { CheckCircle, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "./ui-primitives";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const CONTACT_INFO = [
  { icon: MapPin, label: "Adresse",   value: "Conakry, Guinée"              },
  { icon: Phone,  label: "Téléphone", value: "+224 600 000 000"              },
  { icon: Mail,   label: "Email",     value: "contact@logistech-equip.com"  },
  { icon: Clock,  label: "Horaires",  value: "Lun–Sam : 08h–18h"           },
];

const SOCIALS = [
  { icon: Facebook,  href: "#", label: "Facebook"  },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin,  href: "#", label: "LinkedIn"  },
];

const inputCls = [
  "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200",
  "bg-stone-50 border border-stone-200 text-slate-900 placeholder:text-slate-400",
  "focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20",
  "dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25",
  "dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/15",
].join(" ");

export function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", tel: "", message: "" });
  const [sent, setSent]  = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ nom: "", email: "", tel: "", message: "" });
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <section
      id="contact"
      className="relative bg-stone-50 dark:bg-[#060D1A]"
      /* ── FIX: no overflow-hidden, no fixed height — section grows naturally ── */
      style={{ paddingTop: '7rem', paddingBottom: '7rem' }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.3),transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <span
            className="text-[#C8962E] text-[10px] uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Contactez-nous
          </span>
          <h2
            className="mt-3 text-slate-900 dark:text-white"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Parlons de votre projet
          </h2>
        </div>

        {/* ── Grid: stacks on mobile (form first, map second) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ════════════════════════════════════
              LEFT — Form card
              ════════════════════════════════════ */}
      
            <div
              className="rounded-2xl p-6 sm:p-8 bg-white border border-stone-200 shadow-sm dark:bg-white/[0.025] dark:border-white/[0.07]"
            >
              {/* Contact info pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7">
                {CONTACT_INFO.map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/[0.05]"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(200,150,46,0.12)" }}
                    >
                      <item.icon size={16} className="text-[#C8962E]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-wider" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-stone-100 dark:bg-white/[0.06] mb-7" />

              {/* Form fields */}
              <div className="space-y-4">

                {/* Name + Phone row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "nom", label: "Nom",       placeholder: "Votre nom", type: "text" },
                    { key: "tel", label: "Téléphone", placeholder: "+224 …",    type: "tel"  },
                  ].map(f => (
                    <div key={f.key}>
                      <label
                        className="text-[10px] uppercase tracking-widest mb-1.5 block text-slate-400 dark:text-white/35"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={set(f.key)}
                        className={inputCls}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      />
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="text-[10px] uppercase tracking-widest mb-1.5 block text-slate-400 dark:text-white/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@exemple.com"
                    value={form.email}
                    onChange={set("email")}
                    className={inputCls}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    className="text-[10px] uppercase tracking-widest mb-1.5 block text-slate-400 dark:text-white/35"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez votre besoin…"
                    value={form.message}
                    onChange={set("message")}
                    className={inputCls + " resize-none"}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Submit / success */}
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/25"
                    >
                      <CheckCircle size={17} className="text-emerald-500 flex-shrink-0" />
                      <span
                        className="text-emerald-700 dark:text-emerald-400 text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Message envoyé ! Nous vous répondons sous 24h.
                      </span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="btn"
                      onClick={handleSend}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2.5 transition-shadow hover:shadow-xl"
                      style={{
                        background: "linear-gradient(135deg,#C8962E,#E8B84B)",
                        boxShadow: "0 8px 24px rgba(200,150,46,0.3)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <Mail size={16} />
                      Envoyer le message
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
     

          {/* ════════════════════════════════════
              RIGHT — Map + socials
              FIX: no fixed minHeight on wrapper,
              map iframe has explicit height
              ════════════════════════════════════ */}
          <div className="flex flex-col gap-4">

            {/* Map */}
            <div
              className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-[#C8962E]/20 shadow-sm"
              /* ── FIX: use a fixed px height so the iframe is predictable on all screens ── */
              style={{ height: 400 }}
            >
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-13.7797,9.4650,-13.5797,9.6650&layer=mapnik&marker=9.5654,-13.6773"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  filter: "saturate(0.7) brightness(1.02)",
                }}
                loading="lazy"
                title="LOGISTECH EQUIP+ - Conakry"
              />

              {/* Map overlay card */}
              <div
                className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl flex items-center gap-3"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(14px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}
                >
                  <MapPin size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm text-slate-900 truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    LOGISTECH EQUIP+
                  </p>
                  <p
                    className="text-xs text-slate-500 truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Conakry, République de Guinée
                  </p>
                </div>
                <a
                  href="https://www.google.com/maps?q=Conakry,Guinea"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#C8962E] border border-[#C8962E]/25 hover:bg-[#C8962E]/10 transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Itinéraire
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-200 border"
                  style={{
                    background: "white",
                    borderColor: "rgba(0,0,0,0.08)",
                    color: "#6B7280",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#C8962E";
                    (e.currentTarget as HTMLElement).style.color = "#C8962E";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#6B7280";
                  }}
                >
                  <s.icon size={15} />
                  <span className="hidden sm:inline">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.2),transparent)" }}
      />
    </section>
  );
}