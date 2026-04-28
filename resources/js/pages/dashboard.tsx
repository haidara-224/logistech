import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Package, AlertTriangle, Activity, Wallet, ShoppingBag } from 'lucide-react';
import { dashboard } from '@/routes';
import type { DashboardProps } from '@/types';

import { MetricCard }        from '@/components/Dashboard/MetricCard';
import { SalesChart }        from '@/components/Dashboard/SalesChart';
import { TopProductsChart }  from '@/components/Dashboard/TopProductsChart';
import { LowStockTable }     from '@/components/Dashboard/LowStockTable';

import { ExportButton }      from '@/components/Dashboard/ExportButton';
import { StatusPieChart } from '@/components/Dashboard/Statuspiechart';
import { SourceBreakdown } from '@/components/Dashboard/Sourcebreakdown';
import { RecentOrdersTable } from '@/components/Dashboard/Recentorderstable';

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

export default function Dashboard({
    metrics, sales_chart, low_stock, top_products, top_products_day, top_products_week, top_products_month,
    status_counts, source_breakdown, recent_orders, filters,
}: DashboardProps) {
    const props: DashboardProps = { metrics, sales_chart, low_stock, top_products, top_products_day, top_products_week, top_products_month, status_counts, source_breakdown, recent_orders, filters };

    const initialSource = filters?.source ?? 'all';
    const [source, setSource] = useState<string>(initialSource);

    function applySource(next: string) {
        setSource(next);
        const payload: Record<string, any> = {};
        if (next !== 'all') payload.source = next;
        router.get(dashboard(), payload, { preserveState: true, replace: true });
    }

    const currentSource = source === 'all' ? null : source;

    return (
        <>
            <Head title="Dashboard" />

            <div className="min-h-full">
                <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">

                    {/* ── Header ───────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    Live
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight">Vue d'ensemble</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Source filter */}
                            <div className="flex items-center rounded-lg border overflow-hidden text-xs font-semibold">
                                {(['all', 'online', 'pos'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => applySource(s)}
                                        className={`px-3 py-1.5 transition-colors ${
                                            source === s
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        {s === 'all' ? 'Tout' : s === 'online' ? 'En ligne' : 'Sur place'}
                                    </button>
                                ))}
                            </div>
                            <ExportButton data={props} />
                        </div>
                    </motion.div>

                    {/* ── Row 1 : 6 metric cards ───────────────────── */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                        <MetricCard title="Ventes 30j" value={fmtGnf(metrics.total_sales_30d)}
                            icon={TrendingUp} variant="success"
                            subtitle={source === 'all' ? 'Toutes sources' : source === 'pos' ? 'Ventes sur place' : 'En ligne'}
                            trend={{ value: 12, label: 'vs mois préc.' }} delay={0} />
                        <MetricCard title="Ventes Aujourd'hui" value={fmtGnf(metrics.sales_today)}
                            icon={ShoppingBag} variant="info" subtitle="Journée en cours" delay={0.06} />

                        <MetricCard title="Commandes 30j" value={metrics.orders_30d}
                            icon={ShoppingCart} variant="default" subtitle="Toutes commandes" delay={0.18} />
                        <MetricCard title="Panier Moyen" value={fmtGnf(metrics.avg_basket)}
                            icon={Activity} variant="default" subtitle="30 derniers jours" delay={0.24} />
                        <MetricCard title="Stock Critique" value={metrics.low_stock_count}
                            icon={AlertTriangle}
                            variant={metrics.low_stock_count > 0 ? 'warning' : 'default'}
                            subtitle={metrics.low_stock_count > 0 ? 'Produits sous seuil' : 'Aucune alerte'} delay={0.30} />
                    </div>

                    {/* ── Row 2 : Sales chart (large) ──────────────── */}
                    <SalesChart salesChart={sales_chart} />

                    {/* ── Row 3 : Pie + Source breakdown ───────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {status_counts && Object.keys(status_counts).length > 0 && (
                            <StatusPieChart statusCounts={status_counts} />
                        )}
                        {source_breakdown && Object.keys(source_breakdown).length > 0 && (
                            <SourceBreakdown sourceBreakdown={source_breakdown} />
                        )}
                    </div>

                    {/* ── Row 4 : Top products + Low stock ─────────── */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                        <div className="xl:col-span-2">
                            <TopProductsChart topProducts={top_products} topProductsDay={top_products_day} topProductsWeek={top_products_week} topProductsMonth={top_products_month} />
                        </div>
                        <div className="xl:col-span-3">
                            <LowStockTable lowStock={low_stock} />
                        </div>
                    </div>

                    {/* ── Row 5 : Recent orders with pagination ────── */}
                    {recent_orders && (
                        <RecentOrdersTable recentOrders={recent_orders} source={currentSource} />
                    )}

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};