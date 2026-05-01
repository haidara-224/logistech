// pages/produits/ProduitFormModal.tsx
import { useForm } from '@inertiajs/react';
import { X, Package, Tag, DollarSign, Box, AlertCircle } from 'lucide-react';
import { Produit, Categorie } from '@/types/models';

interface Props {
  produit?: Produit | null;
  categories: Categorie[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProduitFormModal({ produit, categories, onClose, onSuccess }: Props) {
  const isEditing = !!produit;
  
  const { data, setData, post, put, processing, errors } = useForm({
    nom: produit?.nom || '',
    sku: produit?.sku || '',
    description: produit?.description || '',
    prix_vente: produit?.prix_vente || '',
    prix_achat: produit?.prix_achat || '',
    quantite_stock: produit?.quantite_stock || 0,
    stock_minimal: produit?.stock_minimal || 10,
    categorie_id: produit?.categorie_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      put(`/produits/${produit.id}`, {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    } else {
      post('/produits', {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      });
    }
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isEditing ? 'Modifiez les informations du produit' : 'Remplissez les informations du nouveau produit'}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Nom du produit *
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={data.nom}
              onChange={(e) => setData('nom', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
              placeholder="Ex: Charpente métallique"
              required
            />
          </div>
          {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              SKU (Code unique)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={data.sku}
                onChange={(e) => setData('sku', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                placeholder="Ex: CHR-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Catégorie
            </label>
            <select
              value={data.categorie_id}
              onChange={(e) => setData('categorie_id', e.target.value)}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all resize-none"
            placeholder="Description détaillée du produit..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Prix d'achat (GNF)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={data.prix_achat}
                onChange={(e) => setData('prix_achat', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Prix de vente (GNF) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={data.prix_vente}
                onChange={(e) => setData('prix_vente', e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                placeholder="0"
                required
              />
            </div>
            {errors.prix_vente && <p className="mt-1 text-xs text-red-600">{errors.prix_vente}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Quantité en stock
            </label>
            <div className="relative">
              <Box className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={data.quantite_stock}
                onChange={(e) => setData('quantite_stock', Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Stock minimum d'alerte
            </label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                value={data.stock_minimal}
                onChange={(e) => setData('stock_minimal', Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={processing}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {processing ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer le produit')}
          </button>
        </div>
      </form>
    </div>
  );
}