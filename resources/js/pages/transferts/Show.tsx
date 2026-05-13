import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Package, Warehouse } from 'lucide-react';
import { toast } from 'sonner';
import { TransfertDepot } from '@/types/models';

interface Props { transfert: TransfertDepot }

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statutColors: Record<string, string> = {
    en_cours: 'bg-blue-100 text-blue-700',
    complete: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
};
const statutLabels: Record<string, string> = { en_cours: 'En cours', complete: 'Complété', annule: 'Annulé' };

export default function TransfertsShow({ transfert }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.info) toast.info(flash.info);
    }, [flash]);

    return (
        <>
            <Head title={`Transfert ${transfert.numero_transfert}`} />

            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <Link href="/dashboard/transferts"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux transferts
                </Link>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutColors[transfert.statut ?? 'en_cours'] ?? statutColors.en_cours}`}>
                        {statutLabels[transfert.statut ?? 'en_cours'] ?? transfert.statut}
                    </span>
                    {transfert.statut === 'en_cours' && (
                        <button
                            onClick={() => router.post(`/dashboard/transferts/${transfert.id}/completer`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            Marquer complété
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

                {/* Route card */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-2">
                                <Warehouse className="w-6 h-6 text-gray-500" />
                            </div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Source</p>
                            <p className="font-bold text-gray-900 dark:text-white">{transfert.depot_source?.nom ?? '—'}</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                                <ArrowRight className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center mx-auto mb-2">
                                <Warehouse className="w-6 h-6 text-indigo-600" />
                            </div>
                            <p className="text-xs text-indigo-400 uppercase tracking-widest font-bold mb-1">Destination</p>
                            <p className="font-bold text-indigo-700 dark:text-indigo-400">{transfert.depot_destination?.nom ?? '—'}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                        <span>Référence : <span className="font-mono font-semibold text-gray-900 dark:text-white">{transfert.numero_transfert}</span></span>
                        <span>{fmtDate(transfert.date_transfert)}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <Package className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Produits transférés</p>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantité</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {(transfert.items ?? []).map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? `Produit #${item.produit_id}`}</td>
                                    <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{item.produit?.sku ?? '—'}</td>
                                    <td className="px-5 py-3.5 text-center font-semibold text-gray-900 dark:text-white">{item.quantite}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transfert.notes && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{transfert.notes}</p>
                    </div>
                )}

                {transfert.statut === 'en_cours' && (
                    <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 p-4 text-sm text-blue-700 dark:text-blue-400">
                        Une fois complété, le stock sera déduit du dépôt source et ajouté au dépôt destination dans les mouvements de stock.
                    </div>
                )}
            </div>
        </>
    );
}
