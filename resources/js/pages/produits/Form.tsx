import { router, usePage } from '@inertiajs/react';
import { AlertCircle, DollarSign, ImagePlus, Package, Tag, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Produit, Categorie } from '@/types/models';

interface ExistingImage {
    id: number;
    image: { id: number; image_path: string };
}

interface Props {
    produit?: Produit | null;
    categories: Categorie[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProduitFormModal({ produit, categories, onClose, onSuccess }: Props) {
    const isEditing = !!produit;

    const existingImages: ExistingImage[] = (produit as any)?.images ?? [];

    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const pageErrors = (usePage().props as any).errors ?? {};
    const [processing, setProcessing] = useState(false);

    const [fields, setFields] = useState({
        nom: produit?.nom ?? '',
        sku: produit?.sku ?? '',
        description: produit?.description ?? '',
        prix_vente: String(produit?.prix_vente ?? ''),
        prix_achat: String(produit?.prix_achat ?? ''),
        quantite_stock: String(produit?.quantite_stock ?? 0),
        stock_minimal: String(produit?.stock_minimal ?? 10),
        categorie_id: String(produit?.categorie_id ?? ''),
    });

    const set = (key: keyof typeof fields, value: string) =>
        setFields((prev) => ({ ...prev, [key]: value }));

    const addFiles = useCallback((files: FileList | File[]) => {
        const arr = Array.from(files).filter((f) => f.type.startsWith('image/'));
        setNewFiles((prev) => [...prev, ...arr]);
        arr.forEach((f) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNewPreviews((prev) => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(f);
        });
    }, []);

    const removeNewFile = (idx: number) => {
        setNewFiles((prev) => prev.filter((_, i) => i !== idx));
        setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
    };

    const toggleDeleteExisting = (imageProduitId: number) => {
        setDeletedImageIds((prev) =>
            prev.includes(imageProduitId) ? prev.filter((id) => id !== imageProduitId) : [...prev, imageProduitId],
        );
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const fd = new FormData();
        Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
        if (isEditing) fd.append('_method', 'PUT');
        newFiles.forEach((f) => fd.append('images[]', f));
        deletedImageIds.forEach((id) => fd.append('deleted_image_ids[]', String(id)));

        const url = isEditing ? `/dashboard/produits/${produit!.id}` : '/dashboard/produits';

        router.post(url, fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { onSuccess(); onClose(); },
            onFinish: () => setProcessing(false),
        });
    };

    const visibleExisting = existingImages.filter((img) => !deletedImageIds.includes(img.id));

    return (
        <div className="relative">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-2xl">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {isEditing ? produit.nom : 'Remplissez les informations ci-dessous'}
                    </p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Images section */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Photos du produit
                    </label>

                    {/* Existing images */}
                    {existingImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {existingImages.map((img) => {
                                const isDeleted = deletedImageIds.includes(img.id);
                                return (
                                    <div key={img.id} className="relative group">
                                        <img
                                            src={`/storage/${img.image.image_path}`}
                                            alt=""
                                            className={`w-20 h-20 object-cover rounded-xl border-2 transition-all ${
                                                isDeleted
                                                    ? 'opacity-30 border-red-400 grayscale'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleDeleteExisting(img.id)}
                                            className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs shadow transition-all ${
                                                isDeleted ? 'bg-gray-400 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                        >
                                            {isDeleted ? '↩' : <X className="w-2.5 h-2.5" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* New files preview */}
                    {newPreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {newPreviews.map((src, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={src} alt="" className="w-20 h-20 object-cover rounded-xl border-2 border-[#C8962E]/50" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(idx)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow"
                                    >
                                        <X className="w-2.5 h-2.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Drop zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 cursor-pointer transition-all ${
                            dragging
                                ? 'border-[#C8962E] bg-[#C8962E]/5 scale-[1.01]'
                                : 'border-gray-300 dark:border-gray-700 hover:border-[#C8962E]/60 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-[#C8962E]/10 flex items-center justify-center">
                            <ImagePlus className="w-5 h-5 text-[#C8962E]" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Glisser-déposer ou <span className="text-[#C8962E]">parcourir</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP — max 5 Mo chacune</p>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => { if (e.target.files) addFiles(e.target.files); }}
                    />
                </div>

                {/* Nom */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom du produit *</label>
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={fields.nom}
                            onChange={(e) => set('nom', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                            placeholder="Ex: Charpente métallique"
                            required
                        />
                    </div>
                    {pageErrors.nom && <p className="mt-1 text-xs text-red-500">{pageErrors.nom}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* SKU */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">SKU</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={fields.sku}
                                onChange={(e) => set('sku', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                placeholder="CHR-001"
                            />
                        </div>
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Catégorie</label>
                        <select
                            value={fields.categorie_id}
                            onChange={(e) => set('categorie_id', e.target.value)}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                        >
                            <option value="">— Catégorie —</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                    <textarea
                        value={fields.description}
                        onChange={(e) => set('description', e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all resize-none"
                        placeholder="Description détaillée…"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prix d'achat (GNF)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="number" value={fields.prix_achat} onChange={(e) => set('prix_achat', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prix de vente (GNF) *</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="number" value={fields.prix_vente} onChange={(e) => set('prix_vente', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                placeholder="0" required />
                        </div>
                        {pageErrors.prix_vente && <p className="mt-1 text-xs text-red-500">{pageErrors.prix_vente}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantité en stock</label>
                        <div className="relative">
                            <AlertCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="number" value={fields.quantite_stock} onChange={(e) => set('quantite_stock', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                placeholder="0" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Stock minimum d'alerte</label>
                        <div className="relative">
                            <AlertCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input type="number" value={fields.stock_minimal} onChange={(e) => set('stock_minimal', e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                placeholder="10" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button type="button" onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Annuler
                    </button>
                    <button type="submit" disabled={processing}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {processing ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Enregistrement…
                            </>
                        ) : (
                            <>{isEditing ? 'Mettre à jour' : 'Créer le produit'}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
