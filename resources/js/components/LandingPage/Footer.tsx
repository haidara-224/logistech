import { HardHat } from "lucide-react";

// ─── FOOTER ──────────────────────────────────────────────────────────────────
export function Footer({ onDevis }: { onDevis: () => void }) {
  const footerLinks = {
    "Services": ["Charpente Métallique", "Transport Routier", "Froid Industriel", "Bâtiment & Construction", "Logistique"],
    "Entreprise": ["À Propos", "Nos Réalisations", "Témoignages", "Contact"],
    "Légal": ["Mentions Légales", "Politique de Confidentialité", "CGV"],
  };

  return (
    <footer style={{ background: "#030A14", borderTop: "1px solid rgba(200,150,46,0.1)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
                <HardHat size={26} className="text-black" />
              </div>
              <div>
                <p className="text-white font-bold tracking-wider">LOGISTECH EQUIP+</p>
                <p className="text-[#C8962E] text-xs tracking-[0.25em]">Conakry, Guinée</p>
              </div>
            </div>
            <p className="text-white/30 text-sm leading-relaxed mb-6 max-w-xs">
              Votre partenaire industriel de confiance depuis 2020. Excellence, fiabilité, expertise au cœur de chaque projet.
            </p>
            <button onClick={onDevis} className="px-6 py-3 rounded-lg text-sm font-bold text-black transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
              Demander un devis
            </button>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-widest">{cat}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-white/30 hover:text-[#C8962E] text-sm transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-white/20 text-xs">© 2025 LOGISTECH EQUIP+. Tous droits réservés.</p>
          <p className="text-white/15 text-xs">Conakry · Guinée · Afrique de l'Ouest</p>
        </div>
      </div>
    </footer>
  );
}
