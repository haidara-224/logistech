import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, Edit, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { Achat, Fournisseur } from '@/types/models';
import { fmtGnf } from '@/lib/utils';

interface Props { fournisseur: Fournisseur & { achats: Achat[] } }

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

export default function FournisseursShow({ fournisseur }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    return (
        <>
            <Head title={fournisseur.nom} />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/fournisseurs"
                        className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="w-4 h-4 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{fournisseur.nom}</h1>
                        <p className="text-xs text-gray-500 mt-0.5">Fournisseur</p>
                    </div>
                </div>
                <Link href={`/dashboard/fournisseurs/${fournisseur.id}/modifier`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Edit className="w-4 h-4" />
                    Modifier
                </Link>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 grid grid-cols-2 gap-4">
                    {[
                        ['Téléphone', fournisseur.telephone],
                        ['Email', fournisseur.email],
                        ['Adresse', fournisseur.adresse],
                        ['Notes', fournisseur.notes],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{value || '—'}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-purple-600" />
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Derniers achats</p>
                        </div>
                        <Link href={`/dashboard/achats/creer`}
                            className="text-xs text-purple-600 hover:underline font-medium">Nouvel achat</Link>
                    </div>
                    {fournisseur.achats.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-10">Aucun achat</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {fournisseur.achats.map((a) => (
                                    <tr key={a.id}>
                                        <td className="px-5 py-3 font-mono font-semibold text-gray-900 dark:text-white">{a.numero_achat}</td>
                                        <td className="px-5 py-3 text-gray-500 text-xs">{a.date_achat ? fmtDate(a.date_achat) : '—'}</td>
                                        <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(a.montant_total)} GNF</td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={`/dashboard/achats/${a.id}`} className="text-xs text-purple-600 hover:underline">Voir</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}
