import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, ShoppingCart, User, Package, Calendar, CheckCircle, Clock, XCircle, Truck, DollarSign, CreditCard } from 'lucide-react';
import { Commande } from '@/types/models';

interface Props {
    commande: Commande;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    en_attente: { label: 'En attente', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', icon: Clock },
    payer: { label: 'Payée', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
    livree: { label: 'Livrée', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: Truck },
    annulee: { label: 'Annulée', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
};

export default function CommandesShow({ commande }: Props) {
    const cfg = statusConfig[commande.status ?? 'en_attente'] ?? statusConfig.en_attente;
    const StatusIcon = cfg.icon;
    const items = commande.items ?? [];

    return (
        <>
            <Head title={`Commande #${commande.id}`} />
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/commandes" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Retour
                    </Link>
                </div>

                {/* Header card */}
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
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${cfg.color}`}>
                                <StatusIcon className="h-4 w-4" />
                                {cfg.label}
                            </span>
                            {commande.status === 'en_attente' && (
                                <Link
                                    href={`/commandes/${commande.id}/paiements/creer`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white text-sm font-semibold hover:shadow-lg transition-all"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    Enregistrer paiement
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
                                <Link href={`/clients/${commande.client.id}`} className="inline-block mt-2 text-xs text-[#C8962E] hover:text-[#E8B84B] transition-colors font-medium">
                                    Voir le client →
                                </Link>
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
                    <div className="rounded-2xl bg-gradient-to-br from-[#C8962E]/10 to-[#E8B84B]/10 border border-[#C8962E]/20 shadow-sm p-5">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total
                        </h2>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {commande.montant_total?.toLocaleString() ?? '—'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">GNF</p>
                    </div>
                </div>

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
                                            {Number(item.prix_unitaire).toLocaleString()} GNF
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-white">
                                            {item.quantite}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                                            {Number(item.prix_total).toLocaleString()} GNF
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <td colSpan={3} className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Total</td>
                                    <td className="px-6 py-4 text-right font-bold text-lg text-gray-900 dark:text-white">
                                        {commande.montant_total?.toLocaleString() ?? '—'} GNF
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
        { title: 'Commandes', href: '/commandes' },
        { title: 'Détails', href: '#' },
    ],
};
