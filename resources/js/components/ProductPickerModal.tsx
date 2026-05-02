import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Package, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export interface ProduitPickerItem {
    id: number;
    nom: string;
    sku?: string | null;
    prix_vente?: number | null;
    quantite_stock?: number | null;
    stock_minimal?: number | null;
    stock_reel?: number | null;
    images?: Array<{ image?: { image_path?: string } | null }> | null;
    categorie?: { name?: string } | null;
}

interface Props {
    open: boolean;
    produits: ProduitPickerItem[];
    selectedId?: number | null;
    onSelect: (produit: ProduitPickerItem) => void;
    onClose: () => void;
    title?: string;
}

const PER_PAGE = 8;

function imgUrl(p: ProduitPickerItem): string | null {
    const path = p.images?.[0]?.image?.image_path;
    return path ? `/storage/${path}` : null;
}

function stock(p: ProduitPickerItem): number {
    return p.stock_reel ?? p.quantite_stock ?? 0;
}

export function ProductPickerModal({ open, produits, selectedId, onSelect, onClose, title = 'Sélectionner un produit' }: Props) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return produits;
        return produits.filter(
            (p) =>
                p.nom.toLowerCase().includes(q) ||
                (p.sku?.toLowerCase().includes(q) ?? false) ||
                (p.categorie?.name?.toLowerCase().includes(q) ?? false),
        );
    }, [produits, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(1);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="relative z-10 w-full max-w-2xl max-h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {filtered.length} produit{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Nom, SKU, catégorie…"
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    {paginated.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="w-10 h-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">Aucun produit trouvé</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {paginated.map((p) => {
                                const img = imgUrl(p);
                                const s = stock(p);
                                const isSelected = selectedId === p.id;
                                const outOfStock = s <= 0;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => { onSelect(p); onClose(); }}
                                        className={`relative text-left rounded-xl border-2 p-2.5 transition-all hover:shadow-md focus:outline-none ${
                                            isSelected
                                                ? 'border-[#C8962E] bg-[#C8962E]/5 ring-2 ring-[#C8962E]/20'
                                                : outOfStock
                                                  ? 'border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed'
                                                  : 'border-gray-200 dark:border-gray-700 hover:border-[#C8962E]/50 dark:hover:border-[#C8962E]/50'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute top-2 right-2">
                                                <CheckCircle className="w-4 h-4 text-[#C8962E]" />
                                            </span>
                                        )}

                                        {/* Image */}
                                        <div className="w-full aspect-square rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-2 flex items-center justify-center">
                                            {img ? (
                                                <img src={img} alt={p.nom} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-7 h-7 text-gray-400" />
                                            )}
                                        </div>

                                        <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{p.nom}</p>
                                        {p.sku && <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{p.sku}</p>}

                                        <div className="mt-1.5 flex flex-col gap-0.5">
                                            <span
                                                className={`text-[10px] font-bold ${
                                                    s <= 0 ? 'text-red-500' : s <= (p.stock_minimal ?? 5) ? 'text-orange-500' : 'text-emerald-500'
                                                }`}
                                            >
                                                {s <= 0 ? 'Rupture' : `${s} en stock`}
                                            </span>
                                            {p.prix_vente != null && (
                                                <span className="text-[10px] font-bold text-[#C8962E]">{p.prix_vente.toLocaleString()} GNF</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <span className="text-xs text-gray-500">
                            Page {page} / {totalPages} — {filtered.length} résultats
                        </span>
                        <div className="flex gap-1">
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                ← Préc.
                            </button>
                            <button
                                type="button"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Suiv. →
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
