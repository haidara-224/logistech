import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Package } from 'lucide-react';
import { TopProduct } from '../types';

interface Props {
    topProducts: TopProduct[];
}

const COLORS = ['#f59e0b', '#a78bfa', '#38bdf8', '#34d399', '#f87171'];

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
            <p className="text-xs text-zinc-400 mb-1">{payload[0].payload.nom}</p>
            <p className="text-base font-black text-amber-400">{payload[0].value} unités</p>
        </div>
    );
};

export function TopProductsChart({ topProducts }: Props) {
    const chartData = topProducts.map((p) => ({
        nom: p.nom?.length > 14 ? p.nom.slice(0, 14) + '…' : p.nom,
        nomFull: p.nom,
        sku: p.sku,
        qty: p.qty,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="bg-zinc-900 border-zinc-800 rounded-2xl overflow-hidden h-full">
                <CardHeader className="pb-0 px-6 pt-6">
                    <CardTitle className="text-zinc-100 font-black text-lg tracking-tight flex items-center gap-2">
                        <Star className="w-5 h-5 text-amber-400" />
                        Top 5 Produits
                    </CardTitle>
                    <p className="text-xs text-zinc-500 mt-1">Classé par quantité vendue</p>
                </CardHeader>
                <CardContent className="pt-4 px-2 pb-4">
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }} barSize={28}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal vertical={false} />
                            <XAxis
                                dataKey="nom"
                                tick={{ fill: '#71717a', fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#52525b', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="qty" radius={[6, 6, 0, 0]}>
                                {chartData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    {/* Ranking list */}
                    <div className="mt-4 space-y-2 px-4">
                        {topProducts.map((p, i) => (
                            <motion.div
                                key={p.produit_id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.07 }}
                                className="flex items-center gap-3"
                            >
                                <span
                                    className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black"
                                    style={{ backgroundColor: COLORS[i] + '30', color: COLORS[i] }}
                                >
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-zinc-300 truncate">{p.nom}</p>
                                    <p className="text-[10px] text-zinc-600 font-mono">{p.sku}</p>
                                </div>
                                <span className="text-xs font-black tabular-nums" style={{ color: COLORS[i] }}>
                                    {p.qty} u.
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}