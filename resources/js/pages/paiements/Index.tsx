import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Banknote,
    Smartphone,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Clock,
    XCircle,
    DollarSign,
    BarChart3,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { toast } from 'sonner';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import type { Paiement } from '@/types/models';

interface ChartEntry {
    date: string;
    total: number;
    nb: number;
}

interface Stats {
    total_encaisse: number;
    ca_mois: number;
    especes: number;
    mobile_money: number;
    carte: number;
    nb_paiements: number;
}

interface Props {
    paiements: {
        data: Paiement[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
    chart: ChartEntry[];
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'GNF',
        maximumFractionDigits: 0,
    }).format(n);

const fmtShort = (n: number) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);

const modeConfig: Record<string, { label: string; color: string; icon: typeof CreditCard }> = {
    espece: {
        label: 'Espèces',
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        icon: Banknote,
    },
    mobile_money: {
        label: 'Mobile Money',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
        icon: Smartphone,
    },
    carte_bancaire: {
        label: 'Carte bancaire',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        icon: CreditCard,
    },
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    en_attente: {
        label: 'En attente',
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
        icon: Clock,
    },
    effectue: {
        label: 'Effectué',
        color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        icon: CheckCircle,
    },
    annule: {
        label: 'Annulé',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        icon: XCircle,
    },
};

const PIE_COLORS = ['#C8962E', '#22c55e', '#3b82f6'];

const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-4 py-3 shadow-xl text-sm">
            <p className="font-semibold text-gray-700 dark:text-zinc-200 mb-1">{label}</p>
            <p className="text-[#C8962E] font-bold">{fmtGnf(payload[0].value)}</p>
            {payload[1] && (
                <p className="text-gray-500 dark:text-zinc-400 text-xs mt-0.5">{payload[1].value} paiement(s)</p>
            )}
        </div>
    );
};

const CustomPieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 px-4 py-3 shadow-xl text-sm">
            <p className="font-semibold text-gray-700 dark:text-zinc-200">{payload[0].name}</p>
            <p className="font-bold" style={{ color: payload[0].payload.fill }}>{fmtGnf(payload[0].value)}</p>
        </div>
    );
};

