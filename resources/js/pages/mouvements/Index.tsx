import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    Activity,
    SlidersHorizontal,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    Settings2,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { toast } from 'sonner';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import type { MouvementsStock } from '@/types/models';

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmtNum = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

const shortNum = (v: number) =>
    v >= 1_000_000
        ? `${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `${(v / 1_000).toFixed(0)}k`
          : String(v);

// ─── Props ────────────────────────────────────────────────────────────────────

type FilterTab = 'tous' | 'entrees' | 'sorties';

interface Props {
    mouvements: {
        data: MouvementsStock[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total_entrees: number;
        total_sorties: number;
        mouvements_mois: number;
        ajustements_mois: number;
    };
    chart: { date: string; entrees: number; sorties: number }[];
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function FluxTooltip({ active, payload, label, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
        >
            <p className="text-xs text-zinc-500 mb-2 font-mono">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2 mb-1">
                    <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: p.color }}
                    />
                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {p.name}
                    </span>
                    <span
                        className="font-black text-xs ml-auto pl-4"
                        style={{ color: p.color }}
                    >
                        {fmtNum(p.value)} unités
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source?: string | null }) {
    if (source === 'commande') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                Commande
            </span>
        );
    }
    if (source === 'vente') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                Vente
            </span>
        );
    }
    if (source === 'ajustement') {
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Ajustement
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
            {source ?? '—'}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MouvementsIndex({ mouvements, stats, chart }: Props) {
    const { flash } = usePage().props as any;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const [activeTab, setActiveTab] = useState<FilterTab>('tous');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const gridColor = isDark ? '#27272a' : '#e5e7eb';
    const tickColor = isDark ? '#71717a' : '#6b7280';

    const axisProps = {
        axisLine: false as any,
        tickLine: false as any,
        tick: { fill: tickColor, fontSize: 11 },
    };

    const filteredData = mouvements.data.filter((m) => {
        if (activeTab === 'entrees') return m.type === 'entree';
        if (activeTab === 'sorties') return m.type === 'sortie';
        return true;
    });

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'tous', label: 'Tous' },
        { key: 'entrees', label: 'Entrées' },
        { key: 'sorties', label: 'Sorties' },
    ];

    return (
        <>
            <Head title="Mouvements de Stock" />

            <div className="min-h-full">
                <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">

                    {/* ── Hero Header ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
                    >
                        {/* Subtle gold overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C8962E22_0%,_transparent_70%)] pointer-events-none" />
                        {/* Grid pattern */}
                        <div
                            className="absolute inset-0 opacity-[0.04] pointer-events-none"
                            style={{
                                backgroundImage:
                                    'linear-gradient(#C8962E 1px, transparent 1px), linear-gradient(90deg, #C8962E 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-[#C8962E] animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8962E]">
                                        Stock
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    Mouvements de Stock
                                </h1>
                                <p className="mt-1.5 text-sm text-zinc-400">
                                    Tracez chaque entrée et sortie de votre inventaire
                                </p>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                {/* Stats bubble */}
                                <div className="rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-right backdrop-blur-sm">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
                                        Ce mois
                                    </p>
                                    <p className="text-3xl font-black text-[#E8B84B] tabular-nums">
                                        {fmtNum(stats.mouvements_mois)}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1">mouvements</p>
                                </div>

                                {/* Ajuster button */}
                                <Link
                                    href="/dashboard/stock/ajustements"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Settings2 className="w-4 h-4" />
                                    Ajuster le stock
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Metric Cards ─────────────────────────────────── */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                        <MetricCard
                            title="Total entrées"
                            value={fmtNum(stats.total_entrees)}
                            icon={ArrowUpCircle}
                            variant="success"
                            subtitle="Unités reçues"
                            delay={0}
                        />
                        <MetricCard
                            title="Total sorties"
                            value={fmtNum(stats.total_sorties)}
                            icon={ArrowDownCircle}
                            variant="warning"
                            subtitle="Unités sorties"
                            delay={0.1}
                        />
                        <MetricCard
                            title="Mouvements ce mois"
                            value={fmtNum(stats.mouvements_mois)}
                            icon={Activity}
                            variant="info"
                            subtitle="30 derniers jours"
                            delay={0.2}
                        />
                        <MetricCard
                            title="Ajustements mois"
                            value={fmtNum(stats.ajustements_mois)}
                            icon={SlidersHorizontal}
                            variant="default"
                            subtitle="Corrections manuelles"
                            delay={0.3}
                        />
                    </div>

                    {/* ── Flux Chart ───────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="rounded-2xl overflow-hidden">
                            <CardHeader className="pb-0 px-6 pt-5">
                                <CardTitle className="font-black text-base tracking-tight flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#C8962E]" />
                                    Flux de stock (30 jours)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 px-2 pb-4">
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart
                                        data={chart}
                                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="gEntrees" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="gSorties" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.25} />
                                                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke={gridColor}
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            {...axisProps}
                                            interval={4}
                                            style={{ fontFamily: 'monospace' }}
                                        />
                                        <YAxis {...axisProps} tickFormatter={shortNum} />
                                        <Tooltip
                                            content={(p) => <FluxTooltip {...p} isDark={isDark} />}
                                            cursor={{
                                                stroke: isDark ? '#3f3f46' : '#d1d5db',
                                                strokeWidth: 1,
                                                strokeDasharray: '4 4',
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="entrees"
                                            name="Entrées"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            fill="url(#gEntrees)"
                                            dot={false}
                                            activeDot={{
                                                r: 4,
                                                fill: '#22c55e',
                                                stroke: isDark ? '#18181b' : '#fff',
                                                strokeWidth: 2,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="sorties"
                                            name="Sorties"
                                            stroke="#dc2626"
                                            strokeWidth={2}
                                            fill="url(#gSorties)"
                                            dot={false}
                                            activeDot={{
                                                r: 4,
                                                fill: '#ef4444',
                                                stroke: isDark ? '#18181b' : '#fff',
                                                strokeWidth: 2,
                                            }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* ── Mouvements Table ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="rounded-2xl overflow-hidden">
                            <CardHeader className="pb-0 px-6 pt-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <CardTitle className="font-black text-base tracking-tight flex items-center gap-2">
                                        <SlidersHorizontal className="w-4 h-4 text-[#C8962E]" />
                                        Historique des mouvements
                                    </CardTitle>

                                    {/* Filter Tabs */}
                                    <div className="flex items-center rounded-xl border border-border overflow-hidden text-xs font-semibold self-start sm:self-auto">
                                        {tabs.map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setActiveTab(tab.key)}
                                                className={`px-4 py-2 transition-colors ${
                                                    activeTab === tab.key
                                                        ? 'bg-[#C8962E] text-white'
                                                        : 'hover:bg-muted text-muted-foreground'
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="px-0 pb-0 pt-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Produit
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Quantité
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Source
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredData.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-12 text-center text-muted-foreground"
                                                    >
                                                        Aucun mouvement trouvé
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredData.map((mv, idx) => (
                                                    <motion.tr
                                                        key={mv.id}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.025 }}
                                                        className="hover:bg-muted/40 transition-colors"
                                                    >
                                                        <td className="px-6 py-3.5">
                                                            {mv.type === 'entree' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                                                    <ArrowUp className="w-3 h-3" />
                                                                    Entrée
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                                                                    <ArrowDown className="w-3 h-3" />
                                                                    Sortie
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3.5 font-medium">
                                                            {mv.produit?.nom ?? (
                                                                <span className="text-muted-foreground italic">
                                                                    Produit inconnu
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <span
                                                                className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg text-sm font-black tabular-nums ${
                                                                    mv.type === 'entree'
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-red-600 dark:text-red-400'
                                                                }`}
                                                            >
                                                                {mv.type === 'entree' ? '+' : '-'}
                                                                {fmtNum(mv.quantite)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <SourceBadge source={mv.source} />
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right text-xs text-muted-foreground font-mono">
                                                            {mv.created_at
                                                                ? new Date(mv.created_at).toLocaleDateString(
                                                                      'fr-FR',
                                                                  )
                                                                : '—'}
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Info row */}
                                <div className="px-6 py-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground">
                                        {filteredData.length} mouvement
                                        {filteredData.length !== 1 ? 's' : ''} affiché
                                        {filteredData.length !== 1 ? 's' : ''} sur{' '}
                                        {fmtNum(mouvements.total)} au total
                                        {activeTab !== 'tous' && (
                                            <span className="ml-1 text-[#C8962E] font-semibold">
                                                (filtre : {activeTab})
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </>
    );
}

MouvementsIndex.layout = {
    breadcrumbs: [{ title: 'Mouvements', href: '/dashboard/mouvements' }],
};
