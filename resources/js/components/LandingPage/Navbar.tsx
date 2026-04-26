
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, Menu, X, FileText, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppearanceToggleTab from './Appearancetoggletab';

const NAV_LINKS = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Services', href: '#services' },
    { label: 'À Propos', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

interface NavbarProps {
    onDevis: () => void;
    canRegister?: boolean;
    isAdmin: Boolean,
    isSuperAdmin: Boolean
}


export function Navbar({ onDevis, canRegister = true, isAdmin=false, isSuperAdmin =false}: NavbarProps) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { auth } = usePage().props;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
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
    console.log('his ',canAccessDashboard)
    return (
        <>
            <nav
                className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
                style={{
                    background: scrolled ? 'rgba(6,13,26,0.96)' : 'transparent',
                    backdropFilter: scrolled ? 'blur(24px)' : 'none',
                    borderBottom: scrolled ? '1px solid rgba(200,150,46,0.12)' : 'none',
                    boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.4)' : 'none',
                }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
                    {/* Logo - Version améliorée */}
                    <a href="#hero" className="flex items-center gap-3 group shrink-0">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg transition-transform group-hover:scale-105 duration-300"
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
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm lg:text-base leading-tight tracking-wide">
                                LOGISTECH
                            </span>
                            <span className="text-[#C8962E] text-[10px] lg:text-xs tracking-[0.2em] font-light">
                                EQUIP+
                            </span>
                        </div>
                    </a>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-white/60 hover:text-[#C8962E] text-sm tracking-wide transition-colors relative group whitespace-nowrap"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C8962E] group-hover:w-full transition-all duration-300" />
                            </a>
                        ))}
                    </div>

                    {/* Desktop Right Section */}
                    <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
                        {auth?.user ? (
                            canAccessDashboard ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#C8962E] px-4 py-2 text-sm font-medium text-[#C8962E] hover:bg-[#C8962E] hover:text-black transition-all duration-300"
                                >
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                </Link>
                            ) : null
                        ) : (
                            <>
                                <Link href={login()} className="...">
                                    <LogIn size={16} />
                                    Connexion
                                </Link>
                                {canRegister && (
                                    <Link href={register()} className="...">
                                        <UserPlus size={16} />
                                        Inscription
                                    </Link>
                                )}
                            </>
                        )}

                        <AppearanceToggleTab />

                        {/* Devis Button Desktop */}
                        <button
                            onClick={onDevis}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm text-black transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}
                        >
                            <FileText size={15} /> Devis
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="lg:hidden w-10 h-10 flex items-center justify-center text-white rounded-lg shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                    >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 left-0 right-0 z-[99] lg:hidden px-4 pb-4"
                    >
                        <div
                            className="rounded-2xl p-6 flex flex-col gap-4 max-h-[calc(100vh-6rem)] overflow-y-auto"
                            style={{
                                background: 'rgba(6,13,26,0.98)',
                                border: '1px solid rgba(200,150,46,0.2)',
                                backdropFilter: 'blur(20px)'
                            }}
                        >
                            {/* Logo dans menu mobile */}
                            <div className="flex items-center justify-center gap-3 pb-4 mb-2 border-b border-white/10">
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
                                    <span className="text-white font-bold text-sm leading-tight">
                                        LOGISTECH
                                    </span>
                                    <span className="text-[#C8962E] text-[10px] tracking-[0.2em] font-light">
                                        EQUIP+
                                    </span>
                                </div>
                            </div>

                            {NAV_LINKS.map(link => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="text-white/70 hover:text-[#C8962E] text-lg font-medium py-3 border-b border-white/5 transition-colors text-center"
                                >
                                    {link.label}
                                </a>
                            ))}

                         {auth?.user && canAccessDashboard ? (
    <Link
        href={dashboard()}
        onClick={() => setOpen(false)}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C8962E] px-4 py-3 text-sm font-medium text-[#C8962E] hover:bg-[#C8962E] hover:text-black transition-all duration-300"
    >
        <LayoutDashboard size={16} />
        Dashboard
    </Link>
) : (
    <div className="flex flex-col gap-3">
        <Link href={login()} onClick={() => setOpen(false)} className="...">
            <LogIn size={16} />
            Connexion
        </Link>

        {canRegister && (
            <Link href={register()} onClick={() => setOpen(false)} className="...">
                <UserPlus size={16} />
                Inscription
            </Link>
        )}
    </div>
)}

                            <button
                                onClick={() => {
                                    onDevis();
                                    setOpen(false);
                                }}
                                className="mt-2 py-3 rounded-xl text-black font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}
                            >
                                <FileText size={16} />
                                Demander un devis
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}