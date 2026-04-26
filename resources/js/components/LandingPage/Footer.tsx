import { HardHat } from "lucide-react";

const FOOTER_LINKS: Record<string, string[]> = {
  Services:   ["Charpente Métallique", "Transport Routier", "Froid Industriel", "Bâtiment & Construction", "Logistique"],
  Entreprise: ["À Propos", "Nos Réalisations", "Témoignages", "Contact"],
  Légal:      ["Mentions Légales", "Politique de Confidentialité", "CGV"],
};

export function Footer({ onDevis }: { onDevis: () => void }) {
  return (
    <footer className="
      border-t
      bg-slate-900  border-slate-700/50
      dark:bg-[#030A14] dark:border-[#C8962E]/10
    ">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-10">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)" }}>
                <HardHat size={26} className="text-black" />
              </div>
              <div>
                <p className="font-bold tracking-wider text-white dark:text-white">LOGISTECH EQUIP+</p>
                <p className="text-[#C8962E] text-xs tracking-[0.25em]">Conakry, Guinée</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-slate-400 dark:text-white/30">
              Votre partenaire industriel de confiance depuis 2020. Excellence, fiabilité, expertise au cœur de chaque projet.
            </p>
           
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="font-semibold text-sm mb-5 uppercase tracking-widest text-white dark:text-white">
                {cat}
              </h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm transition-colors text-slate-400 hover:text-[#C8962E] dark:text-white/30 dark:hover:text-[#C8962E]">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4
          border-t border-slate-700/50 dark:border-white/5">
          <p className="text-xs text-slate-500 dark:text-white/20">© 2025 LOGISTECH EQUIP+. Tous droits réservés.</p>
          <p className="text-xs text-slate-600 dark:text-white/15">Conakry · Guinée · Afrique de l'Ouest</p>
        </div>
      </div>
    </footer>
  );
}