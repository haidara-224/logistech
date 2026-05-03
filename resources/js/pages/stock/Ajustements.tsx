import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductPickerModal, ProduitPickerItem } from '@/components/ProductPickerModal';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    PackagePlus,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    ChevronDown,
    Package,
    Search,
    BarChart3,
    MoveRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MouvementsStock } from '@/types/models';

interface Props {
    produits: ProduitPickerItem[];
    ajustements: {
        data: MouvementsStock[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

export default function Ajustements({ produits, ajustements }: Props) {
    const { flash } = usePage().props as any;

    const [produitId, setProduitId] = useState<number | ''>('');
    const [type, setType] = useState<'entree' | 'sortie'>('entree');
    const [quantite, setQuantite] = useState<string>('');
    const [processing, setProcessing] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const selectedProduit = produits.find((p) => p.id === produitId) ?? null;
    const stockPct = selectedProduit
        ? Math.min(100, Math.round((selectedProduit.quantite_stock / Math.max(selectedProduit.stock_minimal * 2, 1)) * 100))
        : 0;
    const isBelowMin = selectedProduit ? selectedProduit.quantite_stock < selectedProduit.stock_minimal : false;
    const isOverdraft =
        type === 'sortie' && selectedProduit && quantite !== ''
            ? Number(quantite) > selectedProduit.quantite_stock
            : false;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!produitId || !quantite || Number(quantite) <= 0) {
            toast.error('Veuillez remplir tous les champs correctement.');
            return;
        }
        setProcessing(true);
        router.post(
            '/dashboard/stock/ajustements',
            { produit_id: produitId, type, quantite: Number(quantite) },
            {
                onFinish: () => setProcessing(false),
                onSuccess: () => {
                    setProduitId('');
                    setQuantite('');
                    setType('entree');
                },
            },
        );
    };

    const handlePage = (page: number) => {
        router.get('/dashboard/stock/ajustements', { page }, { preserveState: true });
    };

    return (
        <>
            <Head title="Ajustements de Stock" />

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
                                Ajustements de Stock
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Enregistrez des entrées ou sorties manuelles de stock
                            </p>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Link
                                href="/dashboard/mouvements"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#C8962E]/40 bg-[#C8962E]/5 px-5 py-2.5 text-sm font-semibold text-[#C8962E] hover:bg-[#C8962E]/10 transition-all"
                            >
                                <BarChart3 className="h-4 w-4" />
                                Voir tous les mouvements
                                <MoveRight className="h-4 w-4" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* LEFT: Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-5"
                        >
                            <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="pb-0 pt-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8962E] to-[#E8B84B] flex items-center justify-center shadow-md">
                                            <PackagePlus className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                                Nouvel ajustement
                                            </CardTitle>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                Sélectionnez un produit et saisissez la quantité
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Produit Picker */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                Produit
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setPickerOpen(true)}
                                                className={`w-full flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all hover:border-[#C8962E]/50 ${
                                                    selectedProduit
                                                        ? 'border-[#C8962E]/30 bg-white dark:bg-zinc-800'
                                                        : 'border-dashed border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800'
                                                }`}
                                            >
                                                {selectedProduit ? (
                                                    <>
                                                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {selectedProduit.images?.[0]?.image?.image_path
                                                                ? <img src={`/storage/${selectedProduit.images[0].image.image_path}`} alt={selectedProduit.nom} className="w-full h-full object-cover" />
                                                                : <Package className="w-4 h-4 text-gray-400" />
                                                            }
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{selectedProduit.nom}</p>
                                                            <p className="text-xs text-gray-500">{fmt(selectedProduit.quantite_stock ?? 0)} unités en stock</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-400">Choisir un produit…</span>
                                                    </>
                                                )}
                                                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-auto" />
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {pickerOpen && (
                                                <ProductPickerModal
                                                    open={true}
                                                    produits={produits}
                                                    selectedId={produitId || null}
                                                    onSelect={(p) => { setProduitId(p.id); setPickerOpen(false); }}
                                                    onClose={() => setPickerOpen(false)}
                                                />
                                            )}
                                        </AnimatePresence>

                                        {/* Stock Indicator */}
                                        <AnimatePresence>
                                            {selectedProduit && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div
                                                        className={`rounded-xl border p-4 ${
                                                            isBelowMin
                                                                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40'
                                                                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                                Stock actuel
                                                            </p>
                                                            {isBelowMin && (
                                                                <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                                                                    <AlertTriangle className="h-3 w-3" />
                                                                    Sous le minimum
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-end justify-between mb-3">
                                                            <span
                                                                className={`text-2xl font-black ${
                                                                    isBelowMin
                                                                        ? 'text-red-600 dark:text-red-400'
                                                                        : 'text-emerald-700 dark:text-emerald-400'
                                                                }`}
                                                            >
                                                                {fmt(selectedProduit.quantite_stock)}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                Min: {fmt(selectedProduit.stock_minimal)}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${stockPct}%` }}
                                                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                                                className={`h-full rounded-full ${
                                                                    isBelowMin
                                                                        ? 'bg-gradient-to-r from-red-500 to-red-400'
                                                                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Type Toggle */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                Type de mouvement
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setType('entree')}
                                                    className={`flex items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                                                        type === 'entree'
                                                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                                            : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:border-emerald-300 hover:bg-emerald-50/50'
                                                    }`}
                                                >
                                                    <ArrowUpCircle
                                                        className={`h-5 w-5 ${type === 'entree' ? 'text-emerald-600' : 'text-gray-400'}`}
                                                    />
                                                    Entrée
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setType('sortie')}
                                                    className={`flex items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                                                        type === 'sortie'
                                                            ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 shadow-sm'
                                                            : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:border-red-300 hover:bg-red-50/50'
                                                    }`}
                                                >
                                                    <ArrowDownCircle
                                                        className={`h-5 w-5 ${type === 'sortie' ? 'text-red-600' : 'text-gray-400'}`}
                                                    />
                                                    Sortie
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantite */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                Quantité
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={quantite}
                                                onChange={(e) => setQuantite(e.target.value)}
                                                placeholder="0"
                                                className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                                    isOverdraft
                                                        ? 'border-red-400 bg-red-50 dark:bg-red-950/20 focus:border-red-500 focus:ring-red-200'
                                                        : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#C8962E] focus:ring-[#C8962E]/20'
                                                }`}
                                            />
                                            <AnimatePresence>
                                                {isOverdraft && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -4 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -4 }}
                                                        className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium"
                                                    >
                                                        <AlertTriangle className="h-3.5 w-3.5" />
                                                        Quantité supérieure au stock disponible ({fmt(selectedProduit!.quantite_stock)})
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Submit */}
                                        <motion.button
                                            type="submit"
                                            disabled={processing || !produitId || !quantite}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Enregistrement...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <PackagePlus className="h-4 w-4" />
                                                    Enregistrer l'ajustement
                                                </span>
                                            )}
                                        </motion.button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* RIGHT: Recent adjustments table */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="lg:col-span-7"
                        >
                            <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="pb-0 pt-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                                            Ajustements récents
                                        </CardTitle>
                                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                                            {ajustements.total} au total
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-4 px-0">
                                    {ajustements.data.length === 0 ? (
                                        <div className="text-center py-16 px-6">
                                            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                                                <PackagePlus className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                Aucun ajustement enregistré
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                                            <AnimatePresence>
                                                {ajustements.data.map((mv, idx) => (
                                                    <motion.div
                                                        key={mv.id}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.04 }}
                                                        className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                                                    >
                                                        {/* Type icon */}
                                                        <div
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                                mv.type === 'entree'
                                                                    ? 'bg-emerald-100 dark:bg-emerald-950/40'
                                                                    : 'bg-red-100 dark:bg-red-950/40'
                                                            }`}
                                                        >
                                                            {mv.type === 'entree' ? (
                                                                <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            ) : (
                                                                <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                            )}
                                                        </div>

                                                        {/* Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                                {mv.produit?.nom ?? `Produit #${mv.produit_id}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                {mv.created_at
                                                                    ? new Date(mv.created_at).toLocaleDateString('fr-FR', {
                                                                          day: '2-digit',
                                                                          month: 'short',
                                                                          year: 'numeric',
                                                                          hour: '2-digit',
                                                                          minute: '2-digit',
                                                                      })
                                                                    : '—'}
                                                            </p>
                                                        </div>

                                                        {/* Badge */}
                                                        <div className="text-right flex-shrink-0">
                                                            <span
                                                                className={`text-sm font-bold tabular-nums ${
                                                                    mv.type === 'entree'
                                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                                        : 'text-red-600 dark:text-red-400'
                                                                }`}
                                                            >
                                                                {mv.type === 'entree' ? '+' : '-'}{fmt(mv.quantite)}
                                                            </span>
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                <span
                                                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                        mv.type === 'entree'
                                                                            ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                                                                            : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'
                                                                    }`}
                                                                >
                                                                    {mv.type === 'entree' ? 'Entrée' : 'Sortie'}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {ajustements.last_page > 1 && (
                                        <div className="mt-4 flex items-center justify-between px-6 pb-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {(ajustements.current_page - 1) * ajustements.per_page + 1}–
                                                {Math.min(ajustements.current_page * ajustements.per_page, ajustements.total)}{' '}
                                                sur {ajustements.total}
                                            </p>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handlePage(ajustements.current_page - 1)}
                                                    disabled={ajustements.current_page === 1}
                                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </button>
                                                {Array.from({ length: ajustements.last_page }, (_, i) => i + 1).map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => handlePage(p)}
                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            ajustements.current_page === p
                                                                ? 'bg-[#C8962E] text-white'
                                                                : 'border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                                        }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePage(ajustements.current_page + 1)}
                                                    disabled={ajustements.current_page === ajustements.last_page}
                                                    className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}

Ajustements.layout = {
    breadcrumbs: [
        { title: 'Stock', href: '/dashboard/mouvements' },
        { title: 'Ajustements', href: '/dashboard/stock/ajustements' },
    ],
};
