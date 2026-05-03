import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingCart,
    BarChart2,
    CreditCard,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import { MetricCard } from '@/components/Dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import type { Commande } from '@/types/models';

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'GNF',
        maximumFractionDigits: 0,
    }).format(n);

const fmtNum = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

const shortNum = (v: number) =>
    v >= 1_000_000
        ? `${(v / 1_000_000).toFixed(1)}M`
        : v >= 1_000
          ? `${(v / 1_000).toFixed(0)}k`
          : String(v);

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
    commandes: {
        data: Commande[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        ca_total: number;
        ca_mois: number;
        nb_ventes: number;
        panier_moyen: number;
    };
    chart: { date: string; ca: number; nb: number }[];
    topProduits: { nom: string; total_vendu: number; ca: number }[];
}

// ─── Custom Tooltips ─────────────────────────────────────────────────────────

function CaTooltip({ active, payload, label, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
        >
            <p className="text-xs text-zinc-500 mb-2 font-mono">{label}</p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8962E] inline-block" />
                <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>CA</span>
                <span className="font-black text-xs ml-auto pl-4 text-[#C8962E]">
                    {fmtGnf(payload[0]?.value ?? 0)}
                </span>
            </div>
        </div>
    );
}

function TopProduitTooltip({ active, payload, label, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div
            className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
        >
            <p className={`text-xs mb-2 font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{label}</p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8962E] inline-block" />
                <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>CA</span>
                <span className="font-black text-xs ml-auto pl-4 text-[#C8962E]">
                    {fmtGnf(payload[0]?.value ?? 0)}
                </span>
            </div>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string | null }) {
    if (status === 'payer') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Payée
            </span>
        );
    }
    if (status === 'livree') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block" />
                Livrée
            </span>
        );
    }
    if (status === 'en_attente') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                En attente
            </span>
        );
    }
    if (status === 'annulee') {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                Annulée
            </span>
        );
    }
    return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
            {status ?? '—'}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VentesIndex({ commandes, stats, chart, topProduits }: Props) {
    const { flash } = usePage().props as any;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

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

    // Shorten bar chart labels
    const topProduitsChart = topProduits.map((p) => ({
        ...p,
        label: p.nom.length > 14 ? p.nom.slice(0, 13) + '…' : p.nom,
    }));

    const handlePage = (page: number) => {
        router.get('/dashboard/ventes', { page }, { preserveState: true });
    };

    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        const current = commandes.current_page;
        const last = commandes.last_page;
        if (last <= 7) {
            for (let i = 1; i <= last; i++) pages.push(i);
        } else if (current <= 3) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(last);
        } else if (current >= last - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = last - 4; i <= last; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = current - 1; i <= current + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(last);
        }
        return pages;
    };

    return (
        <>
            <Head title="Ventes & Chiffre d'affaires" />

            <div className="min-h-full">
                <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">

                    {/* ── Hero Header ─────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl"
                    >
                        {/* Gold radial glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#C8962E22_0%,_transparent_70%)] pointer-events-none" />
                        {/* Subtle grid pattern */}
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
                                        Ventes
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                    Ventes &amp; Chiffre d'affaires
                                </h1>
                                <p className="mt-1.5 text-sm text-zinc-400">
                                    Suivez vos performances commerciales et analysez vos revenus
                                </p>
                            </div>

                            <div className="flex-shrink-0 rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-right backdrop-blur-sm">
                                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">
                                    CA Total
                                </p>
                                <p className="text-3xl font-black text-[#E8B84B] tabular-nums">
                                    {fmtGnf(stats.ca_total)}
                                </p>
                                <p className="text-xs text-zinc-500 mt-1">Toutes périodes confondues</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Metric Cards ─────────────────────────────────── */}
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                        <MetricCard
                            title="CA Total"
                            value={fmtGnf(stats.ca_total)}
                            icon={TrendingUp}
                            variant="success"
                            subtitle="Toutes périodes"
                            delay={0}
                        />
                        <MetricCard
                            title="CA ce mois"
                            value={fmtGnf(stats.ca_mois)}
                            icon={CreditCard}
                            variant="success"
                            subtitle="Mois en cours"
                            delay={0.1}
                        />
                        <MetricCard
                            title="Nb de ventes"
                            value={fmtNum(stats.nb_ventes)}
                            icon={ShoppingCart}
                            variant="info"
                            subtitle="Commandes payées"
                            delay={0.2}
                        />
                        <MetricCard
                            title="Panier moyen"
                            value={fmtGnf(stats.panier_moyen)}
                            icon={BarChart2}
                            variant="default"
                            subtitle="Par commande"
                            delay={0.3}
                        />
                    </div>

                    {/* ── Charts Row ───────────────────────────────────── */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {/* Area Chart — CA evolution */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Card className="rounded-2xl overflow-hidden">
                                <CardHeader className="pb-0 px-6 pt-5">
                                    <CardTitle className="font-black text-base tracking-tight flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#C8962E]" />
                                        Évolution du CA (30 derniers jours)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 px-2 pb-4">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <AreaChart
                                            data={chart}
                                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                        >
                                            <defs>
                                                <linearGradient id="gCa" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#C8962E" stopOpacity={0.3} />
                                                    <stop offset="100%" stopColor="#C8962E" stopOpacity={0} />
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
                                                content={(p) => <CaTooltip {...p} isDark={isDark} />}
                                                cursor={{
                                                    stroke: '#C8962E',
                                                    strokeWidth: 1,
                                                    strokeDasharray: '4 4',
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="ca"
                                                name="CA"
                                                stroke="#C8962E"
                                                strokeWidth={2.5}
                                                fill="url(#gCa)"
                                                dot={false}
                                                activeDot={{
                                                    r: 5,
                                                    fill: '#C8962E',
                                                    stroke: isDark ? '#18181b' : '#fff',
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Bar Chart — Top produits */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Card className="rounded-2xl overflow-hidden">
                                <CardHeader className="pb-0 px-6 pt-5">
                                    <CardTitle className="font-black text-base tracking-tight flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4 text-[#C8962E]" />
                                        Top produits — CA généré
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 px-2 pb-4">
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart
                                            data={topProduitsChart}
                                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                            barSize={20}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke={gridColor}
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="label"
                                                {...axisProps}
                                                interval={0}
                                                tick={{ fill: tickColor, fontSize: 10 }}
                                                angle={-20}
                                                textAnchor="end"
                                                height={42}
                                            />
                                            <YAxis {...axisProps} tickFormatter={shortNum} />
                                            <Tooltip
                                                content={(p) => <TopProduitTooltip {...p} isDark={isDark} />}
                                                cursor={{
                                                    fill: isDark
                                                        ? 'rgba(255,255,255,0.04)'
                                                        : 'rgba(0,0,0,0.04)',
                                                }}
                                            />
                                            <Bar
                                                dataKey="ca"
                                                name="CA"
                                                fill="#C8962E"
                                                radius={[4, 4, 0, 0]}
                                                fillOpacity={0.85}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>

                    {/* ── Commandes Table ──────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Card className="rounded-2xl overflow-hidden">
                            <CardHeader className="pb-4 px-6 pt-5">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-black text-base tracking-tight flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4 text-[#C8962E]" />
                                        Commandes
                                    </CardTitle>
                                    <span className="text-xs text-muted-foreground">
                                        {fmtNum(commandes.total)} au total
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Client
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Articles
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Montant
                                                </th>
                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Statut
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {commandes.data.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="px-6 py-12 text-center text-muted-foreground"
                                                    >
                                                        Aucune commande trouvée
                                                    </td>
                                                </tr>
                                            ) : (
                                                commandes.data.map((cmd, idx) => (
                                                    <motion.tr
                                                        key={cmd.id}
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        className="hover:bg-muted/40 transition-colors"
                                                    >
                                                        <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
                                                            #{cmd.id}
                                                        </td>
                                                        <td className="px-6 py-3.5">
                                                            <div className="font-semibold text-sm">
                                                                {cmd.client
                                                                    ? `${cmd.client.nom}${cmd.client.prenom ? ' ' + cmd.client.prenom : ''}`
                                                                    : '—'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-xs font-bold">
                                                                {cmd.items?.length ?? 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right font-bold tabular-nums text-[#C8962E]">
                                                            {fmtGnf(cmd.montant_total ?? 0)}
                                                        </td>
                                                        <td className="px-6 py-3.5 text-center">
                                                            <StatusBadge status={cmd.status} />
                                                        </td>
                                                        <td className="px-6 py-3.5 text-right text-xs text-muted-foreground font-mono">
                                                            {cmd.created_at
                                                                ? new Date(cmd.created_at).toLocaleDateString('fr-FR')
                                                                : '—'}
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {commandes.last_page > 1 && (
                                    <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
                                        <p className="text-xs text-muted-foreground">
                                            {(commandes.current_page - 1) * commandes.per_page + 1}–
                                            {Math.min(
                                                commandes.current_page * commandes.per_page,
                                                commandes.total,
                                            )}{' '}
                                            sur {fmtNum(commandes.total)}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handlePage(commandes.current_page - 1)}
                                                disabled={commandes.current_page === 1}
                                                className="p-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            {getPageNumbers().map((page, idx) =>
                                                page === '...' ? (
                                                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">
                                                        …
                                                    </span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePage(page as number)}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                            commandes.current_page === page
                                                                ? 'bg-[#C8962E] text-white shadow-sm'
                                                                : 'border border-border hover:bg-muted'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ),
                                            )}
                                            <button
                                                onClick={() => handlePage(commandes.current_page + 1)}
                                                disabled={commandes.current_page === commandes.last_page}
                                                className="p-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </>
    );
}

VentesIndex.layout = {
    breadcrumbs: [{ title: 'Ventes', href: '/dashboard/ventes' }],
};
