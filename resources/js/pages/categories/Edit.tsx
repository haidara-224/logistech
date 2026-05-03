import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FolderGit2 } from 'lucide-react';
import { Categorie } from '@/types/models';

interface Props {
    categorie: Categorie;
}

export default function CategoriesEdit({ categorie }: Props) {
    const { data, setData, put, processing, errors } = useForm({ name: categorie.name });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/categories/${categorie.id}`);
    };

    return (
        <>
            <Head title={`Modifier - ${categorie.name}`} />
            <div className="max-w-lg mx-auto px-4 py-8">
                <Link href="/dashboard/categories" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux catégories
                </Link>
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Modifier la catégorie</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom *</label>
                            <div className="relative">
                                <FolderGit2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                    required
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Link href="/dashboard/categories" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center">
                                Annuler
                            </Link>
                            <button type="submit" disabled={processing} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                                {processing ? 'Mise à jour...' : 'Mettre à jour'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

CategoriesEdit.layout = {
    breadcrumbs: [
        { title: 'Catégories', href: '/dashboard/categories' },
        { title: 'Modifier', href: '#' },
    ],
};
