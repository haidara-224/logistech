
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
     isAdmin: Boolean,
    isSuperAdmin: Boolean
}

export default function AppLayout({ breadcrumbs = [], children,   isAdmin = false,
    isSuperAdmin = false }: AppLayoutProps) {
    const [devisOpen, setDevisOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Gestion du scroll quand le modal est ouvert
        if (devisOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [devisOpen]);

    return (
        <>
            <LoadingScreen 
                onLoadingComplete={() => setIsLoading(false)}
                minDisplayTime={2500} 
            />

            {!isLoading && (
                <>
                    <Navbar onDevis={() => setDevisOpen(true)} canRegister isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />
                    
                    <main>
                        {children}
                    </main>
                    
                    <Footer onDevis={() => setDevisOpen(true)} />

                    {/* Floating CTA Button */}
                    <motion.button
                        onClick={() => setDevisOpen(true)}
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-[90] flex items-center gap-2.5 px-5 py-3.5 rounded-full font-bold text-black text-sm shadow-2xl"
                        style={{
                            background: "linear-gradient(135deg,#C8962E,#E8B84B)",
                            boxShadow: "0 20px 60px rgba(200,150,46,0.5)"
                        }}
                    >
                        <FileText size={18} />
                        <span className="hidden sm:inline">Devis gratuit</span>
                    </motion.button>

                    {/* Devis Modal */}
                    <AnimatePresence mode="wait">
                        {devisOpen && <DevisModal onClose={() => setDevisOpen(false)} />}
                    </AnimatePresence>
                </>
            )}
        </>
    );
}