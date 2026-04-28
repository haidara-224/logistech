import { motion } from 'framer-motion';
import { AlertTriangle, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { LowStockItem } from '@/types';


interface Props {
    lowStock: LowStockItem[];
}

function StockBadge({ reel, minimal, isDark }: { reel: number; minimal: number; isDark?: boolean }) {
    if (reel === 0) {
        return (
            <Badge className={`${isDark ? 'bg-red-600 text-white border-red-700' : 'bg-red-50 text-red-700 border-red-100'} font-bold text-xs`}>Rupture</Badge>
        );
    }
    const ratio = minimal > 0 ? reel / minimal : 1;
    if (ratio <= 0.5) {
        return (
            <Badge className={`${isDark ? 'bg-orange-700 text-white border-orange-800' : 'bg-orange-50 text-orange-700 border-orange-100'} font-bold text-xs`}>Critique</Badge>
        );
    }
    return (
        <Badge className={`${isDark ? 'bg-amber-700 text-white border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-100'} font-bold text-xs`}>Faible</Badge>
    );
}

export function LowStockTable({ lowStock }: Props) {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <Card className={`rounded-2xl overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
                    <CardHeader className="px-6 pt-6 pb-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className={`${isDark ? 'text-zinc-100' : 'text-slate-900'} font-black text-lg tracking-tight flex items-center gap-2`}>
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            Stock Critique
                        </CardTitle>
                        {lowStock.length > 0 && (
                            <span className={isDark ? 'text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800/40 rounded-full px-2.5 py-0.5' : 'text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5'}>
                                {lowStock.length} produit{lowStock.length > 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                    <p className={isDark ? 'text-xs text-zinc-500 mt-1' : 'text-xs text-muted-foreground mt-1'}>Produits sous le seuil minimal</p>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                    {lowStock.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <Package className={`w-8 h-8 ${isDark ? 'text-zinc-700' : 'text-gray-400'}`} />
                            <p className={isDark ? 'text-sm text-zinc-500 font-medium' : 'text-sm text-gray-600 font-medium'}>Tous les stocks sont OK</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-zinc-800 hover:bg-transparent">
                                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider pl-6">
                                        Produit
                                    </TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                                        SKU
                                    </TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider text-right">
                                        Stock réel
                                    </TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider text-right">
                                        Minimum
                                    </TableHead>
                                    <TableHead className="text-zinc-500 text-xs font-bold uppercase tracking-wider text-right pr-6">
                                        Statut
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lowStock.map((item, i) => (
                                    <motion.tr
                                        key={item.id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.45 + i * 0.06 }}
                                        className="border-zinc-800/60 hover:bg-zinc-800/40 transition-colors group"
                                    >
                                        <TableCell className="pl-6 py-3">
                                            <span className={`text-sm font-semibold ${isDark ? 'text-zinc-200 dark:group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'} transition-colors`}>
                                                {item.nom}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                                                {item.sku}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`text-sm font-black tabular-nums ${item.stock_reel === 0 ? (isDark ? 'text-red-400' : 'text-red-600') : (isDark ? 'text-orange-400' : 'text-orange-600')}`}>
                                                {item.stock_reel}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-sm text-zinc-500 tabular-nums">
                                                {item.stock_minimal}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <StockBadge reel={item.stock_reel} minimal={item.stock_minimal} isDark={isDark} />
                                        </TableCell>
                                    </motion.tr>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}