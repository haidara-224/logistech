import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ProduitsIndex() {
    const [produits, setProduits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/produits')
            .then((r) => r.json())
            .then((data) => {
                // if backend returned Inertia page, try API fallback
                if (Array.isArray(data.data)) {
                    setProduits(data.data);
                } else if (Array.isArray(data)) {
                    setProduits(data);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Head title="Produits" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Produits</h1>
                    <Link href="/produits/creer" className="btn">Créer</Link>
                </div>

                {loading ? (
                    <div>Chargement...</div>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>SKU</th>
                                <th>Prix</th>
                                <th>Stock réel</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.nom}</td>
                                    <td>{p.sku}</td>
                                    <td>{p.prix_vente}</td>
                                    <td>{p.stock_reel ?? '-'}</td>
                                    <td>
                                        <Link href={`/produits/${p.id}`} className="link">
                                            Voir
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

ProduitsIndex.layout = {
    breadcrumbs: [
        { title: 'Produits', href: '/produits' },
    ],
};
