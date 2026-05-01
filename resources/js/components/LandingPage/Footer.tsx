import { ArrowRight, Clock, Facebook, Linkedin, Mail, MapPin, Phone, Send, Twitter, Youtube, Heart, Code, User } from "lucide-react";
import { motion } from "framer-motion";

const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  Services: [
    { label: "Charpente Métallique", href: "#services" },
    { label: "Transport Routier", href: "#services" },
    { label: "Froid Industriel", href: "#services" },
    { label: "Bâtiment & Construction", href: "#services" },
    { label: "Logistique", href: "#services" },
  ],
  Entreprise: [
    { label: "À Propos", href: "#about" },
    { label: "Nos Réalisations", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],
  Légal: [
    { label: "Mentions Légales", href: "#" },
    { label: "Politique de Confidentialité", href: "#" },
    { label: "CGV", href: "#" },
  ],
};

const SOCIALS = [
  { icon: Facebook, href: "#", color: "#1877F2", label: "Facebook" },
  { icon: Twitter, href: "#", color: "#1DA1F2", label: "Twitter" },
  { icon: Linkedin, href: "#", color: "#0A66C2", label: "LinkedIn" },
];

export function Footer({ onDevis }: { onDevis: () => void }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white dark:bg-[#0A0F1A] overflow-hidden">
      
      {/* Dégradé de fond subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5" />
      
      {/* Ligne décorative top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C8962E] to-[#E8B84B] blur opacity-50" />
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-[#C8962E] to-[#E8B84B] p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#0A0F1A]">
                    <img 
                      src="/logo.jpeg" 
                      alt="LOGISTECH EQUIP+" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
                  LOGISTECH EQUIP+
                </p>
                <p className="text-[#C8962E] text-[10px] tracking-[0.25em] font-semibold">
                  LEADER EN GUINÉE
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              Votre partenaire industriel de confiance depuis 2020. Excellence, fiabilité et expertise au cœur de chaque projet.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <MapPin className="w-4 h-4 text-[#C8962E]" />
                <span>Conakry, République de Guinée</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <Phone className="w-4 h-4 text-[#C8962E]" />
                <a href="tel:+224625421335" className="hover:text-[#C8962E] transition-colors">
                  +224 625 421 335
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <Mail className="w-4 h-4 text-[#C8962E]" />
                <a href="mailto:sidymohamedcherifhaidara02@gmail.com" className="hover:text-[#C8962E] transition-colors">
                  sidymohamedcherifhaidara02@gmail.com
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((social, idx) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-[#C8962E] transition-all duration-300 group"
                >
                  <social.icon className="w-4 h-4 text-gray-600 dark:text-white/60 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-5 text-gray-900 dark:text-white">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-500 dark:text-white/40 text-sm hover:text-[#C8962E] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="py-6 mb-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#C8962E]" />
              <span className="text-gray-600 dark:text-white/60 text-sm">
                Recevez nos actualités et offres
              </span>
            </div>
            
            <div className="flex w-full md:w-auto gap-3">
              <input 
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 md:w-64 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#C8962E] transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                S'abonner
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Bar avec développeur */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10">
          <p className="text-gray-400 dark:text-white/30 text-xs">
            © {currentYear} LOGISTECH EQUIP+. Tous droits réservés.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              Mentions Légales
            </a>
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              Confidentialité
            </a>
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              CGV
            </a>
          </div>

          {/* Développeur */}
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3 text-[#C8962E]" />
            <p className="text-gray-400 dark:text-white/30 text-xs">
              Développé par{" "}
              <a 
                href="mailto:sidymohamedcherifhaidara02@gmail.com"
                className="text-[#C8962E] hover:underline transition-colors font-medium"
              >
                Sidy Mohamed Cherif Haidara
              </a>
            </p>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>

        {/* Contact direct du développeur */}
        <div className="mt-4 pt-4 flex flex-col items-center gap-2 border-t border-gray-200/50 dark:border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-gray-400 dark:text-white/20">
            <a 
              href="mailto:sidymohamedcherifhaidara02@gmail.com"
              className="hover:text-[#C8962E] transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3" />
              sidymohamedcherifhaidara02@gmail.com
            </a>
            <span>•</span>
            <a 
              href="tel:+224625421335"
              className="hover:text-[#C8962E] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              +224 625 421 335
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}