import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Package, Plus, Receipt, Search, ShoppingCart, Trash2, User, X } from 'lucide-react';
import { useState } from 'react';
import { Client, Produit } from '@/types/models';
import { ProductPickerModal, ProduitPickerItem } from '@/components/ProductPickerModal';

interface Props {
    clients: Pick<Client, 'id' | 'nom' | 'prenom'>[];
    produits: ProduitPickerItem[];
}

interface Item {
    produit_id: number;
    nom: string;
    quantite: number;
    prix_unitaire: number;
    img: string | null;
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n);

function imgUrl(p: ProduitPickerItem): string | null {
    const path = p.images?.[0]?.image?.image_path;
    return path ? `/storage/${path}` : null;
}

export default function CommandesCreate({ clients, produits }: Props) {
    const [clientId, setClientId] = useState<string>('');
    const [clientSearch, setClientSearch] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [processing, setProcessing] = useState(false);
    const [pickerOpenFor, setPickerOpenFor] = useState<number | null>(null);
    const [clientPanelOpen, setClientPanelOpen] = useState(true);

    const filteredClients = clients.filter((c) =>
        `${c.nom} ${c.prenom ?? ''}`.toLowerCase().includes(clientSearch.toLowerCase()),
    );

    const selectedClient = clients.find((c) => String(c.id) === clientId);

    const selectProduct = (idx: number, p: ProduitPickerItem) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], produit_id: p.id, nom: p.nom, prix_unitaire: p.prix_vente ?? 0, img: imgUrl(p) };
        setItems(updated);
    };

    const updateItem = (idx: number, field: 'quantite' | 'prix_unitaire', value: number) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { produit_id: 0, nom: '', quantite: 1, prix_unitaire: 0, img: null }]);
    };
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const total = items.reduce((sum, i) => sum + i.quantite * i.prix_unitaire, 0);
    const validItems = items.filter((i) => i.produit_id > 0 && i.quantite > 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/dashboard/commandes', { client_id: clientId, items: validItems }, { onFinish: () => setProcessing(false) });
    };

    return (
        <>
            <Head title="Nouvelle commande" />

            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/dashboard/commandes"
                            className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                            <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouvelle commande</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Créer une commande manuellement</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Left column — Client + Articles */}
                            <div className="lg:col-span-2 space-y-5">

                                {/* Client card */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <button type="button"
                                        onClick={() => setClientPanelOpen(!clientPanelOpen)}
                                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                                <User className="w-4 h-4 text-[#C8962E]" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Client</p>
                                                {selectedClient && (
                                                    <p className="text-xs text-[#C8962E] font-medium">{selectedClient.nom} {selectedClient.prenom}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {selectedClient && (
                                                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Sélectionné</span>
                                            )}
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${clientPanelOpen ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {clientPanelOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-5 space-y-3">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Rechercher un client…"
                                                            value={clientSearch}
                                                            onChange={(e) => setClientSearch(e.target.value)}
                                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                                        />
                                                    </div>
                                                    <div className="max-h-52 overflow-y-auto space-y-1.5 pr-0.5">
                                                        {filteredClients.length === 0 ? (
                                                            <p className="text-center text-sm text-gray-400 py-6">Aucun client trouvé</p>
                                                        ) : filteredClients.map((c) => {
                                                            const isSelected = String(c.id) === clientId;
                                                            return (
                                                                <button
                                                                    key={c.id}
                                                                    type="button"
                                                                    onClick={() => { setClientId(String(c.id)); setClientPanelOpen(false); }}
                                                                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                                                                        isSelected
                                                                            ? 'bg-[#C8962E]/10 border border-[#C8962E]/30'
                                                                            : 'border border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                                    }`}
                                                                >
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                                                        isSelected ? 'bg-[#C8962E] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                                    }`}>
                                                                        {c.nom.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className={`text-sm font-medium ${isSelected ? 'text-[#C8962E]' : 'text-gray-700 dark:text-gray-300'}`}>
                                                                        {c.nom} {c.prenom}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <span className="ml-auto text-[#C8962E]">
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    <Link href="/dashboard/clients/creer" className="inline-flex items-center gap-1.5 text-xs text-[#C8962E] hover:underline font-medium">
                                                        <Plus className="w-3 h-3" /> Créer un nouveau client
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Articles card */}
                                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                                <Package className="w-4 h-4 text-[#C8962E]" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Articles</p>
                                                {items.length > 0 && (
                                                    <p className="text-xs text-gray-500">{items.length} article{items.length > 1 ? 's' : ''}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button type="button" onClick={addItem}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8962E]/10 text-[#C8962E] text-xs font-semibold hover:bg-[#C8962E]/20 transition-colors">
                                            <Plus className="w-3.5 h-3.5" /> Ajouter
                                        </button>
                                    </div>

                                    <div className="p-5">
                                        {items.length === 0 ? (
                                            <button type="button" onClick={addItem}
                                                className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl py-12 flex flex-col items-center justify-center gap-3 hover:border-[#C8962E]/40 hover:bg-[#C8962E]/5 transition-all group">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 group-hover:bg-[#C8962E]/10 flex items-center justify-center transition-colors">
                                                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#C8962E] transition-colors" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-medium text-gray-500 group-hover:text-[#C8962E] transition-colors">Ajouter des articles</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Cliquez pour commencer</p>
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="space-y-3">
                                                <AnimatePresence>
                                                    {items.map((item, idx) => (
                                                        <motion.div key={idx}
                                                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                                                            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/30">
                                                                {/* Product selector */}
                                                                <button type="button" onClick={() => setPickerOpenFor(idx)}
                                                                    className={`flex items-center gap-2.5 flex-1 min-w-0 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                                                                        item.produit_id
                                                                            ? 'border-[#C8962E]/30 bg-white dark:bg-gray-900 hover:border-[#C8962E]/60'
                                                                            : 'border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 hover:border-[#C8962E]/40'
                                                                    }`}>
                                                                    {item.produit_id ? (
                                                                        <>
                                                                            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                                                                                {item.img
                                                                                    ? <img src={item.img} alt={item.nom} className="w-full h-full object-cover" />
                                                                                    : <Package className="w-4 h-4 text-gray-400" />
                                                                                }
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.nom}</p>
                                                                                <p className="text-[10px] text-[#C8962E] font-bold mt-0.5">{fmtGnf(item.prix_unitaire)} GNF</p>
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

                                                                {/* Qty */}
                                                                <div className="shrink-0 text-center">
                                                                    <p className="text-[10px] text-gray-400 mb-1 font-medium">Qté</p>
                                                                    <input type="number" min={1} value={item.quantite}
                                                                        onChange={(e) => updateItem(idx, 'quantite', Number(e.target.value))}
                                                                        className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-2 text-sm text-center focus:border-[#C8962E] focus:outline-none transition-all"
                                                                    />
                                                                </div>

                                                                {/* Prix unitaire */}
                                                                <div className="shrink-0 text-center">
                                                                    <p className="text-[10px] text-gray-400 mb-1 font-medium">Prix unit.</p>
                                                                    <input type="number" min={0} value={item.prix_unitaire}
                                                                        onChange={(e) => updateItem(idx, 'prix_unitaire', Number(e.target.value))}
                                                                        className="w-28 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-2 text-sm text-right focus:border-[#C8962E] focus:outline-none transition-all"
                                                                    />
                                                                </div>

                                                                <button type="button" onClick={() => removeItem(idx)}
                                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            {item.produit_id > 0 && (
                                                                <div className="px-4 py-2 bg-[#C8962E]/5 border-t border-[#C8962E]/10 flex items-center justify-between">
                                                                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Sous-total</span>
                                                                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                                                                        {fmtGnf(item.quantite * item.prix_unitaire)} GNF
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>

                                                <button type="button" onClick={addItem}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-500 hover:border-[#C8962E]/40 hover:text-[#C8962E] hover:bg-[#C8962E]/5 transition-all">
                                                    <Plus className="w-3.5 h-3.5" /> Ajouter un article
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right column — Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-4">

                                    {/* Order summary */}
                                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                                        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                                <Receipt className="w-4 h-4 text-[#C8962E]" />
                                            </div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Récapitulatif</p>
                                        </div>

                                        <div className="p-5">
                                            {/* Client row */}
                                            <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-xs text-gray-500">Client</span>
                                                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                                    {selectedClient ? `${selectedClient.nom} ${selectedClient.prenom ?? ''}` : <span className="text-gray-400 font-normal">Non sélectionné</span>}
                                                </span>
                                            </div>

                                            {/* Items list */}
                                            {validItems.length > 0 ? (
                                                <div className="mt-3 space-y-2">
                                                    {validItems.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-400 shrink-0">{item.quantite}</span>
                                                                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{item.nom}</span>
                                                            </div>
                                                            <span className="text-xs font-semibold text-gray-900 dark:text-white shrink-0">{fmtGnf(item.quantite * item.prix_unitaire)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-xs text-gray-400 py-6">Aucun article ajouté</p>
                                            )}

                                            {/* Total */}
                                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                                                    <div className="text-right">
                                                        <span className="text-xl font-black text-[#C8962E]">{fmtGnf(total)}</span>
                                                        <span className="text-xs text-gray-500 ml-1">GNF</span>
                                                    </div>
                                                </div>
                                                {validItems.length > 0 && (
                                                    <p className="text-xs text-gray-400 mt-1 text-right">{validItems.length} article{validItems.length > 1 ? 's' : ''}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2.5">
                                        <button type="submit"
                                            disabled={processing || validItems.length === 0 || !clientId}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#C8962E]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                            <ShoppingCart className="w-4 h-4" />
                                            {processing ? 'Création en cours…' : 'Créer la commande'}
                                        </button>
                                        <Link href="/dashboard/commandes"
                                            className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            Annuler
                                        </Link>
                                    </div>

                                    {/* Validation hints */}
                                    {(!clientId || validItems.length === 0) && (
                                        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-3 space-y-1.5">
                                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Requis avant de soumettre</p>
                                            {!clientId && (
                                                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500">
                                                    <X className="w-3 h-3 shrink-0" /> Sélectionner un client
                                                </div>
                                            )}
                                            {validItems.length === 0 && (
                                                <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500">
                                                    <X className="w-3 h-3 shrink-0" /> Ajouter au moins un article
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Product picker */}
            <AnimatePresence>
                {pickerOpenFor !== null && (
                    <ProductPickerModal
                        open={true}
                        produits={produits}
                        selectedId={items[pickerOpenFor]?.produit_id || null}
                        onSelect={(p) => selectProduct(pickerOpenFor!, p)}
                        onClose={() => setPickerOpenFor(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

CommandesCreate.layout = {
    breadcrumbs: [
        { title: 'Commandes', href: '/dashboard/commandes' },
        { title: 'Nouvelle', href: '/dashboard/commandes/creer' },
    ],
};
