import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, LogIn, LayoutDashboard, ChevronRight, Sparkles, Globe, Check } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppearanceToggleTab from './Appearancetoggletab';
import { useAppearance } from '@/hooks/use-appearance';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onDevis: () => void;
  canRegister?: boolean;
  isAdmin: Boolean;
  isSuperAdmin: Boolean;
}

export function Navbar({ onDevis, canRegister = true, isAdmin = false, isSuperAdmin = false }: NavbarProps) {
  const [open,        setOpen]        = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [activeLink,  setActiveLink]  = useState('hero');
  const [langOpen,    setLangOpen]    = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const { auth, landing }      = usePage().props as any;
  const logoSrc                = landing?.logo || '/logo.jpeg';
  const currentUrl             = usePage().url;
  const { resolvedAppearance } = useAppearance();
  const { t, locale }          = useTranslation();
  const isDark                 = resolvedAppearance === 'dark';

  const NAV_LINKS = [
    { label: t('nav_home'),     href: '/',          icon: '🏠' },
    { label: t('nav_services'), href: '#services',  icon: '⚡' },
    { label: t('nav_about'),    href: '#about',     icon: '✨' },
    { label: t('nav_contact'),  href: '#contact',   icon: '💬' },
    { label: t('nav_shop'),     href: '/boutique',  icon: '🛍️' },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const pos = window.scrollY + 130;
      for (const { href } of NAV_LINKS) {
        if (!href.startsWith('#')) { continue; }
        const el = document.getElementById(href.slice(1));
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          setActiveLink(href.slice(1));
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [locale]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function switchLocale(newLocale: string) {
    if (newLocale === locale) { setLangOpen(false); return; }
    router.post('/language', { locale: newLocale }, {
      preserveScroll: true,
      onFinish: () => setLangOpen(false),
    });
  }

  const canDashboard = isAdmin || isSuperAdmin;

  const navBg  = scrolled
    ? (isDark ? 'rgba(12, 18, 28, 0.97)' : 'rgba(255,255,255,0.97)')
    : (isDark ? 'rgba(12, 18, 28, 0.8)'  : 'rgba(255,255,255,0.8)');
  const shadow = scrolled
    ? (isDark ? '0 2px 24px rgba(0,0,0,0.4)' : '0 2px 24px rgba(0,0,0,0.06)')
    : 'none';
  const border = scrolled
    ? (isDark ? '1px solid rgba(200,150,46,0.18)' : '1px solid rgba(0,0,0,0.06)')
    : '1px solid transparent';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-700';

  return (
    <>
      {/* ── Desktop / sticky nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{ background: navBg, boxShadow: shadow, border, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-[68px] lg:h-[76px]">

            {/* Logo */}
            <motion.a href="/" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-3 shrink-0">
              <div className="relative w-13.5 h-13.5 lg:w-15.5 lg:h-15.5 rounded-xl overflow-hidden ring-2 ring-[#C8962E]/50 shadow-lg shrink-0"
                style={{ background: isDark ? '#0f1929' : '#ffffff' }}>
                <img src={logoSrc} alt="LOGISTECH EQUIP+" className="w-full h-full object-cover" style={{ imageRendering: 'auto' }} />
              </div>
              <div className="flex flex-col leading-none">
                <span className={cn('font-bold text-[15px] lg:text-[17px] tracking-wide', isDark ? 'text-white' : 'text-gray-900')} style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  LOGISTECH
                </span>
                <span className="text-[#C8962E] text-[9px] tracking-[0.25em] font-medium mt-0.5">EQUIP+</span>
              </div>
            </motion.a>

            {/* Center links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {NAV_LINKS.map(link => {
                const isAnchor   = link.href.startsWith('#');
                const isOnHome   = currentUrl === '/';
                const resolvedHref = isAnchor && !isOnHome ? '/' + link.href : link.href;
                const isActive = isAnchor
                  ? isOnHome && activeLink === link.href.slice(1)
                  : link.href === '/' ? currentUrl === '/' : currentUrl.startsWith(link.href);
                const cls = cn('relative px-4 py-2 text-[13.5px] font-medium rounded-lg transition-all duration-250',
                  isActive ? 'text-[#C8962E]' : cn(textColor, 'hover:text-[#C8962E]'));
                const sty = { fontFamily: "'DM Sans', sans-serif" };
                const indicator = isActive && (
                  <motion.div layoutId="navActive" className="absolute inset-0 rounded-lg bg-[#C8962E]/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                );
                return isAnchor ? (
                  <a key={link.href} href={resolvedHref} className={cls} style={sty}>
                    {link.label}{indicator}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} className={cls} style={sty}>
                    {link.label}{indicator}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              {auth?.user && canDashboard && (
                <Link href={dashboard()}
                  className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200',
                    'border border-[#C8962E]/25 text-[#C8962E] hover:bg-[#C8962E] hover:text-white hover:border-[#C8962E]')}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <LayoutDashboard size={14} />
                  {t('nav_dashboard')}
                </Link>
              )}

              {!auth?.user && (
                <>
                  <Link href={login()}
                    className={cn('inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200',
                      'border border-gray-200 hover:border-[#C8962E] hover:text-[#C8962E]',
                      isDark ? 'text-gray-300' : 'text-gray-600')}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <LogIn size={14} />
                    {t('nav_login')}
                  </Link>
                  {canRegister && (
                    <Link href={register()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-all duration-200 shadow-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <Sparkles size={13} />
                      {t('nav_register')}
                    </Link>
                  )}
                </>
              )}

              <AppearanceToggleTab />

              {/* Language switcher */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setLangOpen(v => !v)}
                  className={cn('inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 border',
                    isDark
                      ? 'border-white/10 text-gray-300 hover:bg-white/10'
                      : 'border-gray-200 text-gray-600 hover:border-[#C8962E] hover:text-[#C8962E]')}
                >
                  <Globe size={14} />
                  <span className="uppercase text-[11px] font-bold">{locale}</span>
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={cn('absolute right-0 top-full mt-2 w-36 rounded-xl shadow-xl border overflow-hidden z-50',
                        isDark ? 'bg-[#0e1624] border-white/10' : 'bg-white border-gray-100')}
                    >
                      {(['fr', 'en'] as const).map(lang => (
                        <button
                          key={lang}
                          onClick={() => switchLocale(lang)}
                          className={cn('w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors',
                            locale === lang
                              ? 'text-[#C8962E] bg-[#C8962E]/8'
                              : isDark ? 'text-gray-300 hover:bg-white/8' : 'text-gray-700 hover:bg-gray-50')}
                        >
                          <span>{lang === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</span>
                          {locale === lang && <Check size={13} className="text-[#C8962E]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Primary CTA */}
              <motion.button onClick={onDevis} whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #C8962E 0%, #E8B84B 100%)', boxShadow: '0 6px 20px rgba(200,150,46,0.35)', fontFamily: "'DM Sans', sans-serif" }}
              >
                <FileText size={14} />
                {t('nav_quote')}
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <motion.button onClick={() => setOpen(v => !v)} whileTap={{ scale: 0.94 }}
              className={cn('lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                isDark ? 'bg-white/10 hover:bg-white/15' : 'bg-gray-100 hover:bg-gray-200')}
            >
              <AnimatePresence mode="wait">
                {open
                  ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X size={18} className={isDark ? 'text-white' : 'text-gray-800'} />
                    </motion.div>
                  : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <Menu size={18} className={isDark ? 'text-white' : 'text-gray-800'} />
                    </motion.div>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm lg:hidden" />

            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-[80px] left-4 right-4 z-[99] lg:hidden rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: isDark ? 'rgba(14, 22, 36, 0.99)' : '#fff', border: isDark ? '1px solid rgba(200,150,46,0.15)' : '1px solid rgba(0,0,0,0.07)' }}
            >
              {/* Logo row */}
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg overflow-hidden ring-2 ring-[#C8962E]/40 shadow-md"
                    style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }}>
                    <img src={logoSrc} alt="LOGISTECH" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className={cn('font-bold text-sm', isDark ? 'text-white' : 'text-gray-900')} style={{ fontFamily: "'Playfair Display', serif" }}>LOGISTECH</p>
                    <p className="text-[#C8962E] text-[8px] tracking-[0.25em]">EQUIP+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile language switcher */}
                  <div className="flex gap-1">
                    {(['fr', 'en'] as const).map(lang => (
                      <button key={lang} onClick={() => switchLocale(lang)}
                        className={cn('px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-colors',
                          locale === lang
                            ? 'bg-[#C8962E] text-white'
                            : isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500')}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <AppearanceToggleTab />
                </div>
              </div>

              {/* Links */}
              <div className="px-3 py-3">
                {NAV_LINKS.map((link) => {
                  const isAnchor = link.href.startsWith('#');
                  const resolvedHref = isAnchor && currentUrl !== '/' ? '/' + link.href : link.href;
                  return (
                    <a key={link.href} href={resolvedHref} onClick={() => setOpen(false)}
                      className={cn('flex items-center justify-between px-4 py-3 rounded-xl mb-0.5 transition-all group',
                        isDark ? 'hover:bg-white/8 text-gray-200' : 'hover:bg-gray-50 text-gray-700')}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-lg">{link.icon}</span>
                        <span className="font-medium text-sm">{link.label}</span>
                      </span>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="px-4 pb-4 pt-2 flex flex-col gap-2.5"
                style={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)' }}>
                {auth?.user ? (
                  canDashboard && (
                    <Link href={dashboard()} onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium text-[#C8962E] border border-[#C8962E]/25 hover:bg-[#C8962E] hover:text-white transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <LayoutDashboard size={15} />
                      {t('nav_dashboard')}
                    </Link>
                  )
                ) : (
                  <>
                    <Link href={login()} onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium border border-[#C8962E]/30 text-[#C8962E] hover:bg-[#C8962E] hover:text-white transition-all"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <LogIn size={15} />
                      {t('nav_login')}
                    </Link>
                    {canRegister && (
                      <Link href={register()} onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold bg-gray-900 text-white"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <Sparkles size={14} />
                        {t('nav_register')}
                      </Link>
                    )}
                  </>
                )}

                <button onClick={() => { onDevis(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #C8962E, #E8B84B)', boxShadow: '0 8px 20px rgba(200,150,46,0.3)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  <FileText size={15} />
                  {t('nav_quote_mobile')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
