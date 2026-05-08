import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Users, Package, MapPin, BarChart3, Activity, Wrench } from 'lucide-react';
import StatsDashboard from '@/components/logistique/Statsdashboard';
import CamionsTab from '@/components/logistique/Camionstab';
import ChauffeursTab from '@/components/logistique/Chauffeurstab';
import ExpeditionsTab from '@/components/logistique/Expeditionstab';
import LivraisonsTab from '@/components/logistique/Livraisonstab';
import MaintenancesTab from '@/components/logistique/Maintenancestab';
import { LogistiqueProps } from '@/types/logistique';

const TABS = [
    { id: 'dashboard',      label: 'Vue globale',   icon: BarChart3, accent: '#F97316' },
    { id: 'camions',        label: 'Camions',        icon: Truck,     accent: '#3B82F6' },
    { id: 'chauffeurs',     label: 'Chauffeurs',     icon: Users,     accent: '#8B5CF6' },
    { id: 'expeditions',    label: 'Expéditions',    icon: MapPin,    accent: '#10B981' },
    { id: 'livraisons',     label: 'Livraisons',     icon: Package,   accent: '#F59E0B' },
    { id: 'maintenances',   label: 'Maintenances',   icon: Wrench,    accent: '#F97316' },
];

export default function LogistiqueIndex(props: LogistiqueProps) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <>
            <Head title="Logistique" />

            <div className="min-h-screen bg-background text-foreground">

                {/* Top header bar */}
                <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-400 mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <img src="/logo.jpeg" alt="Logo" className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-foreground">LOGISTECH</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Activity size={14} className="text-emerald-500" />
                            <span>Système opérationnel</span>
                            <span className="mx-2 opacity-30">·</span>
                            <span className="text-foreground/60">{(auth as any)?.user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-400 mx-auto px-6 py-8">

                    {/* Page title */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-4xl leading-none font-bold tracking-tight text-foreground mb-2">
                                Gestion <span className="text-muted-foreground/50">logistique</span>
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Pilotez vos transports, camions, chauffeurs et livraisons en temps réel.
                            </p>
                        </motion.div>
                    </div>

                    {/* Tab navigation */}
                    <div className="flex items-center gap-1 mb-8 p-1 bg-muted/40 rounded-2xl w-fit border border-border">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer"
                                    style={{ color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-pill"
                                            className="absolute inset-0 rounded-xl bg-secondary"
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <Icon size={14} style={{ color: isActive ? tab.accent : undefined }} />
                                    <span className="relative">{tab.label}</span>
                                    {/* Retard badge on dashboard tab */}
                                    {tab.id === 'dashboard' && props.stats.expeditions_en_retard > 0 && (
                                        <span className="relative ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">
                                            {props.stats.expeditions_en_retard}
                                        </span>
                                    )}
                                    {/* Pending validation badge on livraisons tab */}
                                    {tab.id === 'livraisons' && props.livraisonsAValider.length > 0 && (
                                        <span className="relative ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold">
                                            {props.livraisonsAValider.length}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {activeTab === 'dashboard' && (
                                <StatsDashboard
                                    stats={props.stats}
                                    expeditions={props.expeditions}
                                    retards={props.retards}
                                />
                            )}
                            {activeTab === 'camions' && (
                                <CamionsTab
                                    camions={props.camions}
                                    expeditions={props.expeditions}
                                />
                            )}
                            {activeTab === 'chauffeurs' && (
                                <ChauffeursTab
                                    chauffeurs={props.chauffeurs}
                                    expeditions={props.expeditions}
                                />
                            )}
                            {activeTab === 'expeditions' && (
                                <ExpeditionsTab
                                    expeditions={props.expeditions}
                                    camionsDisponibles={props.camionsDisponibles}
                                    chauffeursDisponibles={props.chauffeursDisponibles}
                                    camions={props.camions}
                                    chauffeurs={props.chauffeurs}
                                    produits={props.produits}
                                />
                            )}
                            {activeTab === 'livraisons' && (
                                <LivraisonsTab
                                    livraisons={props.livraisons}
                                    livraisonsAValider={props.livraisonsAValider}
                                    expeditions={props.expeditions}
                                />
                            )}
                            {activeTab === 'maintenances' && (
                                <MaintenancesTab
                                    maintenances={props.maintenances}
                                    maintenances_prochaines={props.maintenances_prochaines}
                                    camions={props.camions}
                                />
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}
