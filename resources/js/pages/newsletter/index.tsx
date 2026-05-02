import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Rss, Trash2, Search, Mail, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';

interface Abonne {
    id: number;
    email: string;
    created_at: string;
}

interface Props {
    abonnes: Abonne[];
    total: number;
}

export default function NewsletterIndex({ abonnes, total }: Props) {
    const [search, setSearch] = useState('');

    const filtered = abonnes.filter((a) =>
        a.email.toLowerCase().includes(search.toLowerCase()),
    );

    const handleDelete = (id: number) => {
        router.delete(`/newsletter/${id}`, { preserveScroll: true });
    };

    const exportCsv = () => {
        const csv = ['Email,Date inscription', ...abonnes.map((a) => `${a.email},${new Date(a.created_at).toLocaleDateString('fr-FR')}`)].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `newsletter_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const fmt = (d: string) =>
        new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
        <>
            <Head title="Newsletter — Abonnés" />

            <div className="px-6 py-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-purple-500 to-pink-500">
                            <Rss className="w-5 h-5 text-white" />
                        </div>
                        <Heading title="Newsletter" description="Liste des abonnés à la newsletter" />
                    </div>
                </motion.div>

                {/* Stat card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    <div className="rounded-2xl p-5 border bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300">
                        <p className="text-4xl font-black mb-1">{total}</p>
                        <p className="text-sm font-medium opacity-70">Abonnés au total</p>
                    </div>
                    <div className="rounded-2xl p-5 border bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-white">
                        <p className="text-4xl font-black mb-1">
                            {abonnes.filter((a) => {
                                const diff = Date.now() - new Date(a.created_at).getTime();
                                return diff < 7 * 24 * 60 * 60 * 1000;
                            }).length}
                        </p>
                        <p className="text-sm font-medium opacity-70">Cette semaine</p>
                    </div>
                    <div className="rounded-2xl p-5 border bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-white">
                        <p className="text-4xl font-black mb-1">
                            {abonnes.filter((a) => {
                                const diff = Date.now() - new Date(a.created_at).getTime();
                                return diff < 30 * 24 * 60 * 60 * 1000;
                            }).length}
                        </p>
                        <p className="text-sm font-medium opacity-70">Ce mois-ci</p>
                    </div>
                </motion.div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900/80">
                        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Rss className="w-5 h-5 text-purple-500" />
                                    {filtered.length} abonné{filtered.length !== 1 ? 's' : ''}
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 w-44"
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={exportCsv}
                                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Exporter CSV
                                    </motion.button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Rss className="w-12 h-12 text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">Aucun abonné trouvé</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filtered.map((a, i) => (
                                        <motion.div
                                            key={a.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                                                <Mail className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <span className="flex-1 text-sm font-medium">{a.email}</span>
                                            <span className="text-xs text-muted-foreground hidden sm:block">{fmt(a.created_at)}</span>
                                            <button
                                                onClick={() => handleDelete(a.id)}
                                                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
