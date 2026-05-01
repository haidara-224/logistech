import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { LoadingScreen } from '@/components/LandingPage/LoadingScreen';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';
import { DevisModal } from '@/components/LandingPage/DevisModal';
import type { BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
    isAdmin: Boolean;
    isSuperAdmin: Boolean;
}

export default function AppLayoutLanding({
    breadcrumbs = [],
    children,
    isAdmin = false,
    isSuperAdmin = false,
}: AppLayoutProps) {
    const [devisOpen, setDevisOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ── Body overflow: ONLY lock when modal is open ──────────────────────────
    // Never lock during loading — that's what caused the scroll to stay broken
    // after the loading screen disappeared.
    useEffect(() => {
        if (devisOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; // also lock <html>
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [devisOpen]);

    // ── When loading completes, make sure scroll is fully restored ────────────
    useEffect(() => {
        if (!isLoading) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }, [isLoading]);

    return (
        <>
            {/* Loading screen — rendered at root level, no overflow side-effects */}
            <LoadingScreen
                onLoadingComplete={() => setIsLoading(false)}
                minDisplayTime={2500}
            />

            {/* Main app shell — always in DOM once loading is done */}
            {!isLoading && (
                // ── CRITICAL: this wrapper must NEVER have overflow:hidden/scroll ──
                // Use a plain div with no overflow, no height constraints
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    <Navbar
                        onDevis={() => setDevisOpen(true)}
                        canRegister
                        isAdmin={isAdmin}
                        isSuperAdmin={isSuperAdmin}
                    />

                    {/* main: no overflow, no height — grows with content naturally */}
                    <main style={{ display: 'block', position: 'relative' }}>
                        {children}
                    </main>

                    <Footer onDevis={() => setDevisOpen(true)} />

                    {/* Floating CTA */}
                    <motion.button
                        onClick={() => setDevisOpen(true)}
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-black text-sm shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg,#C8962E,#E8B84B)',
                            boxShadow: '0 20px 60px rgba(200,150,46,0.5)',
                        }}
                    >
                        <FileText size={18} />
                        <span className="hidden sm:inline">Devis gratuit</span>
                    </motion.button>

                    {/* Devis Modal */}
                    <AnimatePresence mode="wait">
                        {devisOpen && <DevisModal onClose={() => setDevisOpen(false)} />}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
}