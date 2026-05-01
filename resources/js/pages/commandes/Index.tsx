import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    ShoppingCart,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    Globe,
    Store,
    TrendingUp,
    BadgeCheck,
    ListFilter,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Commande } from '@/types/models';
import { MetricCard } from '@/components/Dashboard/MetricCard';

interface Props {
    commandes: {
        data: Commande[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: typeof CheckCircle }> = {
    en_attente: {
        label: 'En attente',
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        dot: 'bg-amber-400',
        icon: Clock,
    },
    payer: {
        label: 'Payée',
        color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        icon: CheckCircle,
    },
    livree: {
        label: 'Livrée',
        color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
        dot: 'bg-sky-500',
        icon: Truck,
    },
    annulee: {
        label: 'Annulée',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        dot: 'bg-red-500',
        icon: XCircle,
    },
};

const borderByStatus: Record<string, string> = {
    en_attente: 'border-l-amber-400',
    payer: 'border-l-emerald-500',
    livree: 'border-l-sky-500',
    annulee: 'border-l-red-500',
};

const filterOptions = [
    { key: 'all', label: 'Toutes' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'payer', label: 'Payées' },
    { key: 'livree', label: 'Livrées' },
    { key: 'annulee', label: 'Annulées' },
] as const;

type FilterKey = (typeof filterOptions)[number]['key'];

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

export default function CommandesIndex({ commandes }: Props) {
    const { flash } = usePage().props as any;
    const [deleteTarget, setDeleteTarget] = useState<Commande | null>(null);
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDelete = () => {
        if (!deleteTarget) { return; }
        router.delete(`/commandes/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handlePage = (page: number) => {
        router.get('/commandes', { page }, { preserveState: true });
    };

    // Stats computed locally from paginated data + total from server
    const enAttenteCount = commandes.data.filter((c) => c.status === 'en_attente').length;
    const payeesCount = commandes.data.filter((c) => c.status === 'payer' || c.status === 'livree').length;
    const caTotal = commandes.data.reduce((sum, c) => sum + (c.montant_total ?? 0), 0);

    const filtered =
        activeFilter === 'all'
            ? commandes.data
            : commandes.data.filter((c) => c.status === activeFilter);

    return (
        <>
            <Head title="Commandes" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] bg-clip-text text-transparent">
                                Commandes
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {commandes.total} commande{commandes.total !== 1 ? 's' : ''} au total
                            </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/commandes/creer"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Nouvelle commande
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <MetricCard
                            title="Total commandes"
                            value={fmt(commandes.total)}
                            icon={ShoppingCart}
                            variant="default"
                            delay={0}
                        />
                        <MetricCard
                            title="En attente"
                            value={enAttenteCount}
                            subtitle="Sur cette page"
                            icon={Clock}
                            variant="warning"
                            delay={0.07}
                        />
                        <MetricCard
                            title="Payées / Livrées"
                            value={payeesCount}
                            subtitle="Sur cette page"
                            icon={BadgeCheck}
                            variant="success"
                            delay={0.14}
                        />
                        <MetricCard
                            title="CA affiché"
                            value={`${fmt(caTotal)} GNF`}
                            subtitle="Page actuelle"
                            icon={TrendingUp}
                            variant="info"
                            delay={0.21}
                        />
                    </div>

                    {/* Filter Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mb-5 flex items-center gap-2 flex-wrap"
                    >
                        <ListFilter className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {filterOptions.map((opt) => (
                            <button
                                key={opt.key}
                                onClick={() => setActiveFilter(opt.key)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                                    activeFilter === opt.key
                                        ? 'bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white shadow-md'
                                        : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:border-[#C8962E]/40 hover:text-[#C8962E]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
                    >
                        {filtered.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                    <ShoppingCart className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    {activeFilter === 'all' ? 'Aucune commande' : 'Aucune commande dans ce filtre'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {activeFilter === 'all' ? 'Créez votre première commande' : 'Essayez un autre filtre'}
                                </p>
                                {activeFilter === 'all' && (
                                    <Link
                                        href="/commandes/creer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Nouvelle commande
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                                            <th className="pl-6 pr-3 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Client
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                                                Articles
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                                                Source
                                            </th>
                                            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-4 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                        <AnimatePresence>
                                            {filtered.map((cmd, idx) => {
                                                const cfg =
                                                    statusConfig[cmd.status ?? 'en_attente'] ??
                                                    statusConfig.en_attente;
                                                const StatusIcon = cfg.icon;
                                                const borderColor =
                                                    borderByStatus[cmd.status ?? 'en_attente'] ??
                                                    'border-l-gray-300';
                                                return (
                                                    <motion.tr
                                                        key={cmd.id}
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ delay: idx * 0.04 }}
                                                        className={`border-l-4 ${borderColor} hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors`}
                                                    >
                                                        {/* ID */}
                                                        <td className="pl-5 pr-3 py-4">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-mono font-semibold text-gray-600 dark:text-gray-400">
                                                                #{cmd.id}
                                                            </span>
                                                        </td>

                                                        {/* Client */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C8962E] to-[#E8B84B] flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                                                    {(cmd.client?.nom ?? 'C').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {cmd.client?.nom} {cmd.client?.prenom}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                                        {cmd.created_at
                                                                            ? new Date(cmd.created_at).toLocaleDateString('fr-FR')
                                                                            : '—'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Articles */}
                                                        <td className="px-4 py-4 hidden md:table-cell">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                {cmd.items?.length ?? 0}{' '}
                                                                article{(cmd.items?.length ?? 0) !== 1 ? 's' : ''}
                                                            </span>
                                                        </td>

                                                        {/* Source */}
                                                        <td className="px-4 py-4 hidden sm:table-cell">
                                                            {cmd.source === 'online' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                                                    <Globe className="h-3 w-3" />
                                                                    En ligne
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400">
                                                                    <Store className="h-3 w-3" />
                                                                    POS
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* Status */}
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
                                                            >
                                                                <StatusIcon className="h-3 w-3" />
                                                                {cfg.label}
                                                            </span>
                                                        </td>

                                                        {/* Total */}
                                                        <td className="px-4 py-4 text-right">
                                                            <span className="font-bold text-gray-900 dark:text-white text-sm tabular-nums">
                                                                {cmd.montant_total != null
                                                                    ? `${fmt(cmd.montant_total)} GNF`
                                                                    : '—'}
                                                            </span>
                                                        </td>

                                                        {/* Actions */}
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`/commandes/${cmd.id}`}
                                                                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                                                    title="Voir"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                                <button
                                                                    onClick={() => setDeleteTarget(cmd)}
                                                                    className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {commandes.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(commandes.current_page - 1) * commandes.per_page + 1}–
                                {Math.min(commandes.current_page * commandes.per_page, commandes.total)} sur{' '}
                                {commandes.total}
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePage(commandes.current_page - 1)}
                                    disabled={commandes.current_page === 1}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: commandes.last_page }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePage(p)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            commandes.current_page === p
                                                ? 'bg-[#C8962E] text-white'
                                                : 'border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePage(commandes.current_page + 1)}
                                    disabled={commandes.current_page === commandes.last_page}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            <Dialog.Root open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl z-50 p-6">
                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Supprimer la commande
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                Supprimer la commande{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    #{deleteTarget?.id}
                                </span>{' '}
                                ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}

CommandesIndex.layout = {
    breadcrumbs: [{ title: 'Commandes', href: '/commandes' }],
};
