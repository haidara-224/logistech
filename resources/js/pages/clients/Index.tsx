import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, Eye, Pencil, Trash2, Phone, Mail, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Client } from '@/types/models';

interface Props {
    clients: {
        data: Client[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters?: { search?: string };
}

export default function ClientsIndex({ clients, filters }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters?.search) {
                router.get('/dashboard/clients', { search }, { preserveState: true, replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = () => {
        if (!deleteTarget) { return; }
        router.delete(`/dashboard/clients/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const handlePage = (page: number) => {
        router.get('/dashboard/clients', { page, search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Clients" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] bg-clip-text text-transparent">
                                    Clients
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {clients.total} client{clients.total !== 1 ? 's' : ''} enregistré{clients.total !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href="/dashboard/clients/creer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    Nouveau client
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, email, téléphone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 pl-11 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                            />
                        </div>
                    </motion.div>

                    {/* Table */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm"
                    >
                        {clients.data.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <Users className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    {search ? 'Aucun résultat' : 'Aucun client'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {search ? 'Essayez avec un autre terme' : 'Ajoutez votre premier client'}
                                </p>
                                {!search && (
                                    <Link href="/dashboard/clients/creer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                                        <Plus className="h-4 w-4" />
                                        Ajouter un client
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Localisation</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    <AnimatePresence>
                                        {clients.data.map((client, idx) => (
                                            <motion.tr
                                                key={client.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.03 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C8962E] to-[#E8B84B] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                            {client.nom.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {client.nom} {client.prenom}
                                                            </p>
                                                            {client.piece && (
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">Pièce: {client.piece}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="space-y-1">
                                                        {client.telephone && (
                                                            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                                <Phone className="h-3.5 w-3.5" />
                                                                {client.telephone}
                                                            </p>
                                                        )}
                                                        {client.email && (
                                                            <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                                <Mail className="h-3.5 w-3.5" />
                                                                {client.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden lg:table-cell">
                                                    {client.quartier && (
                                                        <p className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {client.quartier}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/dashboard/clients/${client.id}`}
                                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/dashboard/clients/${client.id}/modifier`}
                                                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => setDeleteTarget(client)}
                                                            className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {clients.last_page > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(clients.current_page - 1) * clients.per_page + 1}–{Math.min(clients.current_page * clients.per_page, clients.total)} sur {clients.total}
                            </p>
                            <div className="flex gap-1">
                                <button onClick={() => handlePage(clients.current_page - 1)} disabled={clients.current_page === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                {Array.from({ length: clients.last_page }, (_, i) => i + 1).map((p) => (
                                    <button key={p} onClick={() => handlePage(p)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${clients.current_page === p ? 'bg-[#C8962E] text-white' : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                        {p}
                                    </button>
                                ))}
                                <button onClick={() => handlePage(clients.current_page + 1)} disabled={clients.current_page === clients.last_page} className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-6">
                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Supprimer le client</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                Supprimer <span className="font-semibold text-gray-900 dark:text-white">"{deleteTarget?.nom} {deleteTarget?.prenom}"</span> ? Cette action est irréversible.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Annuler
                                </button>
                                <button onClick={handleDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors">
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

ClientsIndex.layout = {
    breadcrumbs: [{ title: 'Clients', href: '/dashboard/clients' }],
};
