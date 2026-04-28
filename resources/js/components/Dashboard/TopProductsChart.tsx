import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { TopProduct } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';

interface Props { 
    topProducts: TopProduct[];
    topProductsDay?: TopProduct[];
    topProductsWeek?: TopProduct[];
    topProductsMonth?: TopProduct[];
}

const COLORS = ['#f59e0b', '#a78bfa', '#38bdf8', '#34d399', '#f87171'];

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);
const shortNum = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

function CustomTooltip({ active, payload, mode, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{payload[0].payload.nomFull}</p>
            <p className="font-black" style={{ color: payload[0].fill }}>
                {mode === 'qty' ? `${payload[0].value} unités` : fmtGnf(payload[0].value)}
            </p>
        </div>
    );
}

export function TopProductsChart({ topProducts, topProductsDay, topProductsWeek, topProductsMonth }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const [mode, setMode] = useState<'qty' | 'revenue'>('qty');
    const [period, setPeriod] = useState<'week' | 'day' | 'month' | '30d'>('30d');

    const activeList = period === 'day' ? (topProductsDay ?? topProducts) : period === 'week' ? (topProductsWeek ?? topProducts) : period === 'month' ? (topProductsMonth ?? topProducts) : topProducts;

    const chartData = activeList.map((p) => ({
        nom:     p.nom?.length > 13 ? p.nom.slice(0, 13) + '…' : p.nom,
        nomFull: p.nom,
        sku:     p.sku,
        qty:     p.qty,
        revenue: p.revenue,
    }));

    const gridColor = isDark ? '#27272a' : '#e5e7eb';
    const tickColor = isDark ? '#71717a' : '#6b7280';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="rounded-2xl overflow-hidden h-full">
                <CardHeader className="pb-0 px-6 pt-6">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <CardTitle className="font-black text-lg tracking-tight flex items-center gap-2">
                                <Star className="w-5 h-5 text-amber-400" />
                                Top 5 Produits
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">Classé par {mode === 'qty' ? 'quantité' : 'chiffre d\'affaires'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
                                <TabsList className="h-7 text-xs">
                                    <TabsTrigger value="qty"     className="text-xs px-2.5">Quantité</TabsTrigger>
                                    <TabsTrigger value="revenue" className="text-xs px-2.5">CA</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="ml-3">
                                <div className="inline-flex rounded-lg border overflow-hidden text-xs font-semibold">
                                    <button onClick={() => setPeriod('day')} className={`px-2 py-1 ${period === 'day' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Jour</button>
                                    <button onClick={() => setPeriod('week')} className={`px-2 py-1 ${period === 'week' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Semaine</button>
                                    <button onClick={() => setPeriod('month')} className={`px-2 py-1 ${period === 'month' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>Mois</button>
                                    <button onClick={() => setPeriod('30d')} className={`px-2 py-1 ${period === '30d' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>30j</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 px-2 pb-4">
                    <ResponsiveContainer width="100%" height={190}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={26}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal vertical={false} />
                            <XAxis dataKey="nom" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false}
                                tickFormatter={mode === 'revenue' ? shortNum : undefined} />
                            <Tooltip content={(p) => <CustomTooltip {...p} mode={mode} isDark={isDark} />}
                                cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }} />
                            <Bar dataKey={mode} radius={[6, 6, 0, 0]}>
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={isDark ? 0.85 : 0.92} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Ranking list */}
                    <div className="mt-3 space-y-1.5 px-4">
                        {topProducts.map((p, i) => (
                            <motion.div
                                key={p.produit_id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 + i * 0.06 }}
                                className="flex items-center gap-3"
                            >
                                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0"
                                    style={{ backgroundColor: COLORS[i] + '25', color: COLORS[i] }}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold truncate">{p.nom}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{p.sku}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-black tabular-nums" style={{ color: COLORS[i] }}>
                                        {mode === 'qty' ? `${p.qty} u.` : fmtGnf(p.revenue)}
                                    </p>
                                    {mode === 'qty' && (
                                        <p className="text-[10px] text-muted-foreground">{fmtGnf(p.revenue)}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}