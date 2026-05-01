import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderGit2, Package, Search, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Categorie } from '@/types/models';

interface CategorieWithCount extends Categorie {
    produits_count: number;
}

interface Props {
    categories: {
        data: CategorieWithCount[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

function CategorieForm({
    categorie,
    onClose,
}: {
    categorie?: CategorieWithCount | null;
    onClose: () => void;
}) {
    const isEditing = !!categorie;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: categorie?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/categories/${categorie.id}`, {
                onSuccess: () => { reset(); onClose(); },
            });
        } else {
            post('/categories', {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h2>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Nom de la catégorie *
                    </label>
                    <div className="relative">
                        <FolderGit2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                            placeholder="Ex: Électronique, Vêtements..."
                            required
                            autoFocus
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {processing ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function CategoriesIndex({ categories }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<CategorieWithCount | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategorieWithCount | null>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const filtered = categories.data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const openCreate = () => { setSelected(null); setIsFormOpen(true); };
    const openEdit = (cat: CategorieWithCount) => { setSelected(cat); setIsFormOpen(true); };
    const openDelete = (cat: CategorieWithCount) => { setDeleteTarget(cat); setIsDeleteOpen(true); };

    const handleDelete = () => {
        if (!deleteTarget) { return; }
        router.delete(`/categories/${deleteTarget.id}`, {
            onSuccess: () => { setIsDeleteOpen(false); setDeleteTarget(null); },
        });
    };

    return (
        <>
            <Head title="Catégories" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] bg-clip-text text-transparent">
                                    Catégories
                                </h1>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    {categories.total} catégorie{categories.total !== 1 ? 's' : ''} au total
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Nouvelle catégorie
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une catégorie..."
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
                        {filtered.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <FolderGit2 className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                                    {search ? 'Aucun résultat' : 'Aucune catégorie'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {search ? 'Essayez avec un autre terme' : 'Commencez par créer votre première catégorie'}
                                </p>
                                {!search && (
                                    <button
                                        onClick={openCreate}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Créer une catégorie
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produits</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    <AnimatePresence>
                                        {filtered.map((cat, idx) => (
                                            <motion.tr
                                                key={cat.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8962E]/20 to-[#E8B84B]/20 flex items-center justify-center">
                                                            <FolderGit2 className="h-5 w-5 text-[#C8962E]" />
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                                                        <Package className="h-3.5 w-3.5" />
                                                        {cat.produits_count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => openEdit(cat)}
                                                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDelete(cat)}
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
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50">
                        <CategorieForm
                            categorie={selected}
                            onClose={() => setIsFormOpen(false)}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Modal Delete */}
            <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-6">
                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Supprimer la catégorie</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                                Supprimer <span className="font-semibold text-gray-900 dark:text-white">"{deleteTarget?.name}"</span> ?
                                {(deleteTarget?.produits_count ?? 0) > 0 && (
                                    <span className="block mt-1 text-orange-600 dark:text-orange-400">
                                        Cette catégorie contient {deleteTarget?.produits_count} produit{(deleteTarget?.produits_count ?? 0) > 1 ? 's' : ''}.
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
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

CategoriesIndex.layout = {
    breadcrumbs: [{ title: 'Catégories', href: '/categories' }],
};
