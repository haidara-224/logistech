import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ChevronDown, Package, Plus, Search, ShoppingCart, Trash2, User } from 'lucide-react';
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

function imgUrl(p: ProduitPickerItem): string | null {
    const path = p.images?.[0]?.image?.image_path;
    return path ? `/storage/${path}` : null;
}

export default function CommandesCreate({ clients, produits }: Props) {
    const [clientId, setClientId] = useState('');
    const [clientSearch, setClientSearch] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [processing, setProcessing] = useState(false);
    const [pickerOpenFor, setPickerOpenFor] = useState<number | null>(null);

    const filteredClients = clients.filter((c) =>
        `${c.nom} ${c.prenom ?? ''}`.toLowerCase().includes(clientSearch.toLowerCase()),
    );

    const selectProduct = (idx: number, p: ProduitPickerItem) => {
        const updated = [...items];
        updated[idx] = {
            ...updated[idx],
            produit_id: p.id,
            nom: p.nom,
            prix_unitaire: p.prix_vente ?? 0,
            img: imgUrl(p),
        };
        setItems(updated);
    };

    const updateItem = (idx: number, field: 'quantite' | 'prix_unitaire', value: number) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setItems(updated);
    };

    const addItem = () => setItems([...items, { produit_id: 0, nom: '', quantite: 1, prix_unitaire: 0, img: null }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    const total = items.reduce((sum, i) => sum + i.quantite * i.prix_unitaire, 0);
    const validItems = items.filter((i) => i.produit_id > 0 && i.quantite > 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/commandes', { client_id: clientId, items: validItems }, { onFinish: () => setProcessing(false) });
    };

    return (
        <>
            <Head title="Nouvelle commande" />
            <div className="px-6 py-6 max-w-3xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/commandes" className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">Nouvelle commande</h1>
                        <p className="text-xs text-gray-500">Créer une commande manuelle</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Client */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-[#C8962E]" />
                            <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Client</h2>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un client…"
                                    value={clientSearch}
                                    onChange={(e) => setClientSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                />
                            </div>
                            <select
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                required
                                size={Math.min(5, filteredClients.length + 1)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-1 px-3 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                            >
                                <option value="">— Choisir —</option>
                                {filteredClients.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                                ))}
                            </select>
                            <Link href="/clients/creer" className="inline-block text-xs text-[#C8962E] hover:underline">+ Créer un nouveau client</Link>
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-[#C8962E]" />
                                <h2 className="font-semibold text-sm text-gray-900 dark:text-white">Articles</h2>
                                {items.length > 0 && (
                                    <span className="text-xs bg-[#C8962E]/10 text-[#C8962E] px-2 py-0.5 rounded-full font-semibold">{items.length}</span>
                                )}
                            </div>
                            <button type="button" onClick={addItem}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[#C8962E] hover:text-[#E8B84B] transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Ajouter un article
                            </button>
                        </div>

                        <div className="p-5 space-y-3">
                            {items.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <Package className="w-10 h-10 text-gray-200 dark:text-gray-700 mb-2" />
                                    <p className="text-sm text-gray-400">Cliquez sur "Ajouter un article" pour commencer</p>
                                </div>
                            )}

                            <AnimatePresence>
                                {items.map((item, idx) => (
                                    <motion.div key={idx}
                                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                                        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 overflow-hidden">
                                        <div className="flex items-center gap-3 p-3">
                                            {/* Product selector button */}
                                            <button type="button" onClick={() => setPickerOpenFor(idx)}
                                                className={`flex items-center gap-2.5 flex-1 min-w-0 rounded-lg border-2 px-3 py-2 text-left transition-all hover:border-[#C8962E]/50 ${
                                                    item.produit_id ? 'border-[#C8962E]/30 bg-white dark:bg-gray-900' : 'border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                                                }`}>
                                                {item.produit_id ? (
                                                    <>
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                                                            {item.img
                                                                ? <img src={item.img} alt={item.nom} className="w-full h-full object-cover" />
                                                                : <Package className="w-4 h-4 text-gray-400" />
                                                            }
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.nom}</p>
                                                            <p className="text-[10px] text-[#C8962E] font-bold">{item.prix_unitaire.toLocaleString()} GNF</p>
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
                                            <div className="shrink-0">
                                                <p className="text-[10px] text-gray-500 mb-1 text-center">Qté</p>
                                                <input type="number" min={1} value={item.quantite}
                                                    onChange={(e) => updateItem(idx, 'quantite', Number(e.target.value))}
                                                    className="w-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-2 text-sm text-center focus:border-[#C8962E] focus:outline-none transition-all"
                                                />
                                            </div>

                                            {/* Prix unitaire */}
                                            <div className="shrink-0">
                                                <p className="text-[10px] text-gray-500 mb-1 text-center">Prix unit.</p>
                                                <input type="number" min={0} value={item.prix_unitaire}
                                                    onChange={(e) => updateItem(idx, 'prix_unitaire', Number(e.target.value))}
                                                    className="w-28 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-2 text-sm text-right focus:border-[#C8962E] focus:outline-none transition-all"
                                                />
                                            </div>

                                            <button type="button" onClick={() => removeItem(idx)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        {item.produit_id > 0 && (
                                            <div className="px-4 py-2 bg-[#C8962E]/5 border-t border-[#C8962E]/10 flex justify-end">
                                                <span className="text-xs text-gray-500">Sous-total :{' '}
                                                    <span className="font-bold text-gray-900 dark:text-white">{(item.quantite * item.prix_unitaire).toLocaleString()} GNF</span>
                                                </span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {validItems.length > 0 && (
                                <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-800">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Total estimé</p>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                                            {total.toLocaleString('fr-FR')} <span className="text-sm font-normal text-gray-500">GNF</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Link href="/commandes"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center text-sm">
                            Annuler
                        </Link>
                        <button type="submit" disabled={processing || validItems.length === 0 || !clientId}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                            <ShoppingCart className="w-4 h-4" />
                            {processing ? 'Création…' : 'Créer la commande'}
                        </button>
                    </div>
                </form>

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
            </div>
        </>
    );
}

CommandesCreate.layout = {
    breadcrumbs: [
        { title: 'Commandes', href: '/commandes' },
        { title: 'Nouvelle', href: '/commandes/creer' },
    ],
};