export default function PaiementsIndex({ paiements, stats, chart }: Props) {
    const { flash } = usePage().props as any;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handlePage = (page: number) => {
        router.get('/paiements', { page }, { preserveState: true });
    };

    const enAttenteCount = paiements.data.filter((p) => p.status === 'en_attente').length;

    const pieData = [
        { name: 'Espèces', value: stats.especes },
        { name: 'Mobile Money', value: stats.mobile_money },
        { name: 'Carte', value: stats.carte },
    ];
    const pieTotal = pieData.reduce((s, d) => s + d.value, 0);

    const axisColor = isDark ? '#71717a' : '#9ca3af';
    const gridColor = isDark ? '#27272a' : '#f3f4f6';

    const containerVariants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <>
            <Head title="Paiements" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                    {/* ── Hero Header ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1209] via-[#2d1f08] to-[#0f0a03] dark:from-[#0d0903] dark:via-[#1c1205] dark:to-[#080500] border border-[#C8962E]/20 shadow-2xl px-8 py-10"
                    >
                        {/* Decorative glow */}
                        <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#C8962E]/10 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E8B84B]/5 blur-2xl" />

                        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#C8962E]/20 border border-[#C8962E]/30 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-[#C8962E]" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#E8B84B]/70">
                                        Gestion financière
                                    </span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight text-white mb-1">
                                    Paiements
                                </h1>
                                <p className="text-sm text-[#E8B84B]/60">
                                    {paiements.total} paiement{paiements.total !== 1 ? 's' : ''} enregistré{paiements.total !== 1 ? 's' : ''}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#E8B84B]/60 mb-1">
                                    Total encaissé
                                </p>
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="text-3xl sm:text-4xl font-black tabular-nums text-[#E8B84B]"
                                >
                                    {fmtGnf(stats.total_encaisse)}
                                </motion.p>
                                <p className="text-xs text-[#C8962E]/70 mt-1">Toutes périodes confondues</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Metric Cards ─────────────────────────────────── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        <motion.div variants={itemVariants}>
                            <MetricCard
                                title="Total encaissé"
                                value={fmtGnf(stats.total_encaisse)}
                                subtitle="Cumul global"
                                icon={DollarSign}
                                variant="success"
                                delay={0}
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <MetricCard
                                title="Ce mois"
                                value={fmtGnf(stats.ca_mois)}
                                subtitle="Mois en cours"
                                icon={TrendingUp}
                                variant="info"
                                delay={0.07}
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <MetricCard
                                title="Nb paiements"
                                value={stats.nb_paiements}
                                subtitle="Total enregistrés"
                                icon={BarChart3}
                                variant="default"
                                delay={0.14}
                            />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <MetricCard
                                title="En attente"
                                value={enAttenteCount}
                                subtitle="Sur cette page"
                                icon={Clock}
                                variant={enAttenteCount > 0 ? 'warning' : 'default'}
                                delay={0.21}
                            />
                        </motion.div>
                    </motion.div>

                    {/* ── Charts Row ───────────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Area Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Card className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-[#C8962E]" />
                                        Encaissements (30 jours)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <ResponsiveContainer width="100%" height={220}>
                                        <AreaChart data={chart} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#C8962E" stopOpacity={0.25} />
                                                    <stop offset="95%" stopColor="#C8962E" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 11, fill: axisColor }}
                                                tickLine={false}
                                                axisLine={false}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: axisColor }}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(v) => `${fmtShort(v / 1000)}k`}
                                                width={48}
                                            />
                                            <ReTooltip content={<CustomAreaTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="total"
                                                stroke="#C8962E"
                                                strokeWidth={2.5}
                                                fill="url(#goldGradient)"
                                                dot={false}
                                                activeDot={{ r: 5, fill: '#C8962E', stroke: '#fff', strokeWidth: 2 }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Pie Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.38, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Card className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#C8962E]" />
                                        Répartition par mode
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={52}
                                                outerRadius={80}
                                                paddingAngle={3}
                                                dataKey="value"
                                                label={({ name, value }) =>
                                                    pieTotal > 0
                                                        ? `${name} ${Math.round((value / pieTotal) * 100)}%`
                                                        : name
                                                }
                                                labelLine={false}
                                            >
                                                {pieData.map((_, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <ReTooltip content={<CustomPieTooltip />} />
                                            <Legend
                                                formatter={(value) => (
                                                    <span className="text-xs text-gray-600 dark:text-zinc-400">
                                                        {value}
                                                    </span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* ── Table ────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
                    >
                        {paiements.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <CreditCard className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    Aucun paiement
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Les paiements apparaîtront ici une fois enregistrés.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Commande
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Montant
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">
                                                Mode
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        <AnimatePresence>
                                            {paiements.data.map((paiement, idx) => {
                                                const modeCfg =
                                                    modeConfig[paiement.mode_paiement ?? ''] ??
                                                    modeConfig['espece'];
                                                const ModeIcon = modeCfg.icon;
                                                const statusCfg =
                                                    statusConfig[paiement.status ?? 'en_attente'] ??
                                                    statusConfig['en_attente'];
                                                const StatusIcon = statusCfg.icon;
                                                return (
                                                    <motion.tr
                                                        key={paiement.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <Link
                                                                href={`/commandes/${paiement.commande_id}`}
                                                                className="font-mono text-sm text-[#C8962E] hover:text-[#E8B84B] font-semibold transition-colors"
                                                            >
                                                                #{paiement.commande_id}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {paiement.commande?.client
                                                                    ? `${paiement.commande.client.nom}${paiement.commande.client.prenom ? ' ' + paiement.commande.client.prenom : ''}`
                                                                    : '—'}
                                                            </p>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                                {fmtGnf(paiement.montant)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${modeCfg.color}`}
                                                            >
                                                                <ModeIcon className="h-3 w-3" />
                                                                {modeCfg.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}
                                                            >
                                                                <StatusIcon className="h-3 w-3" />
                                                                {statusCfg.label}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 hidden lg:table-cell text-sm text-gray-500 dark:text-zinc-400">
                                                            {paiement.date_paiement
                                                                ? new Date(paiement.date_paiement).toLocaleDateString(
                                                                      'fr-FR',
                                                                  )
                                                                : '—'}
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* ── Pagination ───────────────────────────────────── */}
                    {paiements.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-zinc-400">
                                {(paiements.current_page - 1) * paiements.per_page + 1}–
                                {Math.min(paiements.current_page * paiements.per_page, paiements.total)} sur{' '}
                                {paiements.total}
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePage(paiements.current_page - 1)}
                                    disabled={paiements.current_page === 1}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: paiements.last_page }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePage(p)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            paiements.current_page === p
                                                ? 'bg-[#C8962E] text-white'
                                                : 'border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePage(paiements.current_page + 1)}
                                    disabled={paiements.current_page === paiements.last_page}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

PaiementsIndex.layout = {
    breadcrumbs: [{ title: 'Paiements', href: '/paiements' }],
};
