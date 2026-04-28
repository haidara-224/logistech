import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; label: string };
    variant?: 'default' | 'warning' | 'success' | 'info';
    delay?: number;
}

const variantStyles = {
    default: {
        bg: 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800',
        icon: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300',
        accent: 'text-slate-900 dark:text-zinc-100',
        glow: '',
    },
    warning: {
        bg: 'bg-amber-50 border-amber-100 dark:bg-amber-950/60 dark:border-amber-800/40',
        icon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400',
        accent: 'text-amber-700 dark:text-amber-300',
        glow: 'shadow-amber-50',
    },
    success: {
        bg: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800/40',
        icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400',
        accent: 'text-emerald-700 dark:text-emerald-300',
        glow: 'shadow-emerald-50',
    },
    info: {
        bg: 'bg-sky-50 border-sky-100 dark:bg-sky-950/60 dark:border-sky-800/40',
        icon: 'bg-sky-100 text-sky-700 dark:bg-sky-900/60 dark:text-sky-400',
        accent: 'text-sky-700 dark:text-sky-300',
        glow: 'shadow-sky-50',
    },
};

export function MetricCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
    delay = 0,
}: MetricCardProps) {
    const styles = variantStyles[variant];
    const isPositiveTrend = trend && trend.value >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card
                className={cn(
                    'border rounded-2xl shadow-lg overflow-hidden relative',
                    styles.bg,
                    styles.glow && `shadow-lg ${styles.glow}`,
                )}
            >
                {/* Subtle top gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                                {title}
                            </p>
                            <motion.p
                                className={cn('text-3xl font-black tabular-nums leading-none', styles.accent)}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: delay + 0.1 }}
                            >
                                {value}
                            </motion.p>
                            {subtitle && (
                                <p className="mt-2 text-xs text-zinc-500">{subtitle}</p>
                            )}
                        </div>

                        <div className={cn('rounded-xl p-3 shrink-0', styles.icon)}>
                            <Icon className="w-5 h-5" strokeWidth={1.8} />
                        </div>
                    </div>

                    {trend && (
                        <div className="mt-4 flex items-center gap-1.5">
                            <span
                                className={cn(
                                    'flex items-center gap-0.5 text-xs font-bold',
                                    isPositiveTrend ? 'text-emerald-400' : 'text-red-400',
                                )}
                            >
                                {isPositiveTrend ? (
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                ) : (
                                    <ArrowDownRight className="w-3.5 h-3.5" />
                                )}
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-zinc-600">{trend.label}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}