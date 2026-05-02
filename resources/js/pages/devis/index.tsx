import { Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    FileText, Clock, CheckCircle, Eye, Trash2, ChevronDown,
    Mail, Phone, Calendar, MessageSquare, Building2, HardHat,
    Package, Snowflake, Truck, Filter, Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Heading from '@/components/heading';

interface Devi {
    id: number;
    service: string;
    nom: string;
    email: string;
    telephone: string | null;
    delai: string | null;
    message: string | null;
    statut: 'nouveau' | 'vu' | 'traite';
    created_at: string;
}

interface Stats {
    total: number;
    nouveau: number;
    vu: number;
    traite: number;
}

interface Props {
    devis: Devi[];
    stats: Stats;
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
    charpente: HardHat,
    transport: Truck,
    froid: Snowflake,
    batiment: Building2,
    logistique: Package,
};

const SERVICE_LABELS: Record<string, string> = {
    charpente: 'Charpente Métallique',
    transport: 'Transport Routier',
    froid: 'Froid Industriel',
    batiment: 'Bâtiment & Construction',
    logistique: 'Logistique & Stockage',
};

const STATUT_CONFIG = {
    nouveau: { label: 'Nouveau', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300', dot: 'bg-blue-500' },
    vu: { label: 'Vu', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300', dot: 'bg-amber-500' },
    traite: { label: 'Traité', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300', dot: 'bg-emerald-500' },
};

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
    return (
        <motion.div whileHover={{ y: -2 }} className={`rounded-2xl p-5 border ${color}`}>
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 opacity-70" />
                <span className="text-3xl font-black">{value}</span>
            </div>
            <p className="text-sm font-medium opacity-70">{label}</p>
        </motion.div>
    );
}

export default function DevisIndex({ devis, stats }: Props) {
    const [search, setSearch] = useState('');
    const [filterStatut, setFilterStatut] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [deleting, setDeleting] = useState<number | null>(null);

    const filtered = devis.filter((d) => {
        const matchSearch =
            d.nom.toLowerCase().includes(search.toLowerCase()) ||
            d.email.toLowerCase().includes(search.toLowerCase()) ||
            SERVICE_LABELS[d.service]?.toLowerCase().includes(search.toLowerCase());
        const matchStatut = !filterStatut || d.statut === filterStatut;
        return matchSearch && matchStatut;
    });

    const updateStatut = (id: number, statut: string) => {
        router.patch(`/devis/${id}`, { statut }, { preserveScroll: true });
    };

    const handleDelete = (id: number) => {
        setDeleting(id);
        router.delete(`/devis/${id}`, {
            onFinish: () => setDeleting(null),
            preserveScroll: true,
        });
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <Head title="Demandes de devis" />

            <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#C8962E] to-[#E8B84B]">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <Heading title="Demandes de devis" description="Gérez et suivez les demandes reçues depuis le site" />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <StatCard label="Total" value={stats.total} icon={FileText} color="bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-white" />
                    <StatCard label="Nouveaux" value={stats.nouveau} icon={Clock} color="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300" />
                    <StatCard label="Vus" value={stats.vu} icon={Eye} color="bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300" />
                    <StatCard label="Traités" value={stats.traite} icon={CheckCircle} color="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300" />
                </motion.div>

                {/* Table card */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="border-0 shadow-xl bg-white dark:bg-gray-900/80">
                        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-[#C8962E]" />
                                    {filtered.length} demande{filtered.length !== 1 ? 's' : ''}
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Rechercher..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-9 w-48"
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        {([null, 'nouveau', 'vu', 'traite'] as const).map((s) => (
                                            <button
                                                key={s ?? 'all'}
                                                onClick={() => setFilterStatut(s)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                    filterStatut === s
                                                        ? 'bg-[#C8962E] text-white'
                                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                            >
                                                {s === null ? 'Tous' : STATUT_CONFIG[s].label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <FileText className="w-12 h-12 text-muted-foreground/30 mb-3" />
                                    <p className="text-muted-foreground">Aucune demande trouvée</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {filtered.map((devi, i) => {
                                        const ServiceIcon = SERVICE_ICONS[devi.service] ?? FileText;
                                        const statut = STATUT_CONFIG[devi.statut];
                                        const isExpanded = expanded === devi.id;

                                        return (
                                            <motion.div
                                                key={devi.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="group"
                                            >
                                                {/* Row */}
                                                <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                                                    {/* Service icon */}
                                                    <div className="w-10 h-10 rounded-xl bg-[#C8962E]/10 flex items-center justify-center flex-shrink-0">
                                                        <ServiceIcon className="w-5 h-5 text-[#C8962E]" />
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-sm">{devi.nom}</span>
                                                            <span className="text-xs text-muted-foreground">— {SERVICE_LABELS[devi.service] ?? devi.service}</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-0.5">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                <Mail className="w-3 h-3" />{devi.email}
                                                            </span>
                                                            {devi.telephone && (
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Phone className="w-3 h-3" />{devi.telephone}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Date */}
                                                    <span className="text-xs text-muted-foreground hidden lg:block whitespace-nowrap">
                                                        {formatDate(devi.created_at)}
                                                    </span>

                                                    {/* Statut badge + select */}
                                                    <div className="flex items-center gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statut.className}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${statut.dot}`} />
                                                            {statut.label}
                                                        </span>
                                                        <select
                                                            value={devi.statut}
                                                            onChange={(e) => updateStatut(devi.id, e.target.value)}
                                                            className="text-xs border rounded-lg px-2 py-1 bg-background focus:outline-none focus:border-[#C8962E] cursor-pointer"
                                                        >
                                                            <option value="nouveau">Nouveau</option>
                                                            <option value="vu">Vu</option>
                                                            <option value="traite">Traité</option>
                                                        </select>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => setExpanded(isExpanded ? null : devi.id)}
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                                                        >
                                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                                            </motion.div>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(devi.id)}
                                                            disabled={deleting === devi.id}
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded detail */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="px-5 pb-5 pt-2 bg-muted/20 border-t border-border/50">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                    {devi.delai && (
                                                                        <div className="flex items-start gap-2">
                                                                            <Calendar className="w-4 h-4 text-[#C8962E] mt-0.5 flex-shrink-0" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground font-medium">Délai souhaité</p>
                                                                                <p className="text-sm font-semibold">{devi.delai}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {devi.message && (
                                                                        <div className="flex items-start gap-2 sm:col-span-2">
                                                                            <MessageSquare className="w-4 h-4 text-[#C8962E] mt-0.5 flex-shrink-0" />
                                                                            <div>
                                                                                <p className="text-xs text-muted-foreground font-medium">Message</p>
                                                                                <p className="text-sm leading-relaxed">{devi.message}</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2 mt-4">
                                                                    <a
                                                                        href={`mailto:${devi.email}`}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8962E] text-white text-xs font-semibold hover:bg-[#b8841e] transition-colors"
                                                                    >
                                                                        <Mail className="w-3.5 h-3.5" />
                                                                        Répondre par email
                                                                    </a>
                                                                    {devi.telephone && (
                                                                        <a
                                                                            href={`tel:${devi.telephone}`}
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
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </>
    );
}
