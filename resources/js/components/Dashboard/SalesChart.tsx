import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { SalesChart as SalesChartType } from '../types';

interface Props {
    salesChart: SalesChartType;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const value: number = payload[0].value;
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-xs text-zinc-400 mb-1">{label}</p>
            <p className="text-lg font-black text-emerald-400">
                {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'GNF',
                    maximumFractionDigits: 0,
                }).format(value)}
            </p>
        </div>
    );
};

export function SalesChart({ salesChart }: Props) {
    const chartData = salesChart.labels.map((label, i) => ({
        date: label.slice(5), // MM-DD
        total: salesChart.data[i],
    }));

    const maxVal = Math.max(...salesChart.data);
    const totalRevenue = salesChart.data.reduce((a, b) => a + b, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden">
                <CardHeader className="pb-0 px-6 pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-zinc-100 font-black text-lg tracking-tight flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Ventes — 30 derniers jours
                            </CardTitle>
                            <CardDescription className="text-zinc-500 mt-1">
                                Revenu total :{' '}
                                <span className="text-emerald-400 font-bold">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'GNF',
                                        maximumFractionDigits: 0,
                                    }).format(totalRevenue)}
                                </span>
                            </CardDescription>
                        </div>
                        <div className="bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-3 py-1.5">
                            <span className="text-xs font-bold text-emerald-400">
                                Peak : {new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(maxVal)} GNF
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 px-2 pb-4">
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#52525b', fontSize: 11, fontFamily: 'monospace' }}
                                axisLine={false}
                                tickLine={false}
                                interval={4}
                            />
                            <YAxis
                                tick={{ fill: '#52525b', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) =>
                                    v >= 1_000_000
                                        ? `${(v / 1_000_000).toFixed(1)}M`
                                        : v >= 1000
                                        ? `${(v / 1000).toFixed(0)}k`
                                        : v
                                }
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#34d399', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#34d399"
                                strokeWidth={2.5}
                                fill="url(#salesGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: '#34d399', stroke: '#18181b', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </motion.div>
    );
}