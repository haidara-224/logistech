import { Expedition, Stats } from '@/types/logistique';
import { motion } from 'framer-motion';
import {
    Truck, Users, Package, MapPin, BarChart3,
    ArrowUpRight, TrendingUp, CheckCircle2,
} from 'lucide-react';


// ── Stat card config ─────────────────────────────────────────────────────────
interface StatConfig {
    key: keyof Stats;
    label: string;
    icon: React.ElementType;
    accent: string;
    bg: string;
    border: string;
    suffix: string;
}

const STAT_CARDS: StatConfig[] = [
    {
        key:    'camions_disponibles',
        label:  'Camions disponibles',
        icon:   Truck,
        accent: '#3B82F6',
        bg:     'rgba(59,130,246,0.08)',
        border: 'rgba(59,130,246,0.15)',
        suffix: '/ flotte',
    },
    {
        key:    'expeditions_en_cours',
        label:  'Expéditions actives',
        icon:   MapPin,
        accent: '#10B981',
        bg:     'rgba(16,185,129,0.08)',
        border: 'rgba(16,185,129,0.15)',
        suffix: 'en route',
    },
    {
        key:    'livraisons_en_preparation',
        label:  'En préparation',
        icon:   Package,
        accent: '#F59E0B',
        bg:     'rgba(245,158,11,0.08)',
        border: 'rgba(245,158,11,0.15)',
        suffix: 'expéditions',
    },
    {
        key:    'livraisons_livrees',
        label:  'Livrées',
        icon:   CheckCircle2,
        accent: '#8B5CF6',
        bg:     'rgba(139,92,246,0.08)',
        border: 'rgba(139,92,246,0.15)',
        suffix: 'total',
    },
    {
        key:    'chauffeurs_en_mission',
        label:  'Chauffeurs en mission',
        icon:   Users,
        accent: '#F97316',
        bg:     'rgba(249,115,22,0.08)',
        border: 'rgba(249,115,22,0.15)',
        suffix: 'actifs',
    },
];

// ── Expedition status map ────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
    'en cours':       { color: '#10B981', bg: 'rgba(16,185,129,0.12)',  label: 'En cours' },
    'en préparation': { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Préparation' },
    'livré':          { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'Livré' },
    'annulé':         { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  label: 'Annulé' },
};

// ── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ config, value, index }: { config: StatConfig; value: number; index: number }) {
    const Icon = config.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl p-6 border overflow-hidden"
            style={{ background: config.bg, borderColor: config.border }}
        >
            {/* ambient glow */}
            <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none"
                style={{ background: config.accent }}
            />

            <div className="relative flex items-start justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${config.accent}22` }}
                >
                    <Icon size={18} style={{ color: config.accent }} />
                </div>
                <ArrowUpRight size={14} className="text-white/20 mt-1" />
            </div>

            <div className="relative">
                <p className="text-[42px] leading-none font-bold tracking-tight text-white mb-1">
                    {value}
                </p>
                <p className="text-[13px] text-white/40 font-medium">{config.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: `${config.accent}99` }}>
                    {config.suffix}
                </p>
            </div>
        </motion.div>
    );
}

function ExpeditionRow({ expedition, index }: { expedition: Expedition; index: number }) {
    const cfg = STATUS_CFG[expedition.statut] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.12)', label: expedition.statut };

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 py-3.5 border-b border-white/[0.05] last:border-0"
        >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white tracking-tight">
                    {expedition.reference}
                </p>
                <p className="text-[12px] text-white/40 mt-0.5 flex items-center gap-1">
                    <span className="truncate">{expedition.origine}</span>
                    <span className="text-white/20 flex-shrink-0">→</span>
                    <span className="truncate">{expedition.destination}</span>
                </p>
            </div>

            <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0"
                style={{ color: cfg.color, background: cfg.bg }}
            >
                {cfg.label}
            </span>

            <span className="text-[12px] text-white/25 hidden sm:block flex-shrink-0">
                {expedition.camion?.immatriculation ?? '—'}
            </span>
        </motion.div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
interface StatsDashboardProps {
    stats: Stats;
    expeditions: Expedition[];
}

export default function StatsDashboard({ stats, expeditions }: StatsDashboardProps) {
    // Compute totaux from live expedition list for the "répartition" strip
    const total = expeditions.length;
    const pctEnCours       = total ? Math.round((stats.expeditions_en_cours / total) * 100) : 0;
    const pctPreparation   = total ? Math.round((stats.livraisons_en_preparation / total) * 100) : 0;
    const pctLivrees       = total ? Math.round((stats.livraisons_livrees / total) * 100) : 0;

    return (
        <div className="space-y-6">

            {/* ── Stats grid ── */}
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
                {STAT_CARDS.map((config, i) => (
                    <StatCard
                        key={config.key}
                        config={config}
                        value={stats[config.key]}
                        index={i}
                    />
                ))}
            </div>

            {/* ── Progress strip ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-6 py-5"
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-semibold text-white">Répartition des expéditions</p>
                    <p className="text-[12px] text-white/30">{total} au total</p>
                </div>

                {/* Stacked bar */}
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
                    <div className="h-full rounded-l-full transition-all duration-700"
                        style={{ width: `${pctEnCours}%`, background: '#10B981' }} />
                    <div className="h-full transition-all duration-700"
                        style={{ width: `${pctPreparation}%`, background: '#F59E0B' }} />
                    <div className="h-full rounded-r-full transition-all duration-700"
                        style={{ width: `${pctLivrees}%`, background: '#8B5CF6' }} />
                </div>

                <div className="flex items-center gap-5 mt-3 text-[11px] text-white/40">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#10B981' }} />
                        En cours ({pctEnCours}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#F59E0B' }} />
                        Préparation ({pctPreparation}%)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#8B5CF6' }} />
                        Livrées ({pctLivrees}%)
                    </span>
                </div>
            </motion.div>

            {/* ── Recent expeditions list ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-[15px] font-semibold text-white">Expéditions récentes</h2>
                        <p className="text-[12px] text-white/30 mt-0.5">Triées par date de départ décroissante</p>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-white/30">
                        <TrendingUp size={13} />
                        <span>{total} expédition{total !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {expeditions.length === 0 ? (
                    <p className="text-center text-white/20 text-[13px] py-8">
                        Aucune expédition enregistrée
                    </p>
                ) : (
                    <div>
                        {expeditions.slice(0, 10).map((exp, i) => (
                            <ExpeditionRow key={exp.id} expedition={exp} index={i} />
                        ))}
                        {expeditions.length > 10 && (
                            <p className="text-center text-[12px] text-white/25 pt-4">
                                + {expeditions.length - 10} expédition{expeditions.length - 10 > 1 ? 's' : ''} supplémentaire{expeditions.length - 10 > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}