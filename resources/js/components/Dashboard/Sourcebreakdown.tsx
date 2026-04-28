import { motion } from 'framer-motion';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Monitor } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import type { SourceBreakdown as SourceBreakdownType } from '@/types';

interface Props {
    sourceBreakdown: SourceBreakdownType;
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

export function SourceBreakdown({ sourceBreakdown }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const online = sourceBreakdown['online'] ?? { total: 0, count: 0 };
    const pos    = sourceBreakdown['pos']    ?? { total: 0, count: 0 };
    const grand  = online.total + pos.total || 1;

    const onlinePct = Math.round((online.total / grand) * 100);
    const posPct    = 100 - onlinePct;

    const sources = [
        { key: 'online', label: 'En ligne',        icon: Globe,   color: '#38bdf8', data: online, pct: onlinePct },
        { key: 'pos',    label: 'Sur place',       icon: Monitor, color: '#a78bfa', data: pos,    pct: posPct    },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="rounded-2xl overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-3">
                    <CardTitle className="font-black text-lg tracking-tight">
                        Répartition par source
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Online vs Point de vente — 30 jours</p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                    <div className="grid grid-cols-2 gap-4">
                        {sources.map(({ key, label, icon: Icon, color, data, pct }) => (
                            <div
                                key={key}
                                className={`rounded-xl p-4 border ${isDark ? 'bg-zinc-800/50 border-zinc-700/60' : 'bg-gray-50 border-gray-100'}`}
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: color + '20' }}>
                                        <Icon className="w-3.5 h-3.5" style={{ color }} />
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground">{label}</span>
                                </div>

                                {/* Progress bar */}
                                <div className={`w-full h-1.5 rounded-full mb-3 ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                                    <motion.div
                                        className="h-1.5 rounded-full"
                                        style={{ backgroundColor: color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                                    />
                                </div>

                                <p className="text-2xl font-black tabular-nums" style={{ color }}>
                                    {pct}%
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {fmtGnf(data.total)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {data.count} commandes
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Combined bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                            <span>En ligne</span>
                            <span>Sur place</span>
                        </div>
                        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                            <motion.div
                                className="h-full rounded-l-full"
                                style={{ backgroundColor: '#38bdf8' }}
                                initial={{ flex: 0 }}
                                animate={{ flex: onlinePct }}
                                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                            />
                            <motion.div
                                className="h-full rounded-r-full"
                                style={{ backgroundColor: '#a78bfa' }}
                                initial={{ flex: 0 }}
                                animate={{ flex: posPct }}
                                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}