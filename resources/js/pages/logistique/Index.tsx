import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Users, Package, MapPin, BarChart3, Plus, X, ChevronRight, Activity, AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react';
import StatsDashboard from '@/components/logistique/Statsdashboard';
import CamionsTab from '@/components/logistique/Camionstab';
import ChauffeursTab from '@/components/logistique/Chauffeurstab';
import ExpeditionsTab from '@/components/logistique/Expeditionstab';
import LivraisonsTab from '@/components/logistique/Livraisonstab';
import { Stats, Camion, Chauffeur, Produit, Expedition } from '@/types/logistique';



const TABS = [
    { id: 'dashboard', label: 'Vue globale', icon: BarChart3, accent: '#F97316' },
    { id: 'camions', label: 'Camions', icon: Truck, accent: '#3B82F6' },
    { id: 'chauffeurs', label: 'Chauffeurs', icon: Users, accent: '#8B5CF6' },
    { id: 'expeditions', label: 'Expéditions', icon: MapPin, accent: '#10B981' },
    { id: 'livraisons', label: 'Livraisons', icon: Package, accent: '#F59E0B' },
];

export default function LogistiqueIndex(props: { stats: Stats; expeditions: unknown; camions: Camion[]; chauffeurs: Chauffeur[]; camionsDisponibles: Camion[]; chauffeursDisponibles: Chauffeur[]; produits: Produit[]; livraisons: unknown; }) {
    const { auth } = usePage().props;
    const [activeTab, setActiveTab] = useState('dashboard');

    const activeTabDef = TABS.find(t => t.id === activeTab);

    return (
        <>
            <Head title="Logistique" />

            <div className="min-h-screen bg-[#0A0A0B] text-white font-['Geist',_system-ui,_sans-serif]">

                {/* Top header bar */}
                <header className="border-b border-white/[0.06] bg-[#0D0D0F]/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/20">
                               <img src="/logo.jpeg" alt="" />
                            </div>
                            <div>
                                <span className="text-[13px] font-semibold tracking-tight text-white">LOGITECH</span>
                           
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[13px] text-white/40">
                            <Activity size={14} className="text-green-400" />
                            <span>Système opérationnel</span>
                            <span className="mx-2 opacity-30">·</span>
                            <span className="text-white/60">{auth?.user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    {/* Page title */}
                    <div className="mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-[42px] leading-none font-bold tracking-[-0.03em] text-white mb-2">
                                Gestion <span className="text-white/20">logistique</span>
                            </h1>
                            <p className="text-[15px] text-white/40">
                                Pilotez vos transports, camions, chauffeurs et livraisons en temps réel.
                            </p>
                        </motion.div>
                    </div>

                    {/* Tab navigation */}
                    <div className="flex items-center gap-1 mb-8 p-1 bg-white/[0.04] rounded-2xl w-fit border border-white/[0.06]">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-200 cursor-pointer"
                                    style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="tab-pill"
                                            className="absolute inset-0 rounded-xl"
                                            style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.1)' }}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                        />
                                    )}
                                    <Icon size={14} style={{ color: isActive ? tab.accent : undefined }} />
                                    <span className="relative">{tab.label}</span>
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
                            {activeTab === 'dashboard' && <StatsDashboard stats={props.stats} expeditions={props.expeditions as Expedition[]} />}
                            {activeTab === 'camions' && <CamionsTab camions={props.camions} />}
                            {activeTab === 'chauffeurs' && <ChauffeursTab chauffeurs={props.chauffeurs} />}
                            {activeTab === 'expeditions' && (
                                <ExpeditionsTab
                                    expeditions={props.expeditions as Expedition[]}
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
                                    expeditions={props.expeditions}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
}