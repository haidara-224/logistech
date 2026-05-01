import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Categorie } from '@/types/models';
import ProduitFormModal from './Form';

interface Props {
    categories: Categorie[];
}

export default function ProduitsCreate({ categories }: Props) {
    return (
        <>
            <Head title="Créer un produit" />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link
                    href="/produits"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux produits
                </Link>
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <ProduitFormModal
                        categories={categories}
                        onClose={() => window.history.back()}
                        onSuccess={() => {}}
                    />
                </div>
            </div>
        </>
    );
}

ProduitsCreate.layout = {
    breadcrumbs: [
        { title: 'Produits', href: '/produits' },
        { title: 'Créer', href: '/produits/creer' },
    ],
};
