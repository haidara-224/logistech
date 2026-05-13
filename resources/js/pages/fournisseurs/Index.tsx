import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Edit, Plus, ShoppingBag, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Fournisseur } from '@/types/models';

interface Props {
    fournisseurs: { data: (Fournisseur & { achats_count: number })[]; links: any[] };
}

export default function FournisseursIndex({ fournisseurs }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const handleDelete = (id: number, nom: string) => {
        if (!confirm(`Supprimer "${nom}" ?`)) return;
        router.delete(`/dashboard/fournisseurs/${id}`);
    };

    return (
        <>
            <Head title="Fournisseurs" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Fournisseurs</h1>
                    <p className="text-xs text-gray-500 mt-0.5">{fournisseurs.data.length} fournisseur{fournisseurs.data.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href="/dashboard/fournisseurs/creer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
                    <Plus className="w-4 h-4" />
                    Nouveau fournisseur
                </Link>
            </div>

            <div className="px-6 py-6">
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {fournisseurs.data.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <Users className="w-7 h-7 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">Aucun fournisseur</p>
                            <Link href="/dashboard/fournisseurs/creer" className="text-xs text-purple-600 hover:underline font-medium">Ajouter un premier fournisseur</Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Téléphone</th>
                                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Achats</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {fournisseurs.data.map((f) => (
                                        <tr key={f.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{f.nom}</td>
                                            <td className="px-5 py-3.5 text-gray-500">{f.telephone ?? '—'}</td>
                                            <td className="px-5 py-3.5 text-gray-500">{f.email ?? '—'}</td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 text-xs font-semibold">
                                                    <ShoppingBag className="w-3 h-3" />{f.achats_count}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/dashboard/fournisseurs/${f.id}/modifier`}
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 transition-colors">
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(f.id, f.nom)}
                                                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
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
