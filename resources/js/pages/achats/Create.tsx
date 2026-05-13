import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Package, Plus, Receipt, Search, ShoppingBag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Fournisseur } from '@/types/models';
import { ProductPickerModal, ProduitPickerItem } from '@/components/ProductPickerModal';
import { fmtGnf } from '@/lib/utils';

interface Props {
    fournisseurs: Pick<Fournisseur, 'id' | 'nom'>[];
    produits: (ProduitPickerItem & { prix_achat?: number | null; quantite_stock?: number | null })[];
}

interface Item {
    produit_id: number;
    nom: string;
    sku: string;
    quantite: number;
    prix_achat_unitaire: number;
    prix_achat_actuel: number;
    prix_vente_actuel: number;
    prix_vente_nouveau: number;
    stock_actuel: number;
}

export default function AchatsCreate({ fournisseurs, produits }: Props) {
    const [fournisseurId, setFournisseurId] = useState<string>('');
    const [fournisseurSearch, setFournisseurSearch] = useState('');
    const [fournisseurPanelOpen, setFournisseurPanelOpen] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [pickerOpenFor, setPickerOpenFor] = useState<number | null>(null);

    const filteredFournisseurs = fournisseurs.filter((f) =>
        f.nom.toLowerCase().includes(fournisseurSearch.toLowerCase()),
    );
    const selectedFournisseur = fournisseurs.find((f) => String(f.id) === fournisseurId);

    const addItem = () =>
        setItems([...items, { produit_id: 0, nom: '', sku: '', quantite: 1, prix_achat_unitaire: 0, prix_achat_actuel: 0, prix_vente_actuel: 0, prix_vente_nouveau: 0, stock_actuel: 0 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const selectProduit = (idx: number, p: ProduitPickerItem & { prix_achat?: number | null; quantite_stock?: number | null }) => {
        const updated = [...items];
        updated[idx] = {
            ...updated[idx],
            produit_id: p.id,
            nom: p.nom,
            sku: p.sku ?? '',
            prix_achat_unitaire: p.prix_achat ?? 0,
            prix_achat_actuel: p.prix_achat ?? 0,
            prix_vente_actuel: p.prix_vente ?? 0,
            prix_vente_nouveau: p.prix_vente ?? 0,
            stock_actuel: p.quantite_stock ?? 0,
        };
        setItems(updated);
        setPickerOpenFor(null);
    };

    const updateItem = (idx: number, field: 'quantite' | 'prix_achat_unitaire' | 'prix_vente_nouveau', value: number) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setItems(updated);
    };

    const calcPrixMoyen = (item: Item) => {
        const qte = Math.max(0, item.stock_actuel);
        const total = qte + item.quantite;
        if (total === 0) return item.prix_achat_unitaire;
        return (qte * item.prix_achat_actuel + item.quantite * item.prix_achat_unitaire) / total;
    };

    const validItems = items.filter((i) => i.produit_id > 0 && i.quantite > 0);
    const sousTotal = validItems.reduce((s, i) => s + i.quantite * i.prix_achat_unitaire, 0);

    const handleSubmit = (e: { preventDefault(): void }) => {
        e.preventDefault();
        setProcessing(true);
        router.post(
            '/dashboard/achats',
            {
                fournisseur_id: fournisseurId || null,
                notes: notes || null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items: validItems as any,
            },
            { onFinish: () => setProcessing(false) },
        );
    };

    return (
        <>
            <Head title="Nouvel achat" />

            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard/achats"
                            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                            <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouvel achat</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Enregistrer une entrée de stock fournisseur</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-5">

                                {/* Fournisseur */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <button type="button"
                                        onClick={() => setFournisseurPanelOpen(!fournisseurPanelOpen)}
                                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                                                <ShoppingBag className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Fournisseur</p>
                                                {selectedFournisseur && (
                                                    <p className="text-xs text-purple-600 font-medium">{selectedFournisseur.nom}</p>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${fournisseurPanelOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {fournisseurPanelOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                <div className="p-5 space-y-3">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input type="text" placeholder="Rechercher…" value={fournisseurSearch}
                                                            onChange={(e) => setFournisseurSearch(e.target.value)}
                                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                                                        />
                                                    </div>
                                                    {fournisseurs.length === 0 ? (
                                                        <p className="text-sm text-gray-400 text-center py-4">
                                                            Aucun fournisseur — <Link href="/dashboard/fournisseurs/creer" className="text-purple-600 hover:underline">en créer un</Link>
                                                        </p>
                                                    ) : (
                                                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                                                            <button type="button" onClick={() => { setFournisseurId(''); setFournisseurPanelOpen(false); }}
                                                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${!fournisseurId ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500'}`}>
                                                                Sans fournisseur
                                                            </button>
                                                            {filteredFournisseurs.map((f) => (
                                                                <button key={f.id} type="button"
                                                                    onClick={() => { setFournisseurId(String(f.id)); setFournisseurPanelOpen(false); }}
                                                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all border ${String(f.id) === fournisseurId ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 font-medium border-purple-200' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-transparent'}`}>
                                                                    {f.nom}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <Link href="/dashboard/fournisseurs/creer" className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:underline font-medium">
                                                        <Plus className="w-3 h-3" /> Créer un fournisseur
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Produits */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Produits achetés</p>
                                        </div>
                                        <button type="button" onClick={addItem}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 text-xs font-semibold hover:bg-purple-100 transition-colors">
                                            <Plus className="w-3.5 h-3.5" /> Ajouter
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        {items.length === 0 ? (
                                            <button type="button" onClick={addItem}
                                                className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-12 flex flex-col items-center gap-3 hover:border-purple-300 hover:bg-purple-50/30 transition-all group">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
                                                </div>
                                                <p className="text-sm text-gray-400 group-hover:text-purple-600 transition-colors">Ajouter des produits</p>
                                            </button>
                                        ) : (
                                            <div className="space-y-4">
                                                <AnimatePresence>
                                                    {items.map((item, idx) => {
                                                        const prixMoyen = item.produit_id ? calcPrixMoyen(item) : 0;
                                                        const prixChange = item.produit_id > 0 && item.prix_achat_unitaire !== item.prix_achat_actuel;

                                                        return (
                                                            <motion.div key={idx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                                                                className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                                <div className="p-4 space-y-3">
                                                                    <div className="flex items-start gap-3">
                                                                        {/* Product picker button */}
                                                                        <button type="button" onClick={() => setPickerOpenFor(idx)}
                                                                            className={`flex-1 flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${item.produit_id ? 'border-purple-200 bg-white dark:bg-gray-900 hover:border-purple-400' : 'border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-purple-300'}`}>
                                                                            {item.produit_id ? (
                                                                                <>
                                                                                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center shrink-0">
                                                                                        <Package className="w-4 h-4 text-purple-600" />
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.nom}</p>
                                                                                        <p className="text-[10px] text-gray-400 font-mono">{item.sku}</p>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                                                                    <span className="text-xs text-gray-400">Choisir un produit…</span>
                                                                                </>
                                                                            )}
                                                                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-auto" />
                                                                        </button>
                                                                        <button type="button" onClick={() => removeItem(idx)}
                                                                            className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>

                                                                    {item.produit_id > 0 && (
                                                                        <div className="space-y-3">
                                                                            <div className="grid grid-cols-2 gap-3">
                                                                                <div>
                                                                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Quantité</label>
                                                                                    <input type="number" min={1} value={item.quantite}
                                                                                        onChange={(e) => updateItem(idx, 'quantite', Number(e.target.value))}
                                                                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm text-center focus:outline-none focus:border-purple-500 transition-all"
                                                                                    />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Prix d'achat unitaire</label>
                                                                                    <div className="relative">
                                                                                        <input type="number" min={0} value={item.prix_achat_unitaire}
                                                                                            onChange={(e) => updateItem(idx, 'prix_achat_unitaire', Number(e.target.value))}
                                                                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 pr-12 text-sm focus:outline-none focus:border-purple-500 transition-all"
                                                                                        />
                                                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">GNF</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                <label className="text-xs font-medium text-gray-500 mb-1 block">
                                                                                    Nouveau prix de vente
                                                                                    <span className="ml-1 text-gray-400">(actuel : {fmtGnf(item.prix_vente_actuel)} GNF)</span>
                                                                                </label>
                                                                                <div className="relative">
                                                                                    <input type="number" min={0} value={item.prix_vente_nouveau}
                                                                                        onChange={(e) => updateItem(idx, 'prix_vente_nouveau', Number(e.target.value))}
                                                                                        className="w-full rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/10 py-2.5 px-3 pr-12 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                                                                    />
                                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 font-semibold">GNF</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {item.produit_id > 0 && (
                                                                    <div className={`px-4 py-3 border-t text-xs space-y-1.5 ${prixChange ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100' : 'bg-gray-50 dark:bg-gray-800/30 border-gray-100'}`}>
                                                                        <div className="flex justify-between text-gray-500">
                                                                            <span>Stock actuel</span>
                                                                            <span className="font-medium">{item.stock_actuel} unités</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-gray-500">
                                                                            <span>Prix d'achat actuel</span>
                                                                            <span className="font-medium">{fmtGnf(item.prix_achat_actuel)} GNF</span>
                                                                        </div>
                                                                        {prixChange && (
                                                                            <div className="flex justify-between text-amber-700 dark:text-amber-400 font-semibold pt-1 border-t border-amber-200">
                                                                                <span>Nouveau prix moyen (PMP)</span>
                                                                                <span>{fmtGnf(prixMoyen)} GNF</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex justify-between text-gray-600 dark:text-gray-400 font-medium">
                                                                            <span>Sous-total</span>
                                                                            <span>{fmtGnf(item.quantite * item.prix_achat_unitaire)} GNF</span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        );
                                                    })}
                                                </AnimatePresence>

                                                <button type="button" onClick={addItem}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/30 transition-all">
                                                    <Plus className="w-3.5 h-3.5" /> Ajouter un produit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Notes</label>
                                    <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Informations complémentaires…"
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm resize-none focus:outline-none focus:border-purple-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Right — Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-4">
                                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                                                <Receipt className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Récapitulatif</p>
                                        </div>
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                                                <span>Fournisseur</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{selectedFournisseur?.nom ?? '—'}</span>
                                            </div>
                                            {validItems.length > 0 ? (
                                                <div className="space-y-2">
                                                    {validItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">{item.quantite}</span>
                                                                <span className="text-gray-700 dark:text-gray-300 truncate">{item.nom}</span>
                                                            </div>
                                                            <span className="font-semibold text-gray-900 dark:text-white shrink-0">{fmtGnf(item.quantite * item.prix_achat_unitaire)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-xs text-gray-400 py-3">Aucun produit ajouté</p>
                                            )}
                                            <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex justify-between">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                                    <div>
                                                        <span className="text-xl font-black text-purple-600">{fmtGnf(sousTotal)}</span>
                                                        <span className="text-xs text-gray-500 ml-1">GNF</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <button type="submit" disabled={processing || validItems.length === 0}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ShoppingBag className="w-4 h-4" />
                                            {processing ? 'Enregistrement…' : 'Enregistrer l\'achat'}
                                        </button>
                                        <Link href="/dashboard/achats"
                                            className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            Annuler
                                        </Link>
                                    </div>

                                    {validItems.length === 0 && (
                                        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 p-3">
                                            <div className="flex items-center gap-2 text-xs text-amber-600">
                                                <X className="w-3 h-3 shrink-0" /> Ajouter au moins un produit
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <AnimatePresence>
                {pickerOpenFor !== null && (
                    <ProductPickerModal
                        open={true}
                        produits={produits}
                        selectedId={items[pickerOpenFor]?.produit_id || null}
                        onSelect={(p) => selectProduit(pickerOpenFor!, p as any)}
                        onClose={() => setPickerOpenFor(null)}
                        title="Choisir un produit à acheter"
                    />
                )}
            </AnimatePresence>
        </>
    );
}

AchatsCreate.layout = {
    breadcrumbs: [
        { title: 'Achats', href: '/dashboard/achats' },
        { title: 'Nouvel achat', href: '/dashboard/achats/creer' },
    ],
};
