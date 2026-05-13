import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Edit, Plus, Trash2, Warehouse } from 'lucide-react';
import { toast } from 'sonner';
import { Depot } from '@/types/models';

interface Props { depots: Depot[] }

export default function DepotsIndex({ depots }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    const handleDelete = (id: number, nom: string) => {
        if (!confirm(`Supprimer le dépôt "${nom}" ?`)) return;
        router.delete(`/dashboard/depots/${id}`);
    };

    return (
        <>
            <Head title="Dépôts" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dépôts</h1>
                    <p className="text-xs text-gray-500 mt-0.5">{depots.length} dépôt{depots.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href="/dashboard/depots/creer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">
                    <Plus className="w-4 h-4" />
                    Nouveau dépôt
                </Link>
            </div>

            <div className="px-6 py-6">
                {depots.length === 0 ? (
                    <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 py-16 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Warehouse className="w-7 h-7 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Aucun dépôt configuré</p>
                        <Link href="/dashboard/depots/creer" className="text-xs text-indigo-600 hover:underline font-medium">Créer un premier dépôt</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {depots.map((d) => (
                            <div key={d.id} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                                        <Warehouse className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/dashboard/depots/${d.id}/modifier`}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 transition-colors">
                                            <Edit className="w-3.5 h-3.5" />
                                        </Link>
                                        <button onClick={() => handleDelete(d.id, d.nom)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{d.nom}</h3>
                                {d.adresse && <p className="text-xs text-gray-500 mt-1">{d.adresse}</p>}
                                {d.description && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{d.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
