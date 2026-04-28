import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, ShoppingCart } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import type { SalesChart as SalesChartType } from '@/types';

interface Props { salesChart: SalesChartType }

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const shortNum = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);

function SalesTooltip({ active, payload, label, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
            <p className="text-xs text-zinc-500 mb-2 font-mono">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{p.name}</span>
                    <span className="font-black text-xs ml-auto pl-4" style={{ color: p.color }}>{fmtGnf(p.value)}</span>
                </div>
            ))}
        </div>
    );
}

function OrderTooltip({ active, payload, label, isDark }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
            <p className="text-xs text-zinc-500 mb-1 font-mono">{label}</p>
            <p className="font-black text-sky-400">{payload[0].value} commandes</p>
        </div>
    );
}

export function SalesChart({ salesChart }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const [tab, setTab] = useState<'revenue' | 'split' | 'volume'>('revenue');

    const gridColor  = isDark ? '#27272a' : '#e5e7eb';
    const tickColor  = isDark ? '#71717a' : '#6b7280';

    const chartData = salesChart.labels.map((label, i) => ({
        date:    label.slice(5),
        total:   salesChart.data[i],
        online:  salesChart.data_online[i],
        pos:     salesChart.data_pos[i],
        orders:  salesChart.order_counts[i],
    }));

    const totalRevenue = salesChart.data.reduce((a, b) => a + b, 0);
    const totalOnline  = salesChart.data_online.reduce((a, b) => a + b, 0);
    const totalPos     = salesChart.data_pos.reduce((a, b) => a + b, 0);

    const axisProps = {
        axisLine: false as any,
        tickLine: false as any,
        tick: { fill: tickColor, fontSize: 11 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="rounded-2xl overflow-hidden">
                <CardHeader className="pb-0 px-6 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                            <CardTitle className="font-black text-lg tracking-tight flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Ventes — 30 derniers jours
                            </CardTitle>
                            <CardDescription className="mt-1 flex flex-wrap gap-4">
                                <span>
                                    Total :{' '}
                                    <span className="text-emerald-400 font-bold">{fmtGnf(totalRevenue)}</span>
                                </span>
                                <span>
                                    En ligne :{' '}
                                    <span className="text-sky-400 font-bold">{fmtGnf(totalOnline)}</span>
                                </span>
                                <span>
                                    Sur place :{' '}
                                    <span className="text-violet-400 font-bold">{fmtGnf(totalPos)}</span>
                                </span>
                            </CardDescription>
                        </div>

                        {/* Tab switcher */}
                        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
                                <TabsList className="h-8 text-xs">
                                <TabsTrigger value="revenue" className="text-xs px-3">Total</TabsTrigger>
                                <TabsTrigger value="split" className="text-xs px-3">En ligne / Sur place</TabsTrigger>
                                <TabsTrigger value="volume" className="text-xs px-3">Volume</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 px-2 pb-4">
                    <ResponsiveContainer width="100%" height={260}>
                        {tab === 'revenue' ? (
                            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="date" {...axisProps} interval={4} style={{ fontFamily: 'monospace' }} />
                                <YAxis {...axisProps} tickFormatter={shortNum} />
                                <Tooltip content={(p) => <SalesTooltip {...p} isDark={isDark} />}
                                    cursor={{ stroke: '#34d399', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="total" name="Ventes" stroke="#34d399" strokeWidth={2.5}
                                    fill="url(#gTotal)" dot={false}
                                    activeDot={{ r: 5, fill: '#34d399', stroke: isDark ? '#18181b' : '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        ) : tab === 'split' ? (
                            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gOnline" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gPos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="date" {...axisProps} interval={4} style={{ fontFamily: 'monospace' }} />
                                <YAxis {...axisProps} tickFormatter={shortNum} />
                                <Tooltip content={(p) => <SalesTooltip {...p} isDark={isDark} />}
                                    cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                                <Area type="monotone" dataKey="online" name="En ligne" stroke="#38bdf8" strokeWidth={2}
                                    fill="url(#gOnline)" dot={false}
                                    activeDot={{ r: 4, fill: '#38bdf8', stroke: isDark ? '#18181b' : '#fff', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="pos" name="Sur place" stroke="#a78bfa" strokeWidth={2}
                                    fill="url(#gPos)" dot={false}
                                    activeDot={{ r: 4, fill: '#a78bfa', stroke: isDark ? '#18181b' : '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        ) : (
                            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={10}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="date" {...axisProps} interval={4} style={{ fontFamily: 'monospace' }} />
                                <YAxis {...axisProps} allowDecimals={false} />
                                <Tooltip content={(p) => <OrderTooltip {...p} isDark={isDark} />}
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
                                <Bar dataKey="orders" name="Commandes" fill="#38bdf8" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}