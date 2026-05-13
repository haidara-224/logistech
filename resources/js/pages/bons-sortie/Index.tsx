import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowRight, LogOut, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { BonSortie } from '@/types/models';

interface Props {
    bonsSortie: { data: BonSortie[]; links: any[] };
    stats: { total: number; ce_mois: number; valides: number };
}

const statutColors: Record<string, string> = {
    brouillon: 'bg-gray-100 text-gray-600',
    valide: 'bg-green-100 text-green-700',
    annule: 'bg-red-100 text-red-600',
};
const statutLabels: Record<string, string> = { brouillon: 'Brouillon', valide: 'Validé', annule: 'Annulé' };

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function BonsSortieIndex({ bonsSortie, stats }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <>
            <Head title="Bons de sortie" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bons de sortie</h1>
                    <p className="text-xs text-gray-500 mt-0.5">Sorties de stock manuelles</p>
                </div>
                <Link
                    href="/dashboard/bons-sortie/creer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau bon
                </Link>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 grid grid-cols-3 gap-4">
                {[
                    { label: 'Total', value: stats.total },
                    { label: 'Ce mois', value: stats.ce_mois },
                    { label: 'Validés', value: stats.valides },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
                        <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="px-6 pb-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {bonsSortie.data.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <LogOut className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Aucun bon de sortie</p>
                            <Link href="/dashboard/bons-sortie/creer" className="text-xs text-orange-600 hover:underline font-medium">
                                Créer un bon de sortie
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dépôt</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Motif</th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {bonsSortie.data.map((bs) => (
                                        <tr key={bs.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5 font-mono font-semibold text-gray-900 dark:text-white text-xs">{bs.numero_bs}</td>
                                            <td className="px-5 py-3.5 text-gray-500 text-xs">{bs.date_emission ? fmtDate(bs.date_emission) : fmtDate(bs.created_at)}</td>
                                            <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 text-xs">{bs.depot?.nom ?? '—'}</td>
                                            <td className="px-5 py-3.5 text-gray-500 text-xs truncate max-w-[160px]">{bs.motif ?? '—'}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statutColors[bs.statut ?? 'brouillon']}`}>
                                                    {statutLabels[bs.statut ?? 'brouillon']}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <Link
                                                    href={`/dashboard/bons-sortie/${bs.id}`}
                                                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                                                >
                                                    Voir <ArrowRight className="w-3 h-3" />
                                                </Link>
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
