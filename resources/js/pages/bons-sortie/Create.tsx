import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, LogOut, Package, Plus, Search, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Depot } from '@/types/models';
import { ProductPickerModal, ProduitPickerItem } from '@/components/ProductPickerModal';

interface Props {
    depots: Pick<Depot, 'id' | 'nom'>[];
    produits: (ProduitPickerItem & { quantite_stock?: number | null })[];
}

interface Item {
    produit_id: number;
    nom: string;
    sku: string;
    quantite: number;
    stock_actuel: number;
}

export default function BonsSortieCreate({ depots, produits }: Props) {
    const [depotId, setDepotId] = useState<string>('');
    const [depotSearch, setDepotSearch] = useState('');
    const [depotPanelOpen, setDepotPanelOpen] = useState(false);
    const [motif, setMotif] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [processing, setProcessing] = useState(false);
    const [pickerOpenFor, setPickerOpenFor] = useState<number | null>(null);

    const filteredDepots = depots.filter((d) => d.nom.toLowerCase().includes(depotSearch.toLowerCase()));
    const selectedDepot = depots.find((d) => String(d.id) === depotId);

    const addItem = () => {
        setItems((prev) => [...prev, { produit_id: 0, nom: '', sku: '', quantite: 1, stock_actuel: 0 }]);
        setPickerOpenFor(items.length);
    };

    const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

    const updateQty = (i: number, qty: number) => {
        setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, quantite: Math.max(1, qty) } : item)));
    };

    const handlePickerSelect = (p: ProduitPickerItem) => {
        if (pickerOpenFor === null) return;
        const full = produits.find((x) => x.id === p.id);
        setItems((prev) =>
            prev.map((item, idx) =>
                idx === pickerOpenFor
                    ? { ...item, produit_id: p.id, nom: p.nom, sku: p.sku ?? '', stock_actuel: full?.quantite_stock ?? 0 }
                    : item,
            ),
        );
        setPickerOpenFor(null);
    };

    const validItems = items.filter((i) => i.produit_id > 0 && i.quantite > 0);

    const handleSubmit = (e: { preventDefault(): void }) => {
        e.preventDefault();
        if (validItems.length === 0) return;
        setProcessing(true);
        router.post(
            '/dashboard/bons-sortie',
            {
                depot_id: depotId || null,
                motif: motif || null,
                notes: notes || null,
                items: validItems.map((i) => ({ produit_id: i.produit_id, quantite: i.quantite })),
            },
            { onFinish: () => setProcessing(false) },
        );
    };

    const alreadySelected = new Set(items.map((i) => i.produit_id));

    return (
        <>
            <Head title="Nouveau bon de sortie" />

            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard/bons-sortie"
                            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                            <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau bon de sortie</h1>
                            <p className="text-xs text-gray-500 mt-0.5">Enregistrer une sortie de stock manuelle</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-5">

                                {/* Dépôt */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <button type="button"
                                        onClick={() => setDepotPanelOpen(!depotPanelOpen)}
                                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                                                <LogOut className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Dépôt</p>
                                                {selectedDepot
                                                    ? <p className="text-xs text-orange-600 font-medium">{selectedDepot.nom}</p>
                                                    : <p className="text-xs text-gray-400">Optionnel</p>
                                                }
                                            </div>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${depotPanelOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {depotPanelOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                                                <div className="p-5 space-y-3">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input type="text" placeholder="Rechercher…" value={depotSearch}
                                                            onChange={(e) => setDepotSearch(e.target.value)}
                                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:border-orange-500 transition-all"
                                                        />
                                                    </div>
                                                    <div className="max-h-48 overflow-y-auto space-y-1.5">
                                                        <button type="button" onClick={() => { setDepotId(''); setDepotPanelOpen(false); }}
                                                            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all ${!depotId ? 'bg-gray-100 dark:bg-gray-800 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-500'}`}>
                                                            Sans dépôt spécifique
                                                        </button>
                                                        {filteredDepots.map((d) => (
                                                            <button key={d.id} type="button"
                                                                onClick={() => { setDepotId(String(d.id)); setDepotPanelOpen(false); }}
                                                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm transition-all border ${String(d.id) === depotId ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 font-medium border-orange-200' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border-transparent'}`}>
                                                                {d.nom}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Motif */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5 space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Motif de sortie</label>
                                        <input type="text" value={motif} onChange={(e) => setMotif(e.target.value)}
                                            placeholder="Ex : Consommation interne, Perte, Don…"
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Notes</label>
                                        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Informations complémentaires…"
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm resize-none focus:outline-none focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Articles */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Articles à sortir</p>
                                        </div>
                                        <button type="button" onClick={addItem}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors">
                                            <Plus className="w-3.5 h-3.5" /> Ajouter
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        {items.length === 0 ? (
                                            <button type="button" onClick={addItem}
                                                className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-12 flex flex-col items-center gap-3 hover:border-orange-300 hover:bg-orange-50/30 transition-all group">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-orange-100 flex items-center justify-center transition-colors">
                                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-orange-600 transition-colors" />
                                                </div>
                                                <p className="text-sm text-gray-400 group-hover:text-orange-600 transition-colors">Ajouter des produits</p>
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {items.map((item, idx) => (
                                                        <motion.div key={idx} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                                                            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                            <div className="p-4 flex items-start gap-3">
                                                                <button type="button" onClick={() => setPickerOpenFor(idx)}
                                                                    className={`flex-1 flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${item.produit_id ? 'border-orange-200 bg-white dark:bg-gray-900 hover:border-orange-400' : 'border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-orange-300'}`}>
                                                                    {item.produit_id ? (
                                                                        <>
                                                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center shrink-0">
                                                                                <Package className="w-4 h-4 text-orange-600" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.nom}</p>
                                                                                <p className="text-[10px] text-gray-400 font-mono">{item.sku} — stock : {item.stock_actuel}</p>
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

                                                                {item.produit_id > 0 && (
                                                                    <div className="flex items-center gap-1 shrink-0">
                                                                        <button type="button" onClick={() => updateQty(idx, item.quantite - 1)}
                                                                            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            <X className="w-3 h-3 rotate-45" />
                                                                        </button>
                                                                        <input type="number" min={1} value={item.quantite}
                                                                            onChange={(e) => updateQty(idx, parseInt(e.target.value) || 1)}
                                                                            className="w-14 text-center text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                        />
                                                                        <button type="button" onClick={() => updateQty(idx, item.quantite + 1)}
                                                                            className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                            <Plus className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                <button type="button" onClick={() => removeItem(idx)}
                                                                    className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>

                                                <button type="button" onClick={addItem}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50/30 transition-all">
                                                    <Plus className="w-3.5 h-3.5" /> Ajouter un produit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right — Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-4">
                                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center">
                                                <LogOut className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Récapitulatif</p>
                                        </div>
                                        <div className="p-5 space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                                                <span>Dépôt</span>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">{selectedDepot?.nom ?? '—'}</span>
                                            </div>
                                            {motif && (
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Motif</span>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300 text-right max-w-35 truncate">{motif}</span>
                                                </div>
                                            )}
                                            {validItems.length > 0 ? (
                                                <div className="space-y-2 pt-1">
                                                    {validItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between gap-2 text-xs">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className="w-5 h-5 rounded-md bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0">{item.quantite}</span>
                                                                <span className="text-gray-700 dark:text-gray-300 truncate">{item.nom}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-xs text-gray-400 py-3">Aucun produit ajouté</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <button type="submit" disabled={processing || validItems.length === 0}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            <LogOut className="w-4 h-4" />
                                            {processing ? 'Enregistrement…' : 'Créer le bon de sortie'}
                                        </button>
                                        <Link href="/dashboard/bons-sortie"
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
                        produits={produits.filter((p) => !alreadySelected.has(p.id) || items[pickerOpenFor]?.produit_id === p.id)}
                        onSelect={handlePickerSelect}
                        onClose={() => setPickerOpenFor(null)}
                        title="Choisir un produit à sortir"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
