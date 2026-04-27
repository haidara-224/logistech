import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    TrendingUp, ShoppingCart, Package,
    AlertTriangle, Activity,
} from 'lucide-react';
import { dashboard } from '@/routes';

import { MetricCard } from './components/MetricCard';
import { SalesChart } from './components/SalesChart';
import { TopProductsChart } from './components/TopProductsChart';
import { LowStockTable } from './components/LowStockTable';
import { ExportButton } from './components/ExportButton';
import { DashboardProps } from './types';

const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'GNF',
        maximumFractionDigits: 0,
    }).format(n);

export default function Dashboard({ metrics, sales_chart, low_stock, top_products }: DashboardProps) {
    const props: DashboardProps = { metrics, sales_chart, low_stock, top_products };

    return (
        <>
            <Head title="Dashboard" />

            {/* Dark full-page background */}
            <div className="min-h-full bg-zinc-950 text-zinc-100">
                <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">

                    {/* ── Header ───────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-start justify-between"
                    >
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                    Live
                                </span>
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-white">
                                Vue d'ensemble
                            </h1>
                            <p className="text-sm text-zinc-500 mt-0.5">
                                {new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <ExportButton data={props} />
                    </motion.div>

                    {/* ── Metric Cards ─────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                        <MetricCard
                            title="Ventes — 30 jours"
                            value={fmt(metrics.total_sales_30d)}
                            icon={TrendingUp}
                            variant="success"
                            subtitle="Commandes payées uniquement"
                            trend={{ value: 12, label: 'vs mois précédent' }}
                            delay={0}
                        />
                        <MetricCard
                            title="Commandes — 30 jours"
                            value={metrics.orders_30d}
                            icon={ShoppingCart}
                            variant="info"
                            subtitle="Toutes commandes confondues"
                            delay={0.07}
                        />
                        <MetricCard
                            title="Commandes Aujourd'hui"
                            value={metrics.orders_today}
                            icon={Activity}
                            variant="default"
                            subtitle="Mises à jour en temps réel"
                            delay={0.14}
                        />
                        <MetricCard
                            title="Stock Critique"
                            value={metrics.low_stock_count}
                            icon={AlertTriangle}
                            variant={metrics.low_stock_count > 0 ? 'warning' : 'default'}
                            subtitle={
                                metrics.low_stock_count > 0
                                    ? 'Produits sous le seuil'
                                    : 'Aucune alerte active'
                            }
                            delay={0.21}
                        />
                    </div>

                    {/* ── Sales Chart (full width) ──────────────────────────── */}
                    <SalesChart salesChart={sales_chart} />

                    {/* ── Bottom row: Top Products + Low Stock ─────────────── */}
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                        <div className="xl:col-span-2">
                            <TopProductsChart topProducts={top_products} />
                        </div>
                        <div className="xl:col-span-3">
                            <LowStockTable lowStock={low_stock} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};