import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle, CheckCircle, ChevronLeft, ChevronRight,
    DollarSign, Edit, Grid3x3, LayoutList, Loader2, Package,
    Plus, Search, Trash2,  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { Categorie, Produit } from '@/types/models';
import ProduitFormModal from './Form';

interface Props {
    produits: {
        data: Produit[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total_produits: number;
        valeur_stock: number;
        produits_rupture: number;
        produits_faible_stock: number;
    };
    filters?: { search?: string };
    categories: Categorie[];
}

function stockBadge(produit: Produit) {
    const s = (produit as any).stock_reel ?? produit.quantite_stock ?? 0;
    const min = produit.stock_minimal ?? 0;
    if (s <= 0) return { label: 'Rupture', cls: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400', dot: 'bg-red-500', icon: XCircle };
    if (s <= min) return { label: 'Stock faible', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400', dot: 'bg-orange-500', icon: AlertCircle };
    return { label: 'En stock', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400', dot: 'bg-emerald-500', icon: CheckCircle };
}

function productImageUrl(produit: Produit): string | null {
    const images = (produit as any).images as Array<{ image?: { image_path?: string } }> | undefined;
    const path = images?.[0]?.image?.image_path;
    return path ? `/storage/${path}` : null;
}

export default function ProduitsIndex({ produits, stats, filters, categories }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters?.search ?? '');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; nom: string } | null>(null);
    const [pageLoading, setPageLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (search !== (filters?.search ?? '')) {
                router.get('/produits', { search }, { preserveState: true, replace: true });
            }
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    const handlePageChange = (page: number) => {
        setPageLoading(true);
        router.get('/produits', { page, search }, { preserveState: true, onFinish: () => setPageLoading(false) });
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/produits/${deleteTarget.id}`, {
            onSuccess: () => { setIsDeleteOpen(false); toast.success('Produit supprimé'); },
        });
    };

    const statCards = [
        { title: 'Total produits', value: stats.total_produits, icon: Package, color: 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.07] text-slate-700 dark:text-white' },
        { title: 'Valeur du stock', value: `${(stats.valeur_stock ?? 0).toLocaleString('fr-FR')} GNF`, icon: DollarSign, color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
        { title: 'En rupture', value: stats.produits_rupture ?? 0, icon: XCircle, color: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300' },
        { title: 'Stock faible', value: stats.produits_faible_stock ?? 0, icon: AlertCircle, color: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20 text-orange-700 dark:text-orange-300' },
    ];

    const produitsData = produits.data ?? [];

    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        const { current_page: cur, last_page: last } = produits;
        if (last <= 7) { for (let i = 1; i <= last; i++) pages.push(i); return pages; }
        if (cur <= 3) { for (let i = 1; i <= 5; i++) pages.push(i); pages.push('...'); pages.push(last); }
        else if (cur >= last - 2) { pages.push(1); pages.push('...'); for (let i = last - 4; i <= last; i++) pages.push(i); }
        else { pages.push(1); pages.push('...'); for (let i = cur - 1; i <= cur + 1; i++) pages.push(i); pages.push('...'); pages.push(last); }
        return pages;
    };

    return (
        <>
            <Head title="Produits" />

            <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-[#C8962E] to-[#E8B84B]">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Catalogue Produits</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Gérez votre inventaire et suivez les stocks</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedProduit(null); setIsFormOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Nouveau produit
                    </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((s, i) => (
                        <motion.div key={s.title} whileHover={{ y: -2 }} transition={{ delay: i * 0.04 }}
                            className={`rounded-2xl p-5 border ${s.color}`}>
                            <div className="flex items-center justify-between mb-2">
                                <s.icon className="w-5 h-5 opacity-70" />
                            </div>
                            <p className="text-2xl font-black">{s.value}</p>
                            <p className="text-sm font-medium opacity-70 mt-0.5">{s.title}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Toolbar */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, SKU, catégorie…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                        {(['grid', 'list'] as const).map((mode) => (
                            <button key={mode} onClick={() => setViewMode(mode)}
                                className={`p-2 rounded-lg transition-all ${viewMode === mode ? 'bg-white dark:bg-gray-700 shadow text-[#C8962E]' : 'text-gray-400 hover:text-gray-600'}`}>
                                {mode === 'grid' ? <Grid3x3 className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block">{produits.total} produit{produits.total !== 1 ? 's' : ''}</span>
                </motion.div>

                {/* Loading */}
                {pageLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C8962E]" />
                    </div>
                )}

                {/* Grid view */}
                {!pageLoading && viewMode === 'grid' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {produitsData.map((produit, idx) => {
                                const img = productImageUrl(produit);
                                const badge = stockBadge(produit);
                                const BadgeIcon = badge.icon;
                                const s = (produit as any).stock_reel ?? produit.quantite_stock ?? 0;
                                return (
                                    <motion.div key={produit.id}
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.03 }}
                                        whileHover={{ y: -3 }}
                                        className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                        {/* Image */}
                                        <div className="relative h-40 bg-linear-to-br from-[#C8962E]/5 to-[#E8B84B]/5 overflow-hidden">
                                            {img ? (
                                                <img src={img} alt={produit.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-12 h-12 text-[#C8962E]/30" />
                                                </div>
                                            )}
                                            {/* Stock badge */}
                                            <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold ${badge.cls}`}>
                                                <BadgeIcon className="w-2.5 h-2.5" />
                                                {badge.label}
                                            </div>
                                            {/* Hover actions */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                               
                                                <button onClick={() => { setSelectedProduit(produit); setIsFormOpen(true); }}
                                                    className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                                                    <Edit className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button onClick={() => { setDeleteTarget({ id: produit.id, nom: produit.nom }); setIsDeleteOpen(true); }}
                                                    className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-3">
                                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">{produit.nom}</h3>
                                            {produit.sku && <p className="text-[10px] text-gray-400 font-mono mt-0.5">{produit.sku}</p>}
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                                <span className="text-sm font-bold text-[#C8962E]">
                                                    {produit.prix_vente ? `${produit.prix_vente.toLocaleString('fr-FR')} GNF` : '—'}
                                                </span>
                                                <span className={`text-xs font-semibold ${s <= 0 ? 'text-red-500' : s <= (produit.stock_minimal ?? 0) ? 'text-orange-500' : 'text-emerald-600'}`}>
                                                    {s} unités
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* List view */}
                {!pageLoading && viewMode === 'list' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Produit</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">SKU</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Catégorie</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {produitsData.map((produit, idx) => {
                                        const img = productImageUrl(produit);
                                        const badge = stockBadge(produit);
                                        const BadgeIcon = badge.icon;
                                        const s = (produit as any).stock_reel ?? produit.quantite_stock ?? 0;
                                        return (
                                            <motion.tr key={produit.id}
                                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {img ? (
                                                                <img src={img} alt={produit.nom} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">{produit.nom}</p>
                                                            {produit.categorie && (
                                                                <p className="text-xs text-gray-400 sm:hidden">{(produit.categorie as any).name}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 hidden sm:table-cell">
                                                    <span className="text-xs font-mono text-gray-500">{produit.sku ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell">
                                                    <span className="text-xs text-gray-500">{(produit.categorie as any)?.name ?? '—'}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="font-bold text-[#C8962E]">
                                                        {produit.prix_vente ? `${produit.prix_vente.toLocaleString('fr-FR')} GNF` : '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`font-semibold text-sm ${s <= 0 ? 'text-red-500' : s <= (produit.stock_minimal ?? 0) ? 'text-orange-500' : 'text-emerald-600'}`}>
                                                        {s}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.cls}`}>
                                                        <BadgeIcon className="w-2.5 h-2.5" />
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    
                                                        <button onClick={() => { setSelectedProduit(produit); setIsFormOpen(true); }}
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button onClick={() => { setDeleteTarget({ id: produit.id, nom: produit.nom }); setIsDeleteOpen(true); }}
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Empty state */}
                {!pageLoading && produitsData.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                            <Package className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {search ? 'Aucun résultat' : 'Aucun produit'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {search ? 'Essayez avec d\'autres mots-clés' : 'Commencez par créer votre premier produit'}
                        </p>
                        {!search && (
                            <button onClick={() => { setSelectedProduit(null); setIsFormOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold">
                                <Plus className="w-4 h-4" /> Ajouter un produit
                            </button>
                        )}
                    </motion.div>
                )}

                {/* Pagination */}
                {produits.last_page > 1 && !pageLoading && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-gray-500">
                            Affichage {(produits.current_page - 1) * produits.per_page + 1}–{Math.min(produits.current_page * produits.per_page, produits.total)} sur {produits.total}
                        </p>
                        <div className="flex gap-1">
                            <button onClick={() => handlePageChange(produits.current_page - 1)} disabled={produits.current_page === 1}
                                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {getPageNumbers().map((p, i) =>
                                p === '...' ? (
                                    <span key={i} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                                ) : (
                                    <button key={i} onClick={() => handlePageChange(p as number)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${produits.current_page === p ? 'bg-[#C8962E] text-white' : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                        {p}
                                    </button>
                                )
                            )}
                            <button onClick={() => handlePageChange(produits.current_page + 1)} disabled={produits.current_page === produits.last_page}
                                className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-center text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Form modal */}
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50">
                        <ProduitFormModal
                            produit={selectedProduit}
                            categories={categories}
                            onClose={() => setIsFormOpen(false)}
                            onSuccess={() => { setIsFormOpen(false); router.reload(); }}
                        />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* Delete modal */}
            <Dialog.Root open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Supprimer le produit</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Êtes-vous sûr de vouloir supprimer{' '}
                            <span className="font-semibold text-gray-900 dark:text-white">"{deleteTarget?.nom}"</span> ?
                            Cette action est irréversible.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Annuler
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                                Supprimer
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
