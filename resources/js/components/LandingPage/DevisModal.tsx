import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle, FileText, HardHat, Package, Snowflake, Truck, X, Send, User, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

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
    // Afficher les données dans la console
    const selectedService = DEVIS_SERVICES.find(s => s.id === selected);
    console.log("=== DEMANDE DE DEVIS ===");
    console.log("Service:", selectedService?.label);
    console.log("Nom:", form.nom);
    console.log("Email:", form.email);
    console.log("Téléphone:", form.tel);
    console.log("Délai:", form.delai);
    console.log("Message:", form.message);
    console.log("======================");
    
    setSent(true);
    setTimeout(onClose, 2800);
  };

  const selectedService = DEVIS_SERVICES.find(s => s.id === selected);
  const currentColor = selectedService?.color || "#C8962E";

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10 bg-white dark:bg-[#0B1120] shadow-2xl"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header avec décoration */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/10">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C8962E] via-[#E8B84B] to-[#C8962E]" />
          
          <button 
            onClick={onClose} 
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#C8962E] animate-pulse" />
            <span className="text-[#C8962E] text-xs font-semibold uppercase tracking-wider">
              Demande de devis
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {sent ? "Demande envoyée !" : step === 1 ? "Quel service vous intéresse ?" : "Vos coordonnées"}
          </h2>

          {/* Steps indicator */}
          {!sent && (
            <div className="flex items-center gap-3 mt-4">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      step >= s 
                        ? "bg-[#C8962E] text-white" 
                        : "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-white/30"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 2 && (
                    <div className={`h-px w-12 transition-all duration-300 ${
                      step > s ? "bg-[#C8962E]" : "bg-gray-200 dark:bg-white/10"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="sent" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col items-center py-8 gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-[#C8962E] to-[#E8B84B]"
                >
                  <CheckCircle size={32} className="text-white" />
                </motion.div>
                <p className="text-gray-600 dark:text-white/60 text-center">
                  Votre demande a bien été envoyée !
                </p>
                <p className="text-gray-400 dark:text-white/40 text-center text-sm">
                  Notre équipe vous contactera dans les 24h ouvrables.
                </p>
              </motion.div>
            ) : step === 1 ? (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {DEVIS_SERVICES.map((svc) => {
                    const Icon = svc.icon;
                    const isSelected = selected === svc.id;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => setSelected(svc.id)}
                        className={`relative text-left rounded-xl p-4 border transition-all duration-300 group ${
                          isSelected 
                            ? "border-[#C8962E] shadow-lg" 
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                        style={{
                          background: isSelected ? `${svc.color}08` : "transparent"
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                            style={{ 
                              background: isSelected ? svc.color : `${svc.color}15`,
                            }}
                          >
                            <Icon size={18} style={{ color: isSelected ? "white" : svc.color }} />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">
                              {svc.label}
                            </p>
                            <p className="text-gray-500 dark:text-white/40 text-xs mt-0.5 leading-relaxed">
                              {svc.desc}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute top-3 right-3"
                          >
                            <CheckCircle size={16} className="text-[#C8962E]" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => selected && setStep(2)}
                  disabled={!selected}
                  className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    selected 
                      ? "bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white hover:shadow-lg" 
                      : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/30 cursor-not-allowed"
                  }`}
                >
                  Continuer
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                className="space-y-4"
              >
                {/* Service sélectionné */}
                {selectedService && (
                  <div className="mb-4 p-3 rounded-xl bg-[#C8962E]/10 border border-[#C8962E]/20">
                    <p className="text-xs text-[#C8962E] font-semibold mb-1">Service sélectionné</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedService.label}</p>
                  </div>
                )}

                {/* Formulaire */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-600 dark:text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                      Nom complet
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                      <input
                        type="text"
                        placeholder="Mamadou Diallo"
                        value={form.nom}
                        onChange={e => setForm(p => ({ ...p, nom: e.target.value }))}
                        className="w-full rounded-xl pl-9 pr-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none transition-all bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 dark:text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                      <input
                        type="tel"
                        placeholder="+224 600 000 000"
                        value={form.tel}
                        onChange={e => setForm(p => ({ ...p, tel: e.target.value }))}
                        className="w-full rounded-xl pl-9 pr-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none transition-all bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                    <input
                      type="email"
                      placeholder="email@exemple.com"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full rounded-xl pl-9 pr-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none transition-all bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Délai souhaité
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
                    <select
                      value={form.delai}
                      onChange={e => setForm(p => ({ ...p, delai: e.target.value }))}
                      className="w-full rounded-xl pl-9 pr-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none transition-all bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E]"
                    >
                      <option value="">Sélectionner un délai</option>
                      <option>Urgent (moins d'1 semaine)</option>
                      <option>1 à 4 semaines</option>
                      <option>1 à 3 mois</option>
                      <option>Plus de 3 mois</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-600 dark:text-white/50 text-xs font-semibold uppercase tracking-wider mb-1.5 block">
                    Description du projet
                  </label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3 top-3 text-gray-400 dark:text-white/30" />
                    <textarea
                      rows={3}
                      placeholder="Décrivez votre projet en quelques lignes..."
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full rounded-xl pl-9 pr-4 py-2.5 text-gray-900 dark:text-white text-sm outline-none transition-all bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-[#C8962E] focus:ring-1 focus:ring-[#C8962E] resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setStep(1)} 
                    className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-white/60 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all text-sm font-medium"
                  >
                    ← Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#C8962E] to-[#E8B84B] hover:shadow-lg"
                  >
                    <Send size={16} />
                    Envoyer ma demande
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