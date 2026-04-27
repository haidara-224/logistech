import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileText, LogIn, UserPlus, LayoutDashboard, ChevronRight, Sparkles } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppearanceToggleTab from './Appearancetoggletab';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
    { label: 'Accueil', href: '#hero', icon: '🏠' },
    { label: 'Services', href: '#services', icon: '⚡' },
    { label: 'À Propos', href: '#about', icon: '✨' },
    { label: 'Contact', href: '#contact', icon: '💬' },
];

interface NavbarProps {
    onDevis: () => void;
    canRegister?: boolean;
    isAdmin: Boolean;
    isSuperAdmin: Boolean;
}

export function Navbar({ onDevis, canRegister = true, isAdmin = false, isSuperAdmin = false }: NavbarProps) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('');

    const { auth } = usePage().props;
    const { resolvedAppearance } = useAppearance();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
            
            // Détection de la section active
            const sections = NAV_LINKS.map(link => link.href.substring(1));
            const scrollPosition = window.scrollY + 100;
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveLink(section);
                        break;
                    }
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    const canAccessDashboard = isAdmin || isSuperAdmin;
    const isDark = resolvedAppearance === 'dark';

    // Animation variants
    const menuVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -20 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
                type: "spring" as const, 
                stiffness: 300, 
                damping: 30 
            }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: -20,
            transition: { duration: 0.2 }
        }
    };

    const linkVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, duration: 0.3 }
        })
    };

    return (
        <>
            <nav
                className={cn(
                    'fixed top-0 left-0 right-0 z-[100] transition-all duration-700',
                    scrolled && 'shadow-2xl'
                )}
                style={{
                    background: scrolled
                        ? (isDark 
                            ? 'rgba(6,13,26,0.95)' 
                            : 'rgba(255,255,255,0.95)')
                        : 'transparent',
                    backdropFilter: scrolled ? 'blur(32px)' : 'none',
                    borderBottom: scrolled
                        ? (isDark 
                            ? '1px solid rgba(200,150,46,0.15)' 
                            : '1px solid rgba(200,150,46,0.1)')
                        : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo avec effet de brillance */}
                        <motion.a 
                            href="#hero" 
                            className="flex items-center gap-3 group shrink-0 relative"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                                <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden shadow-lg transition-all group-hover:shadow-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #C8962E, #E8B84B)',
                                        padding: '2px'
                                    }}>
                                    <div className="w-full h-full rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                                        <img
                                            src="/logo.jpeg"
                                            alt="LOGISTECH EQUIP+"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    'font-bold text-sm lg:text-base leading-tight tracking-wide transition-colors',
                                    isDark ? 'text-white' : 'text-gray-800'
                                )}>
                                    LOGISTECH
                                </span>
                                <span className="text-[#C8962E] text-[10px] lg:text-xs tracking-[0.2em] font-light">
                                    EQUIP+
                                </span>
                            </div>
                        </motion.a>

                        {/* Desktop Navigation - Élégant avec indicateur actif */}
                        <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1">
                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className={cn(
                                        'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg',
                                        'hover:bg-gradient-to-r hover:from-[#C8962E]/10 hover:to-[#E8B84B]/10',
                                        activeLink === link.href.substring(1)
                                            ? (isDark ? 'text-[#C8962E]' : 'text-[#C8962E]')
                                            : (isDark ? 'text-gray-300 hover:text-[#C8962E]' : 'text-gray-600 hover:text-[#C8962E]')
                                    )}
                                >
                                    <span className="relative z-10">{link.label}</span>
                                    {activeLink === link.href.substring(1) && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#C8962E]/20 to-[#E8B84B]/20"
                                            transition={{ type: "spring", duration: 0.6 }}
                                        />
                                    )}
                                </a>
                            ))}
                        </div>

                        {/* Desktop Right Section - Design épuré */}
                        <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
                            {auth?.user ? (
                                canAccessDashboard && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href={dashboard()}
                                            className="group relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium overflow-hidden transition-all duration-300"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#C8962E] to-[#E8B84B] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="relative flex items-center gap-2 text-[#C8962E] group-hover:text-white transition-colors">
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </span>
                                        </Link>
                                    </motion.div>
                                )
                            ) : (
                                <>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-[#C8962E] text-[#C8962E] hover:bg-[#C8962E] hover:text-white transition-all duration-300"
                                        >
                                            <LogIn size={16} />
                                            Connexion
                                        </Link>
                                    </motion.div>
                                    {canRegister && (
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Link
                                                href={register()}
                                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <Sparkles size={16} />
                                                Inscription
                                            </Link>
                                        </motion.div>
                                    )}
                                </>
                            )}

                            <AppearanceToggleTab />

                            {/* Devis Button Desktop */}
                            <motion.button
                                onClick={onDevis}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm overflow-hidden shadow-lg"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#C8962E] to-[#E8B84B] transition-transform group-hover:scale-110" />
                                <span className="relative flex items-center gap-2 text-white">
                                    <FileText size={15} />
                                    Devis
                                </span>
                            </motion.button>
                        </div>

                        {/* Mobile Menu Button - Design minimaliste */}
                        <motion.button
                            onClick={() => setOpen(prev => !prev)}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                'lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'
                            )}
                            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            <AnimatePresence mode="wait">
                                {open ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X size={20} className={isDark ? 'text-white' : 'text-gray-700'} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu size={20} className={isDark ? 'text-white' : 'text-gray-700'} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu - Design moderne glassmorphique */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-sm lg:hidden"
                        />
                        
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-[72px] left-4 right-4 z-[99] lg:hidden"
                        >
                            <div
                                className={cn(
                                    'rounded-2xl p-6 flex flex-col gap-3 max-h-[calc(100vh-6rem)] overflow-y-auto',
                                    'shadow-2xl backdrop-blur-xl border'
                                )}
                                style={{
                                    background: isDark 
                                        ? 'rgba(10, 20, 35, 0.98)' 
                                        : 'rgba(255, 255, 255, 0.98)',
                                    borderColor: isDark 
                                        ? 'rgba(200,150,46,0.2)' 
                                        : 'rgba(200,150,46,0.1)',
                                }}
                            >
                                {/* Logo et branding */}
                                <div className="flex items-center justify-between pb-4 mb-2 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-lg overflow-hidden"
                                            style={{
                                                background: 'linear-gradient(135deg, #C8962E, #E8B84B)',
                                                padding: '2px'
                                            }}>
                                            <div className="w-full h-full rounded-md overflow-hidden bg-white/10">
                                                <img
                                                    src="/logo.jpeg"
                                                    alt="LOGISTECH"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={cn('font-bold text-sm leading-tight', isDark ? 'text-white' : 'text-gray-800')}>
                                                LOGISTECH
                                            </span>
                                            <span className="text-[#C8962E] text-[10px] tracking-[0.2em] font-light">
                                                EQUIP+
                                            </span>
                                        </div>
                                    </div>
                                    <AppearanceToggleTab />
                                </div>

                                {/* Navigation Links avec animations */}
                                <div className="flex flex-col gap-1 py-2">
                                    {NAV_LINKS.map((link, index) => (
                                        <motion.a
                                            key={link.label}
                                            custom={index}
                                            variants={linkVariants}
                                            initial="hidden"
                                            animate="visible"
                                            href={link.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                'flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group',
                                                isDark 
                                                    ? 'hover:bg-white/5 text-gray-300 hover:text-[#C8962E]' 
                                                    : 'hover:bg-black/5 text-gray-600 hover:text-[#C8962E]'
                                            )}
                                        >
                                            <span className="flex items-center gap-3">
                                                <span className="text-xl">{link.icon}</span>
                                                <span className="font-medium">{link.label}</span>
                                            </span>
                                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.a>
                                    ))}
                                </div>

                                {/* Actions Section */}
                                <div className="flex flex-col gap-3 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                                    {auth?.user && canAccessDashboard ? (
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Link
                                                href={dashboard()}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white shadow-md"
                                            >
                                                <LayoutDashboard size={16} />
                                                Dashboard
                                            </Link>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Link
                                                    href={login()}
                                                    onClick={() => setOpen(false)}
                                                    className={cn(
                                                        'flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-medium border transition-all duration-300',
                                                        isDark
                                                            ? 'border-[#C8962E] text-[#C8962E] hover:bg-[#C8962E] hover:text-black'
                                                            : 'border-[#C8962E] text-[#C8962E] hover:bg-[#C8962E] hover:text-white'
                                                    )}
                                                >
                                                    <LogIn size={16} />
                                                    Connexion
                                                </Link>
                                            </motion.div>

                                            {canRegister && (
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Link
                                                        href={register()}
                                                        onClick={() => setOpen(false)}
                                                        className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white shadow-md"
                                                    >
                                                        <Sparkles size={16} />
                                                        Inscription
                                                    </Link>
                                                </motion.div>
                                            )}
                                        </>
                                    )}

                                    {/* Devis Button Mobile */}
                                    <motion.button
                                        onClick={() => {
                                            onDevis();
                                            setOpen(false);
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white shadow-lg"
                                    >
                                        <FileText size={16} />
                                        Demander un devis
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}