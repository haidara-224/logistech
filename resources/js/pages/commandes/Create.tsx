import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ShoppingCart, Package, User } from 'lucide-react';
import { Client, Produit } from '@/types/models';

interface Props {
    clients: Pick<Client, 'id' | 'nom' | 'prenom'>[];
    produits: Pick<Produit, 'id' | 'nom' | 'prix_vente' | 'quantite_stock'>[];
}

interface Item {
    produit_id: number;
    quantite: number;
    prix_unitaire: number;
}

export default function CommandesCreate({ clients, produits }: Props) {
    const [clientId, setClientId] = useState('');
    const [items, setItems] = useState<Item[]>([{ produit_id: 0, quantite: 1, prix_unitaire: 0 }]);
    const [processing, setProcessing] = useState(false);

    const updateItem = (idx: number, field: keyof Item, value: number) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };

        if (field === 'produit_id') {
            const produit = produits.find((p) => p.id === value);
            if (produit) {
                updated[idx].prix_unitaire = produit.prix_vente ?? 0;
            }
        }

        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { produit_id: 0, quantite: 1, prix_unitaire: 0 }]);
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const total = items.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0);
    const validItems = items.filter((i) => i.produit_id > 0 && i.quantite > 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/commandes', {
            client_id: clientId,
            items: validItems,
        }, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Nouvelle commande" />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link href="/commandes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux commandes
                </Link>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Client */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="h-5 w-5 text-[#C8962E]" />
                                Client
                            </h2>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Sélectionner un client *
                            </label>
                            <select
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                required
                            >
                                <option value="">— Choisir un client —</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nom} {c.prenom}
                                    </option>
                                ))}
                            </select>
                            <Link href="/clients/creer" className="inline-block mt-2 text-xs text-[#C8962E] hover:text-[#E8B84B] transition-colors">
                                + Créer un nouveau client
                            </Link>
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="h-5 w-5 text-[#C8962E]" />
                                Articles
                            </h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center gap-1.5 text-sm text-[#C8962E] hover:text-[#E8B84B] font-medium transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {items.length === 0 && (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                                    Cliquez sur "Ajouter" pour ajouter un article.
                                </p>
                            )}

                            {items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-3 items-end p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <div className="col-span-5">
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Produit</label>
                                        <select
                                            value={item.produit_id}
                                            onChange={(e) => updateItem(idx, 'produit_id', Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-sm focus:border-[#C8962E] focus:outline-none transition-all"
                                            required
                                        >
                                            <option value={0}>— Produit —</option>
                                            {produits.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nom} ({p.quantite_stock} dispo)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Qté</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.quantite}
                                            onChange={(e) => updateItem(idx, 'quantite', Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-sm focus:border-[#C8962E] focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Prix unit. (GNF)</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={item.prix_unitaire}
                                            onChange={(e) => updateItem(idx, 'prix_unitaire', Number(e.target.value))}
                                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 px-3 text-sm focus:border-[#C8962E] focus:outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {item.produit_id > 0 && (
                                        <div className="col-span-12 text-right text-xs text-gray-500 dark:text-gray-400">
                                            Sous-total : <span className="font-semibold text-gray-900 dark:text-white">{(item.quantite * item.prix_unitaire).toLocaleString()} GNF</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {items.length > 0 && (
                                <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-800">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Total estimé</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {total.toLocaleString()} <span className="text-sm font-normal text-gray-500">GNF</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <Link href="/commandes" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center text-sm">
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || validItems.length === 0}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {processing ? 'Création...' : 'Créer la commande'}
                        </button>
                    </div>
                </form>
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
