import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoadingScreen } from '@/components/LandingPage/LoadingScreen';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';
import { DevisModal } from '@/components/LandingPage/DevisModal';
import { WhatsAppButton } from '@/components/WhatsAppButton';
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

 
    useEffect(() => {
        if (devisOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden'; 
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [devisOpen]);

  
    useEffect(() => {
        if (!isLoading) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }, [isLoading]);

    return (
        <>
            
            <LoadingScreen
                onLoadingComplete={() => setIsLoading(false)}
                minDisplayTime={2500}
            />

      
            {!isLoading && (
           
                <div style={{ position: 'relative', minHeight: '100vh' }}>
                    <Navbar
                        onDevis={() => setDevisOpen(true)}
                        canRegister
                        isAdmin={isAdmin}
                        isSuperAdmin={isSuperAdmin}
                    />

                 
                    <main style={{ display: 'block', position: 'relative' }}>
                        {children}
                    </main>

                    <Footer onDevis={() => setDevisOpen(true)} />

                    <WhatsAppButton />

                    {/* Devis Modal */}
                    <AnimatePresence mode="wait">
                        {devisOpen && <DevisModal onClose={() => setDevisOpen(false)} />}
                    </AnimatePresence>
                </div>
            )}
        </>
    );
}