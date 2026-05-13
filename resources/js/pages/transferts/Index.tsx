import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowRight, Plus, Warehouse } from 'lucide-react';
import { toast } from 'sonner';
import { TransfertDepot } from '@/types/models';

interface Props { transferts: { data: TransfertDepot[]; links: any[] } }

const statutColors: Record<string, string> = {
    en_cours: 'bg-blue-100 text-blue-700',
    complete: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
};
const statutLabels: Record<string, string> = { en_cours: 'En cours', complete: 'Complété', annule: 'Annulé' };

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransfertsIndex({ transferts }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <>
            <Head title="Transferts de dépôt" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Transferts de dépôt</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Déplacements de stock entre dépôts</p>
                </div>
                <Link href="/dashboard/transferts/creer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                    <Plus className="w-4 h-4" />
                    Nouveau transfert
                </Link>
            </div>

            <div className="px-6 py-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {transferts.data.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Warehouse className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Aucun transfert enregistré</p>
                            <Link href="/dashboard/transferts/creer" className="text-xs text-indigo-600 hover:underline font-medium">Créer un transfert</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">De → Vers</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {transferts.data.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5 font-mono font-semibold text-gray-900 dark:text-white text-xs">{t.numero_transfert}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">{t.depot_source?.nom ?? '—'}</span>
                                                    <ArrowRight className="w-3 h-3 text-gray-400" />
                                                    <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 font-medium text-indigo-700 dark:text-indigo-400">{t.depot_destination?.nom ?? '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-500 text-xs">{t.date_transfert ? fmtDate(t.date_transfert) : '—'}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutColors[t.statut ?? 'en_cours'] ?? statutColors.en_cours}`}>
                                                    {statutLabels[t.statut ?? 'en_cours'] ?? t.statut}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <Link href={`/dashboard/transferts/${t.id}`} className="text-xs text-indigo-600 hover:underline font-medium">Voir</Link>
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
