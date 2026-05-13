import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, ShoppingCart, User, Package, Calendar, CheckCircle, Clock, XCircle, Truck, FileText, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { Commande } from '@/types/models';
import { fmtGnf } from '@/lib/utils';

interface BonLivraison { id: number; numero_bl: string; statut: string; date_emission: string | null }
interface Facture { id: number; numero_facture: string; statut: string; montant_total: number }

interface Props {
    commande: Commande & {
        factures?: Facture[];
        bon_livraison?: BonLivraison | null;
    };
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    en_attente: { label: 'En attente', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', icon: Clock },
    payer: { label: 'Payée', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
    livree: { label: 'Livrée', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: Truck },
    annulee: { label: 'Annulée', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
};

export default function CommandesShow({ commande }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.info) toast.info(flash.info);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const cfg = statusConfig[commande.status ?? 'en_attente'] ?? statusConfig.en_attente;
    const StatusIcon = cfg.icon;
    const items = commande.items ?? [];

    const facture = commande.factures?.[0] ?? null;
    const bonLivraison = commande.bon_livraison ?? null;

    const fraisTransport = Number(commande.frais_transport ?? 0);
    const droitsDouane = Number(commande.droits_douane ?? 0);
    const sousTotal = Number(commande.montant_total ?? 0);
    const totalAvecFrais = sousTotal + fraisTransport + droitsDouane;

    const handleGenerateFacture = () => {
        router.post(`/dashboard/commandes/${commande.id}/factures/generer`);
    };

    const handleGenerateBL = () => {
        router.post(`/dashboard/commandes/${commande.id}/bl/generer`);
    };

    return (
        <>
            <Head title={`Commande #${commande.id}`} />
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/commandes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Link>
                </div>

                {/* Header */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <ShoppingCart className="h-6 w-6 text-[#C8962E]" />
                                Commande #{commande.id}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {commande.created_at ? new Date(commande.created_at).toLocaleDateString('fr-FR', { dateStyle: 'long' }) : '—'}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {cfg.label}
                            </span>

                            {/* Générer facture si pas encore générée */}
                            {!facture ? (
                                <button
                                    onClick={handleGenerateFacture}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold hover:shadow-lg transition-all"
                                >
                                    <FileText className="h-4 w-4" />
                                    Générer facture
                                </button>
                            ) : (
                                <Link
                                    href={`/dashboard/factures/${facture.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#C8962E] text-[#C8962E] text-sm font-semibold hover:bg-[#C8962E]/5 transition-all"
                                >
                                    <FileText className="h-4 w-4" />
                                    Voir facture {facture.statut === 'payee' ? '✓' : ''}
                                </Link>
                            )}

                            {/* Générer BL */}
                            {!bonLivraison ? (
                                <button
                                    onClick={handleGenerateBL}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    Générer BL
                                </button>
                            ) : (
                                <Link
                                    href={`/dashboard/bons-livraison/${bonLivraison.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-600 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                    Voir BL
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Client */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Client
                        </h2>
                        {commande.client ? (
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {commande.client.nom} {commande.client.prenom}
                                </p>
                                {commande.client.telephone && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{commande.client.telephone}</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Client non trouvé</p>
                        )}
                    </div>

                    {/* Source */}
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Source</h2>
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${commande.source === 'online' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}>
                            {commande.source === 'online' ? 'En ligne' : commande.source === 'pos' ? 'Point de vente' : '—'}
                        </span>
                    </div>

                    {/* Montant */}
                    <div className="rounded-2xl bg-linear-to-br from-[#C8962E]/10 to-[#E8B84B]/10 border border-[#C8962E]/20 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Total</h2>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {fmtGnf(totalAvecFrais)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">GNF</p>
                        {(fraisTransport > 0 || droitsDouane > 0) && (
                            <div className="mt-2 space-y-0.5 text-xs text-gray-500">
                                <p>Articles : {fmtGnf(sousTotal)} GNF</p>
                                {fraisTransport > 0 && <p>Transport : +{fmtGnf(fraisTransport)} GNF</p>}
                                {droitsDouane > 0 && <p>Douane : +{fmtGnf(droitsDouane)} GNF</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes */}
                {commande.notes && (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{commande.notes}</p>
                    </div>
                )}

                {/* Articles */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#C8962E]" />
                            Articles ({items.length})
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">Aucun article</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produit</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix unit.</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qté</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                                    <Package className="h-4 w-4 text-[#C8962E]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.produit?.nom ?? `Produit #${item.produit_id}`}</p>
                                                    {item.produit?.sku && <p className="text-xs text-gray-500">SKU: {item.produit.sku}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-600 dark:text-gray-400">
                                            {fmtGnf(Number(item.prix_unitaire))} GNF
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                                            {item.quantite}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                                            {fmtGnf(Number(item.prix_total))} GNF
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <td colSpan={3} className="px-6 py-3 text-right text-xs text-gray-500">Sous-total articles</td>
                                    <td className="px-6 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">{fmtGnf(sousTotal)} GNF</td>
                                </tr>
                                {fraisTransport > 0 && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <td colSpan={3} className="px-6 py-2 text-right text-xs text-blue-600 dark:text-blue-400">Frais de transport</td>
                                        <td className="px-6 py-2 text-right text-sm text-blue-600 dark:text-blue-400">+{fmtGnf(fraisTransport)} GNF</td>
                                    </tr>
                                )}
                                {droitsDouane > 0 && (
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <td colSpan={3} className="px-6 py-2 text-right text-xs text-orange-600 dark:text-orange-400">Droits de douane</td>
                                        <td className="px-6 py-2 text-right text-sm text-orange-600 dark:text-orange-400">+{fmtGnf(droitsDouane)} GNF</td>
                                    </tr>
                                )}
                                <tr className="border-t border-gray-200 dark:border-gray-700 bg-[#C8962E]/5">
                                    <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">Total général</td>
                                    <td className="px-6 py-4 text-right font-bold text-lg text-[#C8962E]">
                                        {fmtGnf(totalAvecFrais)} GNF
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

CommandesShow.layout = {
    breadcrumbs: [
        { title: 'Commandes', href: '/dashboard/commandes' },
        { title: 'Détails', href: '#' },
    ],
};
