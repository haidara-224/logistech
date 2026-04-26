import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle, FileText, HardHat, Package, Snowflake, Truck, X } from "lucide-react";
import { useState } from "react";

// ─── DEVIS MODAL ────────────────────────────────────────────────────────────
const DEVIS_SERVICES = [
  { id: "charpente", label: "Charpente Métallique", icon: HardHat, desc: "Structures, bâtiments industriels, agricoles, commerciaux", color: "#C8962E" },
  { id: "transport", label: "Transport Routier", icon: Truck, desc: "Fret national, régional, international depuis Conakry", color: "#3B82F6" },
  { id: "froid", label: "Froid Industriel", icon: Snowflake, desc: "Chambres froides, vitrines, installation frigorifique", color: "#06B6D4" },
  { id: "batiment", label: "Bâtiment & Construction", icon: Building2, desc: "Logements, développement immobilier, génie civil", color: "#10B981" },
  { id: "logistique", label: "Logistique & Stockage", icon: Package, desc: "Solutions de stockage sur mesure, supply chain", color: "#8B5CF6" },
];

export function DevisModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", email: "", tel: "", message: "", delai: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    setSent(true);
    setTimeout(onClose, 2800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10"
        style={{ background: "linear-gradient(135deg,#0B1628 0%,#0F1E3A 100%)", border: "1px solid rgba(200,150,46,0.3)", boxShadow: "0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(200,150,46,0.2)" }}
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-white/5">
          <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#C8962E,transparent)" }} />
          <button onClick={onClose} className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#C8962E] animate-pulse" />
            <span className="text-[#C8962E] text-xs uppercase tracking-[0.2em] font-medium">Demande de devis</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-3xl font-bold text-white">
            {sent ? "Demande envoyée !" : step === 1 ? "Quel service vous intéresse ?" : "Vos coordonnées"}
          </h2>

          {/* Steps indicator */}
          {!sent && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? "bg-[#C8962E] text-black" : "bg-white/10 text-white/30"}`}>{s}</div>
                  {s < 2 && <div className={`h-px w-12 transition-all duration-500 ${step > s ? "bg-[#C8962E]" : "bg-white/10"}`} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="sent" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}
                >
                  <CheckCircle size={40} className="text-black" />
                </motion.div>
                <p className="text-white/70 text-center">Notre équipe vous contactera dans les 24h ouvrables.</p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {DEVIS_SERVICES.map((svc) => {
                    const Icon = svc.icon;
                    const isSelected = selected === svc.id;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => setSelected(svc.id)}
                        className="relative text-left rounded-xl p-4 border transition-all duration-300 group"
                        style={{
                          background: isSelected ? `${svc.color}18` : "rgba(255,255,255,0.03)",
                          borderColor: isSelected ? svc.color : "rgba(255,255,255,0.08)",
                          boxShadow: isSelected ? `0 0 30px ${svc.color}25` : "none",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all" style={{ background: isSelected ? svc.color : "rgba(255,255,255,0.06)" }}>
                            <Icon size={18} style={{ color: isSelected ? "black" : svc.color }} />
                          </div>
                          <div>
                            <p className="text-white font-semibold text-sm">{svc.label}</p>
                            <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{svc.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: svc.color }}>
                            <CheckCircle size={12} className="text-black" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => selected && setStep(2)}
                  disabled={!selected}
                  className="w-full py-4 rounded-xl font-bold text-black transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: selected ? "linear-gradient(135deg,#C8962E,#E8B84B)" : "rgba(255,255,255,0.05)",
                    color: selected ? "black" : "rgba(255,255,255,0.2)",
                    cursor: selected ? "pointer" : "not-allowed",
                  }}
                >
                  Continuer <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "nom", label: "Nom complet", placeholder: "Mamadou Diallo", type: "text" },
                    { key: "tel", label: "Téléphone", placeholder: "+224 600 000 000", type: "tel" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                        onFocus={e => { e.target.style.borderColor = "#C8962E"; e.target.style.boxShadow = "0 0 20px rgba(200,150,46,0.15)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email" placeholder="email@exemple.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.target.style.borderColor = "#C8962E"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Délai souhaité</label>
                  <select
                    value={form.delai}
                    onChange={e => setForm(p => ({ ...p, delai: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none"
                    style={{ background: "#0B1628", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <option value="">Sélectionner...</option>
                    <option>Urgent (moins d'1 semaine)</option>
                    <option>1 à 4 semaines</option>
                    <option>1 à 3 mois</option>
                    <option>Plus de 3 mois</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Description du projet</label>
                  <textarea
                    rows={3}
                    placeholder="Décrivez votre projet en quelques lignes..."
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 text-white text-sm outline-none resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    onFocus={e => { e.target.style.borderColor = "#C8962E"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-all text-sm">
                    ← Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-xl font-bold text-black flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95"
                    style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}
                  >
                    <FileText size={18} /> Envoyer ma demande
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
