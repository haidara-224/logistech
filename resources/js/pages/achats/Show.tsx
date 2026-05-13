import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, CheckCircle, ClipboardCheck, FileText, Package, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { Achat } from '@/types/models';
import { fmtGnf } from '@/lib/utils';

interface Props { achat: Achat }

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statutColors: Record<string, string> = {
    brouillon: 'bg-gray-100 text-gray-600',
    valide: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
};

const statutLabels: Record<string, string> = {
    brouillon: 'Brouillon',
    valide: 'Validé',
    annule: 'Annulé',
};

export default function AchatShow({ achat }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.info) toast.info(flash.info);
    }, [flash]);

    const items = achat.items ?? [];
    const hasPrixChange = items.some((i) => (i.ancien_prix_achat ?? 0) > 0 && i.nouveau_prix_moyen != null && i.ancien_prix_achat !== i.nouveau_prix_moyen);

    return (
        <>
            <Head title={`Achat ${achat.numero_achat}`} />

            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <Link href="/dashboard/achats"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux achats
                </Link>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutColors[achat.statut ?? 'brouillon'] ?? statutColors.brouillon}`}>
                        {statutLabels[achat.statut ?? 'brouillon'] ?? achat.statut}
                    </span>
                    {achat.statut === 'brouillon' && (
                        <button
                            onClick={() => router.post(`/dashboard/achats/${achat.id}/valider`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            Valider l'achat
                        </button>
                    )}
                    {achat.statut === 'valide' && !achat.facture && (
                        <button
                            onClick={() => router.post(`/dashboard/achats/${achat.id}/facture`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition-colors">
                            <FileText className="w-4 h-4" />
                            Générer facture
                        </button>
                    )}
                    {achat.facture && (
                        <Link href={`/dashboard/factures/${achat.facture.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <FileText className="w-4 h-4" />
                            Voir facture
                        </Link>
                    )}
                    {achat.bon_reception ? (
                        <Link href={`/dashboard/bons-reception/${achat.bon_reception.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400 text-sm font-semibold hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                            <ClipboardCheck className="w-4 h-4" />
                            Voir BR
                        </Link>
                    ) : (
                        <button
                            onClick={() => router.post(`/dashboard/achats/${achat.id}/br/generer`)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors">
                            <ClipboardCheck className="w-4 h-4" />
                            Générer BR
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

                {/* Header cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Numéro</p>
                        <p className="text-lg font-black font-mono text-gray-900 dark:text-white">{achat.numero_achat}</p>
                        <p className="text-xs text-gray-400 mt-1">{fmtDate(achat.date_achat)}</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Fournisseur</p>
                        {achat.fournisseur ? (
                            <Link href={`/dashboard/fournisseurs/${achat.fournisseur.id}`}
                                className="text-base font-semibold text-purple-600 hover:underline">
                                {achat.fournisseur.nom}
                            </Link>
                        ) : (
                            <p className="text-base font-semibold text-gray-400">—</p>
                        )}
                    </div>
                    <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Total TTC</p>
                        <p className="text-2xl font-black text-purple-700 dark:text-purple-400">{fmtGnf(achat.montant_total_avec_frais)} <span className="text-sm font-semibold">GNF</span></p>
                    </div>
                </div>

                {/* PMP comparison table — only if prices changed */}
                {hasPrixChange && (
                    <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 overflow-hidden">
                        <div className="px-5 py-4 border-b border-amber-200 dark:border-amber-800/40 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Recalcul du Prix Moyen Pondéré (PMP)</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-amber-100/60 dark:bg-amber-950/40">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-amber-700 uppercase tracking-wider">Produit</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-amber-700 uppercase tracking-wider">Ancien prix</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-amber-700 uppercase tracking-wider">Prix achat</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-amber-700 uppercase tracking-wider">Nouveau PMP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-100 dark:divide-amber-800/30">
                                    {items.filter((i) => i.nouveau_prix_moyen != null && i.ancien_prix_achat !== i.nouveau_prix_moyen).map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? `Produit #${item.produit_id}`}</td>
                                            <td className="px-5 py-3 text-right text-gray-500">{fmtGnf(item.ancien_prix_achat)} GNF</td>
                                            <td className="px-5 py-3 text-right text-gray-700 dark:text-gray-300">{fmtGnf(item.prix_achat_unitaire)} GNF</td>
                                            <td className="px-5 py-3 text-right font-bold text-amber-700 dark:text-amber-400">{fmtGnf(item.nouveau_prix_moyen)} GNF</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {achat.statut === 'brouillon' && (
                            <p className="px-5 py-3 text-xs text-amber-600 dark:text-amber-500">Le PMP sera appliqué sur les produits lors de la validation de l'achat.</p>
                        )}
                    </div>
                )}

                {/* Articles */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <Package className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Articles</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qté</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix unit.</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? `Produit #${item.produit_id}`}</td>
                                        <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{item.produit?.sku ?? '—'}</td>
                                        <td className="px-5 py-3.5 text-center font-semibold">{item.quantite}</td>
                                        <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400">{fmtGnf(item.prix_achat_unitaire)} GNF</td>
                                        <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(item.prix_total)} GNF</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <td colSpan={4} className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Sous-total</td>
                                    <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(achat.montant_total)} GNF</td>
                                </tr>
                                {(achat.frais_transport ?? 0) > 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-2 text-right text-xs text-blue-600 font-medium flex items-center justify-end gap-1">
                                            <Truck className="w-3 h-3" /> Frais de transport
                                        </td>
                                        <td className="px-5 py-2 text-right text-sm text-blue-600 font-medium">+ {fmtGnf(achat.frais_transport)} GNF</td>
                                    </tr>
                                )}
                                {(achat.droits_douane ?? 0) > 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-2 text-right text-xs text-orange-600 font-medium">Droits de douane</td>
                                        <td className="px-5 py-2 text-right text-sm text-orange-600 font-medium">+ {fmtGnf(achat.droits_douane)} GNF</td>
                                    </tr>
                                )}
                                <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                                    <td colSpan={4} className="px-5 py-3 text-right text-sm font-bold text-gray-900 dark:text-white">Total TTC</td>
                                    <td className="px-5 py-3 text-right text-lg font-black text-purple-700 dark:text-purple-400">{fmtGnf(achat.montant_total_avec_frais)} GNF</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {achat.notes && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{achat.notes}</p>
                    </div>
                )}
            </div>
        </>
    );
}
