import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, FolderOpen, Package, Search, X, Grid3X3, BarChart3, Tag } from 'lucide-react';
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

function CategorieForm({ categorie, onClose }: { categorie?: CategorieWithCount | null; onClose: () => void }) {
    const isEditing = !!categorie;
    const { data, setData, post, put, processing, errors, reset } = useForm({ name: categorie?.name || '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/dashboard/categories/${categorie.id}`, { onSuccess: () => { reset(); onClose(); } });
        } else {
            post('/dashboard/categories', { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8962E]/20 to-[#E8B84B]/20 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-[#C8962E]" />
                    </div>
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                        {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                    </h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <X className="h-4 w-4 text-gray-500" />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom de la catégorie <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <FolderOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all placeholder:text-gray-400"
                            placeholder="Ex: Électronique, Vêtements…"
                            required
                            autoFocus
                        />
                    </div>
                    {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                        {processing ? 'Enregistrement…' : isEditing ? 'Mettre à jour' : 'Créer'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const PALETTE = [
    'from-blue-500/20 to-blue-400/10 text-blue-600 dark:text-blue-400',
    'from-purple-500/20 to-purple-400/10 text-purple-600 dark:text-purple-400',
    'from-emerald-500/20 to-emerald-400/10 text-emerald-600 dark:text-emerald-400',
    'from-rose-500/20 to-rose-400/10 text-rose-600 dark:text-rose-400',
    'from-amber-500/20 to-amber-400/10 text-amber-600 dark:text-amber-400',
    'from-cyan-500/20 to-cyan-400/10 text-cyan-600 dark:text-cyan-400',
    'from-indigo-500/20 to-indigo-400/10 text-indigo-600 dark:text-indigo-400',
    'from-pink-500/20 to-pink-400/10 text-pink-600 dark:text-pink-400',
];

export default function CategoriesIndex({ categories }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<CategorieWithCount | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CategorieWithCount | null>(null);

    useEffect(() => {
        if (flash?.success) { toast.success(flash.success); }
        if (flash?.error) { toast.error(flash.error); }
    }, [flash]);

    const filtered = categories.data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalProducts = categories.data.reduce((s, c) => s + c.produits_count, 0);
    const maxCount = Math.max(...categories.data.map((c) => c.produits_count), 1);

    const openCreate = () => { setSelected(null); setIsFormOpen(true); };
    const openEdit = (cat: CategorieWithCount) => { setSelected(cat); setIsFormOpen(true); };
    const openDelete = (cat: CategorieWithCount) => { setDeleteTarget(cat); setIsDeleteOpen(true); };

    const handleDelete = () => {
        if (!deleteTarget) { return; }
        router.delete(`/dashboard/categories/${deleteTarget.id}`, {
            onSuccess: () => { setIsDeleteOpen(false); setDeleteTarget(null); },
        });
    };

    return (
        <>
            <Head title="Catégories" />

            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Catégories</h1>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    Organisez vos produits par catégorie
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C8962E]/25 hover:shadow-xl hover:shadow-[#C8962E]/30 transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Nouvelle catégorie
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                        {[
                            {
                                icon: Grid3X3,
                                label: 'Total catégories',
                                value: categories.total,
                                color: 'text-[#C8962E]',
                                bg: 'bg-[#C8962E]/10',
                            },
                            {
                                icon: Package,
                                label: 'Total produits',
                                value: totalProducts,
                                color: 'text-blue-600 dark:text-blue-400',
                                bg: 'bg-blue-50 dark:bg-blue-950/30',
                            },
                            {
                                icon: BarChart3,
                                label: 'Moy. produits / cat.',
                                value: categories.total > 0 ? Math.round(totalProducts / categories.total) : 0,
                                color: 'text-emerald-600 dark:text-emerald-400',
                                bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                            },
                        ].map((stat, i) => (
                            <div key={i} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une catégorie…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 pl-11 pr-4 text-sm shadow-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <X className="h-3.5 w-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                            className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-20 text-center">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <FolderOpen className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                {search ? 'Aucun résultat' : 'Aucune catégorie'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
                                {search ? `Aucune catégorie ne correspond à "${search}"` : 'Créez votre première catégorie pour organiser vos produits'}
                            </p>
                            {!search && (
                                <button onClick={openCreate}
                                    className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                                    <Plus className="h-4 w-4" />
                                    Créer une catégorie
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        >
                            <AnimatePresence>
                                {filtered.map((cat, idx) => {
                                    const palette = PALETTE[idx % PALETTE.length];
                                    const fillPct = Math.round((cat.produits_count / maxCount) * 100);
                                    return (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.92 }}
                                            transition={{ delay: idx * 0.03 }}
                                            className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-[#C8962E]/40 transition-all duration-200"
                                        >
                                            {/* Icon */}
                                            <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${palette.split(' ')[0]} ${palette.split(' ')[1]} flex items-center justify-center mb-4`}>
                                                <FolderOpen className={`h-6 w-6 ${palette.split(' ').slice(2).join(' ')}`} />
                                            </div>

                                            {/* Name */}
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate pr-10">{cat.name}</h3>

                                            {/* Product count */}
                                            <div className="flex items-center gap-1.5 mb-4">
                                                <Package className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {cat.produits_count} produit{cat.produits_count !== 1 ? 's' : ''}
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-[#C8962E] to-[#E8B84B] transition-all duration-500"
                                                    style={{ width: `${fillPct}%` }}
                                                />
                                            </div>

                                            {/* Actions - appear on hover */}
                                            <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                <button onClick={() => openEdit(cat)}
                                                    className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950 flex items-center justify-center transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => openDelete(cat)}
                                                    className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 flex items-center justify-center transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modal Create/Edit */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50">
                        <CategorieForm categorie={selected} onClose={() => setIsFormOpen(false)} />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Modal Delete */}
            <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-6">
                        <div className="text-center">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                <Trash2 className="h-7 w-7 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Supprimer la catégorie</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                Supprimer <span className="font-semibold text-gray-900 dark:text-white">"{deleteTarget?.name}"</span> ?
                            </p>
                            {(deleteTarget?.produits_count ?? 0) > 0 && (
                                <p className="text-xs text-orange-600 dark:text-orange-400 mb-4">
                                    Cette catégorie contient {deleteTarget?.produits_count} produit{(deleteTarget?.produits_count ?? 0) > 1 ? 's' : ''}.
                                </p>
                            )}
                            <div className="flex gap-3 mt-5">
                                <button onClick={() => setIsDeleteOpen(false)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Annuler
                                </button>
                                <button onClick={handleDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
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
    breadcrumbs: [{ title: 'Catégories', href: '/dashboard/categories' }],
};
