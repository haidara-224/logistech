import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, CheckCircle, ClipboardList, Printer, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { BonLivraison } from '@/types/models';

interface Props { bonLivraison: BonLivraison }

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const statutColors: Record<string, string> = {
    brouillon: 'bg-gray-100 text-gray-600',
    emis: 'bg-blue-100 text-blue-700',
    livre: 'bg-green-100 text-green-700',
};

export default function BonLivraisonShow({ bonLivraison }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.info) toast.info(flash.info);
    }, [flash]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('print') === '1') setTimeout(() => window.print(), 600);
    }, []);

    const commande = bonLivraison.commande;
    const client = commande?.client;
    const items = commande?.items ?? [];

    return (
        <>
            <Head title={`BL ${bonLivraison.numero_bl}`} />

            {/* Toolbar */}
            <div className="print:hidden px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <Link
                    href={commande ? `/dashboard/commandes/${commande.id}` : '/dashboard/commandes'}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la commande
                </Link>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statutColors[bonLivraison.statut] ?? statutColors.emis}`}>
                        {bonLivraison.statut === 'livre' ? 'Livré' : bonLivraison.statut === 'emis' ? 'Émis' : 'Brouillon'}
                    </span>
                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimer / PDF
                    </button>
                </div>
            </div>

            {/* BL Document */}
            <div className="max-w-3xl mx-auto px-6 py-10 print:py-0 print:px-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-10 pb-8 border-b-2 border-blue-600">
                    <div>
                        <h1 className="text-3xl font-black text-blue-600 tracking-tight">LOGISTECH</h1>
                        <p className="text-sm text-gray-500 mt-1">Système de gestion intégré</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            <ClipboardList className="w-3 h-3" />
                            Bon de Livraison
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{bonLivraison.numero_bl}</p>
                        <p className="text-sm text-gray-500 mt-1">Émis le {fmtDate(bonLivraison.date_emission)}</p>
                        {commande && (
                            <p className="text-xs text-gray-400 mt-0.5">Commande #{commande.id}</p>
                        )}
                    </div>
                </div>

                {/* Destinataire */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Livré à</p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                        {client ? (
                            <>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {client.nom}{client.prenom ? ' ' + client.prenom : ''}
                                </p>
                                {client.email && <p className="text-sm text-gray-500 mt-1">{client.email}</p>}
                                {client.telephone && <p className="text-sm text-gray-500">{client.telephone}</p>}
                                {client.quartier && <p className="text-sm text-gray-500">{client.quartier}</p>}
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">Client non renseigné</p>
                        )}
                    </div>
                </div>

                {/* Articles */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Articles à livrer</p>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qté commandée</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider print:table-cell hidden">Qté livrée</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                                            {item.produit?.nom ?? `Produit #${item.produit_id}`}
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                                            {item.produit?.sku ?? '—'}
                                        </td>
                                        <td className="px-5 py-3.5 text-center font-semibold text-gray-900 dark:text-white">
                                            {item.quantite}
                                        </td>
                                        <td className="px-5 py-3.5 text-center print:table-cell hidden">
                                            <div className="w-16 h-7 border border-gray-300 rounded mx-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Notes */}
                {bonLivraison.notes && (
                    <div className="mb-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Notes</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{bonLivraison.notes}</p>
                    </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Signature livreur</p>
                        <div className="h-16 border-b border-gray-300" />
                        <p className="text-xs text-gray-400 mt-1">Nom & date</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Signature client</p>
                        <div className="h-16 border-b border-gray-300" />
                        <p className="text-xs text-gray-400 mt-1">Nom & date</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 pt-8 mt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-500">LOGISTECH</span>
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <p>Document de livraison — à conserver</p>
                </div>
            </div>
        </>
    );
}
