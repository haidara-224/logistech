import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

interface Props {
    statusCounts: Record<string, number>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    en_attente: { label: 'En attente', color: '#f59e0b' },
    payer:      { label: 'Payé',       color: '#34d399' },
    livree:     { label: 'Livré',      color: '#38bdf8' },
    annulee:    { label: 'Annulé',     color: '#f87171' },
};

function fallbackColor(i: number) {
    const pool = ['#a78bfa', '#fb923c', '#e879f9', '#4ade80'];
    return pool[i % pool.length];
}

function CustomTooltip({ active, payload, isDark }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
        <div className={`rounded-xl px-4 py-3 shadow-2xl border text-sm ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}>
            <p className="font-bold" style={{ color: item.payload.color }}>{item.name}</p>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{item.value} commandes</p>
            <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {((item.value / item.payload.total) * 100).toFixed(1)} %
            </p>
        </div>
    );
}

export function StatusPieChart({ statusCounts }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    const pieData = Object.entries(statusCounts).map(([key, val], i) => ({
        name:  STATUS_CONFIG[key]?.label ?? key,
        value: val,
        color: STATUS_CONFIG[key]?.color ?? fallbackColor(i),
        total,
    }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
        >
            <Card className="rounded-2xl overflow-hidden h-full">
                <CardHeader className="px-6 pt-6 pb-0">
                    <CardTitle className="font-black text-lg tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-violet-400" />
                        Statuts des commandes
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{total} commandes au total</p>
                </CardHeader>
                <CardContent className="pt-2 pb-4">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={82}
                                paddingAngle={3}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {pieData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} stroke="transparent" />
                                ))}
                            </Pie>
                            <Tooltip content={(p) => <CustomTooltip {...p} isDark={isDark} />} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Stat pills */}
                    <div className="grid grid-cols-2 gap-2 mt-1 px-1">
                        {pieData.map((item) => (
                            <div
                                key={item.name}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? 'bg-zinc-800/60' : 'bg-gray-50'}`}
                            >
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <div className="min-w-0">
                                    <p className="text-[10px] text-muted-foreground truncate">{item.name}</p>
                                    <p className="text-sm font-black" style={{ color: item.color }}>{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}