import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ExternalLink, Globe, Monitor, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useAppearance } from '@/hooks/use-appearance';
import { dashboard } from '@/routes';
import type { PaginatedData, RecentOrder } from '@/types';

interface Props {
    recentOrders: PaginatedData<RecentOrder>;
    source: string | null;
}

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
    en_attente: { label: 'En attente', cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/40' },
    payer:      { label: 'Payé',       cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/40' },
    livree:     { label: 'Livré',      cls: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-400 dark:border-sky-800/40' },
    annulee:    { label: 'Annulé',     cls: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800/40' },
};

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

function SourceIcon({ src }: { src: string | null }) {
    if (src === 'online') return <Globe className="w-3 h-3 text-sky-400" />;
    if (src === 'pos')    return <Monitor className="w-3 h-3 text-violet-400" />;
    return <Clock className="w-3 h-3 text-zinc-500" />;
}

export function RecentOrdersTable({ recentOrders, source }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const [navigating, setNavigating] = useState(false);

    const [pageData, setPageData] = useState(recentOrders);

    async function goTo(page: number, perPage?: number) {
        setNavigating(true);
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('per_page', String(perPage ?? pageData.per_page ?? 10));
        if (source) params.set('source', source);

        try {
            const res = await fetch(`/dashboard/recent-orders?${params.toString()}`, { headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error('Network error');
            const json = await res.json();
            setPageData(json);
        } catch (e) {
            // fallback: do nothing (could notify)
            console.error(e);
        } finally {
            setNavigating(false);
        }
    }

    const { data, current_page, last_page, per_page, total, from, to } = pageData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className="rounded-2xl overflow-hidden">
                <CardHeader className="px-6 pt-6 pb-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <CardTitle className="font-black text-lg tracking-tight flex items-center gap-2">
                                Commandes récentes
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {from ?? 0}–{to ?? 0} sur {total} commandes
                            </p>
                        </div>

                        {/* Per-page selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Lignes :</span>
                            <Select
                                value={String(per_page)}
                                onValueChange={(v) => goTo(1, Number(v))}
                            >
                                <SelectTrigger className="h-7 w-16 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50].map((n) => (
                                        <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0 mt-3">
                    <div className={`relative transition-opacity duration-200 ${navigating ? 'opacity-40 pointer-events-none' : ''}`}>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b">
                                    <TableHead className="text-xs font-bold uppercase tracking-wider pl-6 w-12">#</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">Client</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">Statut</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider">Source</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-right">Montant</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-wider text-right pr-6">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="wait">
                                    {data.map((order, i) => {
                                        const st = STATUS_STYLE[order.status] ?? { label: order.status, cls: '' };
                                        return (
                                            <motion.tr
                                                key={order.id}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-b last:border-0 hover:bg-muted/40 transition-colors group"
                                            >
                                                <TableCell className="pl-6 py-3">
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        #{order.id}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-semibold">{order.client || '—'}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`text-xs font-bold border ${st.cls}`}>
                                                        {st.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <SourceIcon src={order.source} />
                                                        <span className="text-xs text-muted-foreground capitalize">
                                                            {order.source === 'online' ? 'En ligne' : order.source === 'pos' ? 'Sur place' : '—'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="text-sm font-black tabular-nums">
                                                        {fmtGnf(order.montant)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        {order.created_at}
                                                    </span>
                                                </TableCell>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination controls */}
                    <div className="flex items-center justify-between px-6 py-3 border-t">
                        <span className="text-xs text-muted-foreground">
                            Page {current_page} / {last_page}
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={current_page <= 1 || navigating}
                                onClick={() => goTo(current_page - 1)}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {/* Page number pills */}
                            {Array.from({ length: last_page }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === last_page || Math.abs(p - current_page) <= 1)
                                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                                        acc.push('...');
                                    }
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === '...' ? (
                                        <span key={`ellipsis-${i}`} className="text-xs text-muted-foreground px-1">…</span>
                                    ) : (
                                        <Button
                                            key={p}
                                            variant={p === current_page ? 'default' : 'ghost'}
                                            size="icon"
                                            className="h-7 w-7 text-xs"
                                            disabled={navigating}
                                            onClick={() => goTo(p as number)}
                                        >
                                            {p}
                                        </Button>
                                    )
                                )}

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={current_page >= last_page || navigating}
                                onClick={() => goTo(current_page + 1)}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}