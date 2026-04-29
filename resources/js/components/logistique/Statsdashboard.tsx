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
    suffix: string;
}

const STAT_CARDS: StatConfig[] = [
    {
        key:    'camions_disponibles',
        label:  'Camions disponibles',
        icon:   Truck,
        accent: '#3B82F6',
        suffix: '/ flotte',
    },
    {
        key:    'expeditions_en_cours',
        label:  'Expéditions actives',
        icon:   MapPin,
        accent: '#10B981',
        suffix: 'en route',
    },
    {
        key:    'livraisons_en_preparation',
        label:  'En préparation',
        icon:   Package,
        accent: '#F59E0B',
        suffix: 'expéditions',
    },
    {
        key:    'livraisons_livrees',
        label:  'Livrées',
        icon:   CheckCircle2,
        accent: '#8B5CF6',
        suffix: 'total',
    },
    {
        key:    'chauffeurs_en_mission',
        label:  'Chauffeurs en mission',
        icon:   Users,
        accent: '#F97316',
        suffix: 'actifs',
    },
];

// ── Expedition status map ────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
    'en cours':       { color: '#10B981', bg: 'bg-emerald-500/10', label: 'En cours' },
    'en préparation': { color: '#F59E0B', bg: 'bg-amber-500/10', label: 'Préparation' },
    'livré':          { color: '#8B5CF6', bg: 'bg-violet-500/10', label: 'Livré' },
    'annulé':         { color: '#EF4444', bg: 'bg-red-500/10', label: 'Annulé' },
};

// ── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ config, value, index }: { config: StatConfig; value: number; index: number }) {
    const Icon = config.icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl p-6 border border-border bg-card overflow-hidden"
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
                <ArrowUpRight size={14} className="text-muted-foreground/50 mt-1" />
            </div>

            <div className="relative">
                <p className="text-[42px] leading-none font-bold tracking-tight text-foreground mb-1">
                    {value}
                </p>
                <p className="text-[13px] text-muted-foreground font-medium">{config.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: `${config.accent}99` }}>
                    {config.suffix}
                </p>
            </div>
        </motion.div>
    );
}

function ExpeditionRow({ expedition, index }: { expedition: Expedition; index: number }) {
    const cfg = STATUS_CFG[expedition.statut] ?? { color: '#6B7280', bg: 'bg-gray-500/10', label: expedition.statut };

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 py-3.5 border-b border-border last:border-0"
        >
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground tracking-tight">
                    {expedition.reference}
                </p>
                <p className="text-[12px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <span className="truncate">{expedition.origine}</span>
                    <span className="flex-shrink-0">→</span>
                    <span className="truncate">{expedition.destination}</span>
                </p>
            </div>

            <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap flex-shrink-0 ${cfg.bg}`}
                style={{ color: cfg.color }}
            >
                {cfg.label}
            </span>

            <span className="text-[12px]  hidden sm:block flex-shrink-0">
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
    // Compute totals from live expedition list for the "répartition" strip
    const total = expeditions.length;
    const pctEnCours = total ? Math.round((stats.expeditions_en_cours / total) * 100) : 0;
    const pctPreparation = total ? Math.round((stats.livraisons_en_preparation / total) * 100) : 0;
    const pctLivrees = total ? Math.round((stats.livraisons_livrees / total) * 100) : 0;

    // Get recent expeditions (last 10, sorted by date if available)
    const recentExpeditions = [...expeditions]
        .sort((a, b) => {
            if (!a.date_depart && !b.date_depart) return 0;
            if (!a.date_depart) return 1;
            if (!b.date_depart) return -1;
            return new Date(b.date_depart).getTime() - new Date(a.date_depart).getTime();
        })
        .slice(0, 10);

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
                className="rounded-2xl border border-border bg-card p-6"
            >
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-semibold text-foreground">Répartition des expéditions</p>
                    <p className="text-[12px] text-muted-foreground">{total} au total</p>
                </div>

                {/* Stacked bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <motion.div 
                        className="h-full rounded-l-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pctEnCours}%` }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        style={{ background: '#10B981' }} 
                    />
                    <motion.div 
                        className="h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pctPreparation}%` }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        style={{ background: '#F59E0B' }} 
                    />
                    <motion.div 
                        className="h-full rounded-r-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pctLivrees}%` }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        style={{ background: '#8B5CF6' }} 
                    />
                </div>

                <div className="flex items-center gap-5 mt-3 text-[11px] text-muted-foreground">
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
                className="rounded-2xl border border-border bg-card p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-[15px] font-semibold text-foreground">Expéditions récentes</h2>
                        <p className="text-[12px] text-muted-foreground mt-0.5">Triées par date de départ décroissante</p>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <TrendingUp size={13} />
                        <span>{total} expédition{total !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {expeditions.length === 0 ? (
                    <div className="text-center py-8">
                        <Package size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground/50">
                            Aucune expédition enregistrée
                        </p>
                    </div>
                ) : (
                    <div>
                        {recentExpeditions.map((exp, i) => (
                            <ExpeditionRow key={exp.id} expedition={exp} index={i} />
                        ))}
                        {expeditions.length > 10 && (
                            <p className="text-center text-[12px] text-muted-foreground/40 pt-4">
                                + {expeditions.length - 10} expédition{expeditions.length - 10 > 1 ? 's' : ''} supplémentaire{expeditions.length - 10 > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}