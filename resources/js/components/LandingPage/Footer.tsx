import { Clock, Code, Facebook, Heart, Linkedin, Mail, MapPin, Phone, Send, Twitter, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { router } from "@inertiajs/react";
import { useTranslation } from "@/hooks/use-translation";

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter,  href: "#", label: "Twitter"  },
  { icon: Linkedin, href: "#", label: "LinkedIn"  },
];

export function Footer(_: { onDevis: () => void }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const FOOTER_LINKS: Record<string, Array<{ label: string; href: string }>> = {
    [t('footer_services')]: [
      { label: t('svc_charpente_title'), href: "#services" },
      { label: t('svc_transport_title'), href: "#services" },
      { label: t('svc_froid_title'),     href: "#services" },
      { label: t('svc_batiment_title'),  href: "#services" },
      { label: t('svc_logistique_title'),href: "#services" },
    ],
    [t('footer_company')]: [
      { label: t('footer_about'),        href: "#about"   },
      { label: t('footer_achievements'), href: "#gallery" },
      { label: t('footer_contact'),      href: "#contact" },
    ],
    [t('footer_legal')]: [
      { label: t('footer_legal_notice'), href: "#" },
      { label: t('footer_privacy'),      href: "#" },
      { label: t('footer_cgv'),          href: "#" },
    ],
  };

  const handleNewsletter = () => {
    if (!newsletterEmail || newsletterSubmitting) { return; }
    setNewsletterSubmitting(true);
    router.post('/newsletter', { email: newsletterEmail }, {
      onSuccess: () => { setNewsletterSent(true); setNewsletterEmail(''); },
      onFinish: () => setNewsletterSubmitting(false),
      preserveScroll: true,
    });
  };

  return (
    <footer className="relative bg-white dark:bg-[#0A0F1A] overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-white/5" />
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
                    <img src="/logo.jpeg" alt="LOGISTECH EQUIP+" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">LOGISTECH EQUIP+</p>
                <p className="text-[#C8962E] text-[10px] tracking-[0.25em] font-semibold">LEADER EN GUINÉE</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-white/40 text-sm leading-relaxed mb-6 max-w-sm">
              {t('footer_desc')}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <MapPin className="w-4 h-4 text-[#C8962E]" />
                <span>{t('contact_location_full')}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <Phone className="w-4 h-4 text-[#C8962E]" />
                <a href="tel:+224614604444" className="hover:text-[#C8962E] transition-colors">+224 614 60 44 44</a>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-white/40 text-sm">
                <Mail className="w-4 h-4 text-[#C8962E]" />
                <a href="mailto:contact@logistech.com" className="hover:text-[#C8962E] transition-colors">contact@logistech.com</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {SOCIALS.map((social) => (
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
              <span className="text-gray-600 dark:text-white/60 text-sm">{t('footer_newsletter_strip')}</span>
            </div>

            {newsletterSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold"
              >
                <CheckCircle className="w-4 h-4" />
                {t('footer_newsletter_sent')}
              </motion.div>
            ) : (
              <div className="flex w-full md:w-auto gap-3">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewsletter()}
                  placeholder={t('footer_newsletter_ph')}
                  className="flex-1 md:w-64 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#C8962E] transition-colors"
                />
                <motion.button
                  whileHover={{ scale: newsletterSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: newsletterSubmitting ? 1 : 0.98 }}
                  onClick={handleNewsletter}
                  disabled={newsletterSubmitting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {newsletterSubmitting ? '...' : t('footer_newsletter_btn')}
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10">
          <p className="text-gray-400 dark:text-white/30 text-xs">
            © {currentYear} LOGISTECH EQUIP+. {t('footer_rights')}
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              {t('footer_legal_notice')}
            </a>
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              {t('footer_privacy_link')}
            </a>
            <a href="#" className="text-gray-400 dark:text-white/30 text-xs hover:text-[#C8962E] transition-colors">
              {t('footer_cookies_link')}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Code className="w-3 h-3 text-[#C8962E]" />
            <p className="text-gray-400 dark:text-white/30 text-xs">
              {t('footer_made_by')}{" "}
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

        {/* Developer contact */}
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
