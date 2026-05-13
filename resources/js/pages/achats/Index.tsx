import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Package, Plus, ShoppingBag, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Achat } from '@/types/models';
import { fmtGnf } from '@/lib/utils';

interface Stats { total: number; ce_mois: number; montant_mois: number }
interface Props {
    achats: { data: Achat[]; links: any[] };
    stats: Stats;
}

const statutColors: Record<string, string> = {
    brouillon: 'bg-gray-100 text-gray-600',
    valide: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
};
const statutLabels: Record<string, string> = { brouillon: 'Brouillon', valide: 'Validé', annule: 'Annulé' };

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function AchatsIndex({ achats, stats }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <>
            <Head title="Achats" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Achats</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Entrées de stock fournisseurs</p>
                </div>
                <Link href="/dashboard/achats/creer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
                    <Plus className="w-4 h-4" />
                    Nouvel achat
                </Link>
            </div>

            <div className="px-6 py-6 space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Total achats</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.total}</p>
                    </div>
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                                <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Ce mois</p>
                        </div>
                        <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.ce_mois}</p>
                    </div>
                    <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                                <TrendingDown className="w-4 h-4 text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-purple-600">Montant ce mois</p>
                        </div>
                        <p className="text-2xl font-black text-purple-700 dark:text-purple-400">{fmtGnf(stats.montant_mois)} <span className="text-sm font-semibold">GNF</span></p>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {achats.data.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <ShoppingBag className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Aucun achat enregistré</p>
                            <Link href="/dashboard/achats/creer" className="text-xs text-purple-600 hover:underline font-medium">Enregistrer un premier achat</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fournisseur</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {achats.data.map((achat) => (
                                        <tr key={achat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5 font-mono text-sm font-semibold text-gray-900 dark:text-white">{achat.numero_achat}</td>
                                            <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400">{achat.fournisseur?.nom ?? <span className="text-gray-400">—</span>}</td>
                                            <td className="px-5 py-3.5 text-gray-500 text-xs">{achat.date_achat ? fmtDate(achat.date_achat) : '—'}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutColors[achat.statut ?? 'brouillon'] ?? statutColors.brouillon}`}>
                                                    {statutLabels[achat.statut ?? 'brouillon'] ?? achat.statut}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(achat.montant_total)} GNF</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <Link href={`/dashboard/achats/${achat.id}`}
                                                    className="text-xs text-purple-600 hover:underline font-medium">Voir</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
