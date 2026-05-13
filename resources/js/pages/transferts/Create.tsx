import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Plus, Save, Trash2, Warehouse } from 'lucide-react';
import { useState } from 'react';
import { Depot, Produit } from '@/types/models';

interface Props {
    depots: Pick<Depot, 'id' | 'nom'>[];
    produits: Pick<Produit, 'id' | 'nom' | 'sku' | 'quantite_stock'>[];
}

interface Item { produit_id: string; quantite: number }

export default function TransfertsCreate({ depots, produits }: Props) {
    const [form, setForm] = useState({ depot_source_id: '', depot_destination_id: '', notes: '' });
    const [items, setItems] = useState<Item[]>([{ produit_id: '', quantite: 1 }]);
    const [processing, setProcessing] = useState(false);

    const addItem = () => setItems([...items, { produit_id: '', quantite: 1 }]);
    const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
    const updateItem = (idx: number, field: keyof Item, value: string | number) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [field]: value };
        setItems(updated);
    };

    const validItems = items.filter((i) => i.produit_id && i.quantite > 0);
    const canSubmit = form.depot_source_id && form.depot_destination_id && form.depot_source_id !== form.depot_destination_id && validItems.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setProcessing(true);
        router.post(
            '/dashboard/transferts',
            {
                depot_source_id: form.depot_source_id,
                depot_destination_id: form.depot_destination_id,
                notes: form.notes || null,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items: validItems as any,
            },
            { onFinish: () => setProcessing(false) },
        );
    };

    const sourceDepot = depots.find((d) => String(d.id) === form.depot_source_id);
    const destDepot = depots.find((d) => String(d.id) === form.depot_destination_id);

    return (
        <>
            <Head title="Nouveau transfert" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-4">
                <Link href="/dashboard/transferts"
                    className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau transfert</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Déplacer du stock entre deux dépôts</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Dépôts */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Warehouse className="w-4 h-4 text-indigo-600" />
                            Dépôts
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Source</label>
                                <select value={form.depot_source_id}
                                    onChange={(e) => setForm({ ...form, depot_source_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-all">
                                    <option value="">Choisir le dépôt source…</option>
                                    {depots.map((d) => <option key={d.id} value={String(d.id)}>{d.nom}</option>)}
                                </select>
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Destination</label>
                                <select value={form.depot_destination_id}
                                    onChange={(e) => setForm({ ...form, depot_destination_id: e.target.value })}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-all">
                                    <option value="">Choisir le dépôt destination…</option>
                                    {depots.filter((d) => String(d.id) !== form.depot_source_id).map((d) => (
                                        <option key={d.id} value={String(d.id)}>{d.nom}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {sourceDepot && destDepot && (
                            <p className="mt-3 text-xs text-indigo-600 font-medium text-center">
                                {sourceDepot.nom} → {destDepot.nom}
                            </p>
                        )}
                    </div>

                    {/* Produits */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Produits à transférer</p>
                            <button type="button" onClick={addItem}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Ajouter
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex items-end gap-3">
                                    <div className="flex-1">
                                        {idx === 0 && <label className="block text-xs font-medium text-gray-500 mb-1.5">Produit</label>}
                                        <select value={item.produit_id}
                                            onChange={(e) => updateItem(idx, 'produit_id', e.target.value)}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-all">
                                            <option value="">Choisir un produit…</option>
                                            {produits.map((p) => (
                                                <option key={p.id} value={String(p.id)}>
                                                    {p.nom} — stock: {p.quantite_stock}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-24">
                                        {idx === 0 && <label className="block text-xs font-medium text-gray-500 mb-1.5">Quantité</label>}
                                        <input type="number" min={1} value={item.quantite}
                                            onChange={(e) => updateItem(idx, 'quantite', Number(e.target.value))}
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm text-center focus:outline-none focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    {items.length > 1 && (
                                        <button type="button" onClick={() => removeItem(idx)}
                                            className="mb-0.5 w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Notes</label>
                        <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Observations…"
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing || !canSubmit}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Save className="w-4 h-4" />
                            {processing ? 'Création…' : 'Créer le transfert'}
                        </button>
                        <Link href="/dashboard/transferts"
                            className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

TransfertsCreate.layout = {
    breadcrumbs: [
        { title: 'Transferts', href: '/dashboard/transferts' },
        { title: 'Nouveau', href: '/dashboard/transferts/creer' },
    ],
};
