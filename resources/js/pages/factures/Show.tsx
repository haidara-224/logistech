import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, CreditCard, Printer, Receipt, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Facture } from '@/types/models';
import { fmtGnf } from '@/lib/utils';

interface Props { facture: Facture }

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statutConfig: Record<string, { label: string; color: string }> = {
    brouillon: { label: 'Brouillon', color: 'bg-gray-100 text-gray-600' },
    emise:     { label: 'Émise',    color: 'bg-blue-100 text-blue-700' },
    payee:     { label: 'Payée',    color: 'bg-green-100 text-green-700' },
};

export default function FactureShow({ facture }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('print') === '1') {
            setTimeout(() => window.print(), 600);
        }
    }, []);

    const isAchat = facture.type === 'achat';
    const sousTotal = Number(facture.montant_total ?? 0);
    const fraisTransport = Number(facture.frais_transport ?? 0);
    const droitsDouane = Number(facture.droits_douane ?? 0);
    const totalAvecFrais = sousTotal + fraisTransport + droitsDouane;
    const statutCfg = statutConfig[facture.statut ?? 'emise'] ?? statutConfig.emise;

    const backHref = isAchat
        ? (facture.achat ? `/dashboard/achats/${facture.achat.id}` : '/dashboard/achats')
        : '/dashboard/factures';

    return (
        <>
            <Head title={`Facture ${facture.numero_facture}`} />

            {/* Toolbar */}
            <div className="print:hidden px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <Link href={backHref}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    {isAchat ? "Retour à l'achat" : 'Retour aux factures'}
                </Link>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutCfg.color}`}>
                        {statutCfg.label}
                    </span>
                    {facture.statut !== 'payee' && (
                        <Link
                            href={`/dashboard/factures/${facture.id}/paiement/creer`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" />
                            Enregistrer paiement
                        </Link>
                    )}
                    <button onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8962E] text-white text-sm font-semibold hover:bg-[#b07a20] transition-colors">
                        <Printer className="w-4 h-4" />
                        Imprimer / PDF
                    </button>
                </div>
            </div>

            {/* Document */}
            <div className="max-w-3xl mx-auto px-6 py-10 print:py-0 print:px-0">

                {/* Header */}
                <div className="flex items-start justify-between mb-10 pb-8 border-b-2 border-[#C8962E]">
                    <div>
                        <h1 className="text-3xl font-black text-[#C8962E] tracking-tight">LOGISTECH</h1>
                        <p className="text-sm text-gray-500 mt-1">Système de gestion intégré</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 bg-[#C8962E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            {isAchat ? <ShoppingBag className="w-3 h-3" /> : <Receipt className="w-3 h-3" />}
                            {isAchat ? 'Facture fournisseur' : 'Facture'}
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{facture.numero_facture}</p>
                        <p className="text-sm text-gray-500 mt-1">Émise le {fmtDate(facture.date_emission)}</p>
                        {isAchat && facture.achat && (
                            <p className="text-xs text-gray-400 mt-0.5">Achat {facture.achat.numero_achat}</p>
                        )}
                        {!isAchat && facture.commande && (
                            <p className="text-xs text-gray-400 mt-0.5">Commande #{facture.commande.id}</p>
                        )}
                    </div>
                </div>

                {/* Party (client or fournisseur) */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        {isAchat ? 'Fournisseur' : 'Facturé à'}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                        {isAchat ? (
                            facture.achat?.fournisseur ? (
                                <>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{facture.achat.fournisseur.nom}</p>
                                    {facture.achat.fournisseur.email && <p className="text-sm text-gray-500 mt-1">{facture.achat.fournisseur.email}</p>}
                                    {facture.achat.fournisseur.telephone && <p className="text-sm text-gray-500">{facture.achat.fournisseur.telephone}</p>}
                                    {facture.achat.fournisseur.adresse && <p className="text-sm text-gray-500">{facture.achat.fournisseur.adresse}</p>}
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm">Fournisseur non renseigné</p>
                            )
                        ) : (
                            (() => {
                                const client = facture.commande?.client;
                                const name = client ? `${client.nom}${client.prenom ? ' ' + client.prenom : ''}` : 'Client anonyme';
                                return (
                                    <>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">{name}</p>
                                        {client?.email && <p className="text-sm text-gray-500 mt-1">{client.email}</p>}
                                        {client?.telephone && <p className="text-sm text-gray-500">{client.telephone}</p>}
                                    </>
                                );
                            })()
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                        {isAchat ? 'Articles achetés' : 'Détail de la commande'}
                    </p>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qté</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {isAchat ? "Prix d'achat unit." : 'Prix unit.'}
                                    </th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {isAchat
                                    ? (facture.achat?.items ?? []).map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? '—'}</p>
                                                {item.produit?.sku && <p className="text-xs text-gray-400 font-mono">{item.produit.sku}</p>}
                                            </td>
                                            <td className="px-5 py-3.5 text-center text-gray-600 dark:text-gray-400">{item.quantite}</td>
                                            <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400">{fmtGnf(item.prix_achat_unitaire)} GNF</td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(item.prix_total)} GNF</td>
                                        </tr>
                                    ))
                                    : (facture.commande?.items ?? []).map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? '—'}</p>
                                                {item.produit?.sku && <p className="text-xs text-gray-400 font-mono">{item.produit.sku}</p>}
                                            </td>
                                            <td className="px-5 py-3.5 text-center text-gray-600 dark:text-gray-400">{item.quantite}</td>
                                            <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400">{fmtGnf(item.prix_unitaire)} GNF</td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(item.prix_total)} GNF</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                            <tfoot>
                                <tr className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
                                    <td colSpan={3} className="px-5 py-2 text-right text-xs text-gray-500">Sous-total articles</td>
                                    <td className="px-5 py-2 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">{fmtGnf(sousTotal)} GNF</td>
                                </tr>
                                {fraisTransport > 0 && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/30">
                                        <td colSpan={3} className="px-5 py-2 text-right text-xs text-blue-600 dark:text-blue-400">Frais de transport</td>
                                        <td className="px-5 py-2 text-right text-sm text-blue-600 dark:text-blue-400">+ {fmtGnf(fraisTransport)} GNF</td>
                                    </tr>
                                )}
                                {droitsDouane > 0 && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/30">
                                        <td colSpan={3} className="px-5 py-2 text-right text-xs text-orange-600 dark:text-orange-400">Droits de douane</td>
                                        <td className="px-5 py-2 text-right text-sm text-orange-600 dark:text-orange-400">+ {fmtGnf(droitsDouane)} GNF</td>
                                    </tr>
                                )}
                                <tr className="bg-amber-50 dark:bg-[#C8962E]/10 border-t-2 border-[#C8962E]/20">
                                    <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-900 dark:text-white">
                                        {isAchat ? 'Montant à payer au fournisseur' : 'Total à payer'}
                                    </td>
                                    <td className="px-5 py-4 text-right font-black text-xl text-[#C8962E]">{fmtGnf(totalAvecFrais)} GNF</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Paiements enregistrés */}
                {(facture.paiements ?? []).length > 0 && (
                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Paiements enregistrés</p>
                        <div className="space-y-2">
                            {(facture.paiements ?? []).map((p) => (
                                <div key={p.id} className="flex items-center justify-between px-5 py-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-100 dark:border-green-900/30">
                                    <div>
                                        <p className="text-sm font-medium text-green-800 dark:text-green-400">{fmtGnf(p.montant)} GNF</p>
                                        <p className="text-xs text-green-600 dark:text-green-500">
                                            {p.mode_paiement ?? '—'}{p.date_paiement ? ` · ${fmtDate(p.date_paiement)}` : ''}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'effectue' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {p.status === 'effectue' ? 'Effectué' : p.status ?? '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Notes */}
                {facture.notes && (
                    <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{facture.notes}</p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 text-[#C8962E]" />
                        <span className="font-semibold text-gray-500 dark:text-gray-400">LOGISTECH</span>
                    </div>
                    <p>{isAchat ? 'Facture fournisseur — à conserver' : 'Merci pour votre confiance'}</p>
                </div>
            </div>
        </>
    );
}
