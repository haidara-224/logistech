import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, Trash2, ChevronDown, MessageSquare, Eye, EyeOff, Search, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Heading from '@/components/heading';

interface ContactMsg {
    id: number;
    nom: string;
    email: string;
    telephone: string | null;
    message: string;
    lu: boolean;
    created_at: string;
}

interface Stats {
    total: number;
    non_lus: number;
    lus: number;
}

interface Props {
    contacts: ContactMsg[];
    stats: Stats;
}

export default function ContactIndex({ contacts, stats }: Props) {
    const [search, setSearch] = useState('');
    const [filterLu, setFilterLu] = useState<boolean | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);

    const filtered = contacts.filter((c) => {
        const matchSearch =
            c.nom.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase());
        const matchLu = filterLu === null || c.lu === filterLu;
        return matchSearch && matchLu;
    });

    const handleExpand = (id: number, lu: boolean) => {
        setExpanded((prev) => (prev === id ? null : id));
        if (!lu) {
            router.patch(`/dashboard/contact/${id}/read`, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/dashboard/contact/${id}`, { preserveScroll: true });
    };

    const fmt = (d: string) =>
        new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <Head title="Messages de contact" />

            <div className="px-6 py-6 space-y-6">
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <Heading title="Messages de contact" description="Messages reçus depuis le formulaire de contact du site" />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4"
                >
                    {[
                        { label: 'Total', value: stats.total, color: 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-white' },
                        { label: 'Non lus', value: stats.non_lus, color: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300' },
                        { label: 'Lus', value: stats.lus, color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
                    ].map((s) => (
                        <motion.div key={s.label} whileHover={{ y: -2 }} className={`rounded-2xl p-5 border ${s.color}`}>
                            <p className="text-3xl font-black mb-1">{s.value}</p>
                            <p className="text-sm font-medium opacity-70">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900/80">
                        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-blue-500" />
                                    {filtered.length} message{filtered.length !== 1 ? 's' : ''}
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-44" />
                                    </div>
                                    <div className="flex gap-1">
                                        {([null, false, true] as const).map((v) => (
                                            <button
                                                key={String(v)}
                                                onClick={() => setFilterLu(v)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterLu === v ? 'bg-blue-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                                            >
                                                {v === null ? 'Tous' : v ? 'Lus' : 'Non lus'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Mail className="w-12 h-12 text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">Aucun message trouvé</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filtered.map((c, i) => (
                                        <motion.div
                                            key={c.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                        >
                                            <div
                                                className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${!c.lu ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
                                                onClick={() => handleExpand(c.id, c.lu)}
                                            >
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${c.lu ? 'bg-transparent' : 'bg-blue-500'}`} />
                                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 flex items-center justify-center shrink-0">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{c.nom[0].toUpperCase()}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm ${!c.lu ? 'font-bold' : 'font-medium'}`}>{c.nom}</span>
                                                        {!c.lu && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-0 text-[10px] px-1.5 py-0">Nouveau</Badge>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground truncate">{c.message}</p>
                                                </div>
                                                <span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap">{fmt(c.created_at)}</span>
                                                <div className="flex items-center gap-1">
                                                    <motion.div animate={{ rotate: expanded === c.id ? 180 : 0 }}>
                                                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                    </motion.div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {expanded === c.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="px-5 pb-5 pt-3 bg-muted/20 border-t border-border/50 space-y-4">
                                                            <div className="flex flex-wrap gap-4 text-sm">
                                                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                                                    <Mail className="w-3.5 h-3.5" />{c.email}
                                                                </span>
                                                                {c.telephone && (
                                                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                                                        <Phone className="w-3.5 h-3.5" />{c.telephone}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm leading-relaxed whitespace-pre-line">{c.message}</p>
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={`mailto:${c.email}?subject=Re: Votre message`}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                                                                >
                                                                    <Mail className="w-3.5 h-3.5" />
                                                                    Répondre
                                                                </a>
                                                                {c.telephone && (
                                                                    <a
                                                                        href={`tel:${c.telephone}`}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                                                                    >
                                                                        <Phone className="w-3.5 h-3.5" />
                                                                        Appeler
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
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
