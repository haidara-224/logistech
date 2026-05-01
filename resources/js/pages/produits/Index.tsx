// pages/produits/Index.tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  DollarSign,
  Box,
  CheckCircle,
  XCircle,
  Grid3x3,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { Categorie, Produit } from '@/types/models';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import ProduitFormModal from './Form';

interface Props {
  produits: {
    data: Produit[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  stats: {
    total_produits: number;
    valeur_stock: number;
    produits_rupture: number;
    produits_faible_stock: number;
  };
  filters?: {
    search?: string;
  };
  categories: Categorie[];
}

export default function ProduitsIndex({ produits, stats, filters, categories }: Props) {
  const { flash } = usePage().props;
  const [search, setSearch] = useState(filters?.search || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNom, setDeleteNom] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const produitsData = produits.data || [];

  // Afficher les notifications flash
  useEffect(() => {
    if ((flash as any)?.success) {
      toast.success((flash as any).success);
    }
    if ((flash as any)?.error) {
      toast.error((flash as any).error);
    }
  }, [flash]);

  // Fonction de recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== filters?.search) {
        router.get('/produits', { search }, { preserveState: true, replace: true });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    router.get('/produits', { page, search }, {
      preserveState: true,
      onFinish: () => setIsLoading(false)
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      router.delete(`/produits/${deleteId}`, {
        onSuccess: () => {
          setIsModalOpen(false);
          toast.success('Produit supprimé avec succès');
        },
      });
    }
  };

  const openEditModal = (produit: Produit) => {
    setSelectedProduit(produit);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openDeleteModal = (id: number, nom: string) => {
    setDeleteId(id);
    setDeleteNom(nom);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedProduit(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Génération des numéros de page
  const getPageNumbers = () => {
    const pages = [];
    const current = produits.current_page;
    const last = produits.last_page;
    
    if (last <= 7) {
      for (let i = 1; i <= last; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(last);
      } else if (current >= last - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = last - 4; i <= last; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(last);
      }
    }
    return pages;
  };

  // Statistiques
  const statCards = [
    {
      title: 'Total Produits',
      value: stats.total_produits,
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Valeur du Stock',
      value: `${stats.valeur_stock?.toLocaleString() || 0} GNF`,
      icon: DollarSign,
      gradient: 'from-green-500 to-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Produits en Rupture',
      value: stats.produits_rupture || 0,
      icon: XCircle,
      gradient: 'from-red-500 to-red-600',
      bg: 'bg-red-50 dark:bg-red-950/30',
    },
    {
      title: 'Stock Faible',
      value: stats.produits_faible_stock || 0,
      icon: AlertCircle,
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
  ];

  return (
    <>
      <Head title="Produits - Administration" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#C8962E] to-[#E8B84B] bg-clip-text text-transparent">
                  Catalogue Produits
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Gérez votre inventaire et suivez vos stocks en temps réel
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                Nouveau produit
              </motion.button>
            </div>
          </motion.div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl ${stat.bg} border border-gray-200 dark:border-gray-800 p-5 backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-50`} />
              </motion.div>
            ))}
          </div>

          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit par nom, SKU ou catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-3 pl-11 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#C8962E] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#C8962E] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </motion.div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#C8962E]" />
            </div>
          )}

          {/* Contenu principal */}
          {!isLoading && (
            <>
              {/* Vue Grille */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  <AnimatePresence>
                    {produitsData.map((produit: Produit, idx: number) => (
                      <motion.div
                        key={produit.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                        className="group relative rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        {/* Badge stock */}
                        <div className="absolute top-3 right-3 z-10">
                          {(produit.quantite_stock || 0) === 0 ? (
                            <span className="px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-1">
                              <XCircle className="h-3 w-3" /> Rupture
                            </span>
                          ) : (produit.quantite_stock || 0) <= (produit.stock_minimal || 0) ? (
                            <span className="px-2 py-1 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs font-medium flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> Stock faible
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-medium flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> En stock
                            </span>
                          )}
                        </div>

                        {/* Image / Icône */}
                        <div className="relative h-48 bg-gradient-to-br from-[#C8962E]/10 to-[#E8B84B]/10 flex items-center justify-center">
                          <Package className="h-16 w-16 text-[#C8962E] opacity-50" />
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {produit.nom}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                SKU: {produit.sku || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Prix de vente</p>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {produit.prix_vente ? `${produit.prix_vente.toLocaleString()} GNF` : '-'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 dark:text-gray-400">Stock</p>
                              <p className={`font-semibold ${
                                (produit.quantite_stock || 0) === 0 ? 'text-red-600 dark:text-red-400' :
                                (produit.quantite_stock || 0) <= (produit.stock_minimal || 0) ? 'text-orange-600 dark:text-orange-400' :
                                'text-green-600 dark:text-green-400'
                              }`}>
                                {produit.quantite_stock || 0} unités
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                            <Link
                              href={`/produits/${produit.id}`}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              Voir
                            </Link>
                            <button
                              onClick={() => openEditModal(produit)}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                              Modifier
                            </button>
                            <button
                              onClick={() => openDeleteModal(produit.id, produit.nom)}
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-red-50 dark:bg-red-950/50 px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Vue Liste - (garder le même code que précédemment) */}
              {viewMode === 'list' && (
                // ... ton code existant pour la vue liste
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                  {/* Table content */}
                </div>
              )}

              {/* Pagination améliorée */}
              {produits.last_page > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Affichage de {(produits.current_page - 1) * produits.per_page + 1} à {Math.min(produits.current_page * produits.per_page, produits.total)} sur {produits.total} produits
                  </p>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={() => handlePageChange(produits.current_page - 1)}
                      disabled={produits.current_page === 1}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {getPageNumbers().map((page, idx) => (
                      page === '...' ? (
                        <span key={idx} className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(page as number)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            produits.current_page === page
                              ? 'bg-[#C8962E] text-white'
                              : 'border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(produits.current_page + 1)}
                      disabled={produits.current_page === produits.last_page}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-sm font-medium disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Aucun résultat */}
          {!isLoading && produitsData.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {search ? 'Aucun résultat trouvé' : 'Aucun produit'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {search ? 'Essayez avec d\'autres mots-clés' : 'Commencez par ajouter votre premier produit'}
              </p>
              {!search && (
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals - garder le même code */}
      <Dialog.Root open={isModalOpen && (modalMode === 'create' || modalMode === 'edit')} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-0">
            <ProduitFormModal 
              produit={selectedProduit} 
              categories={categories} 
              onClose={() => setIsModalOpen(false)}
              onSuccess={() => {
                setIsModalOpen(false);
                router.reload();
              }}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={isModalOpen && modalMode === 'delete'} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Supprimer le produit
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Êtes-vous sûr de vouloir supprimer "<span className="font-medium text-gray-900 dark:text-white">{deleteNom}</span>" ?<br />
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

ProduitsIndex.layout = {
  breadcrumbs: [
    { title: 'Produits', href: '/produits' },
  ],
};