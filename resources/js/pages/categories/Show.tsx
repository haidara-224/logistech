import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, FolderGit2, Package, Pencil } from 'lucide-react';
import { Categorie, Produit } from '@/types/models';

interface Props {
    categorie: Categorie & { produits: Produit[] };
}

export default function CategoriesShow({ categorie }: Props) {
    return (
        <>
            <Head title={categorie.name} />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link href="/dashboard/categories" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux catégories
                </Link>

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8962E]/20 to-[#E8B84B]/20 flex items-center justify-center">
                                <FolderGit2 className="h-6 w-6 text-[#C8962E]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{categorie.name}</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{categorie.produits?.length ?? 0} produit{(categorie.produits?.length ?? 0) !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <Link
                            href={`/dashboard/categories/${categorie.id}/modifier`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                            Modifier
                        </Link>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#C8962E]" />
                            Produits dans cette catégorie
                        </h2>
                    </div>
                    {(categorie.produits?.length ?? 0) === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            Aucun produit dans cette catégorie
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {categorie.produits.map((p) => (
                                <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                            <Package className="h-4 w-4 text-[#C8962E]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{p.nom}</p>
                                            {p.sku && <p className="text-xs text-gray-500">SKU: {p.sku}</p>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">{p.prix_vente?.toLocaleString()} GNF</p>
                                        <p className="text-xs text-gray-500">{p.quantite_stock ?? 0} en stock</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

CategoriesShow.layout = {
    breadcrumbs: [
        { title: 'Catégories', href: '/dashboard/categories' },
        { title: 'Détails', href: '#' },
    ],
};
