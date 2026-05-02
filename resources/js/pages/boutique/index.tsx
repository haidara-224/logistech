import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
    ShoppingCart, Package, Search, Filter, X, Plus, Minus,
    Truck, ShieldCheck, RefreshCcw, Star, ChevronRight, Store
} from 'lucide-react';
import { Navbar } from '@/components/LandingPage/Navbar';
import { Footer } from '@/components/LandingPage/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { Categorie, Produit } from '@/types/models';

interface PanierItem {
    produit_id: number;
    nom: string;
    prix: number;
    quantite: number;
}

interface Props {
    produits: Produit[];
    categories: Categorie[];
    panier: Record<string, PanierItem>;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

export default function BoutiqueIndex({ produits, categories, panier: initialPanier, isAdmin, isSuperAdmin }: Props) {
    const [panier, setPanier] = useState<Record<string, PanierItem>>(initialPanier ?? {});
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [categorieId, setCategorieId] = useState<number | null>(null);
    const [adding, setAdding] = useState<number | null>(null);

    const panierCount = Object.values(panier).reduce((s, i) => s + i.quantite, 0);
    const panierTotal = Object.values(panier).reduce((s, i) => s + i.prix * i.quantite, 0);

    const produitsFiltres = produits.filter((p) => {
        const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase());
        const matchCat = categorieId === null || p.categorie_id === categorieId;
        return matchSearch && matchCat;
    });

    const addToCart = useCallback(async (produit: Produit) => {
        setAdding(produit.id);
        try {
            const res = await fetch('/panier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
                body: JSON.stringify({ produit_id: produit.id, quantite: 1 }),
            });
            const data = await res.json();
            setPanier(data.panier);
            toast.success(`${produit.nom} ajouté au panier`);
        } catch {
            toast.error('Erreur lors de l\'ajout au panier');
        } finally {
            setAdding(null);
        }
    }, []);

    const updateQty = useCallback(async (produitId: number, quantite: number) => {
        const res = await fetch(`/panier/${produitId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
            body: JSON.stringify({ quantite }),
        });
        const data = await res.json();
        setPanier(data.panier);
    }, []);

    const removeFromCart = useCallback(async (produitId: number) => {
        const res = await fetch(`/panier/${produitId}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '' },
        });
        const data = await res.json();
        setPanier(data.panier);
    }, []);

    return (
        <>
            <Head title="Boutique — Logistech Equip+" />

            <div className="min-h-screen bg-stone-50 dark:bg-[#060D1A] flex flex-col">
                <Navbar isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} onDevis={() => {}} />

                {/* Hero boutique */}
                <section className="relative py-16 pt-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C8962E]/5 via-transparent to-blue-500/5" />
                    <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <Store className="w-5 h-5 text-[#C8962E]" />
                                <span className="text-[#C8962E] text-xs font-semibold uppercase tracking-widest">Boutique en ligne</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-3">
                                Nos <span className="text-[#C8962E]">Produits</span>
                            </h1>
                            <p className="text-slate-500 dark:text-white/50 max-w-xl">
                                Équipements industriels disponibles en stock — livraison rapide à Conakry et dans toute la Guinée.
                            </p>
                        </motion.div>

                        {/* Badges promo */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {[
                                { icon: Truck, text: 'Livraison Conakry' },
                                { icon: ShieldCheck, text: 'Produits certifiés' },
                                { icon: RefreshCcw, text: 'Retour 7 jours' },
                            ].map(({ icon: Icon, text }) => (
                                <span key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-slate-600 dark:text-white/60">
                                    <Icon className="w-3.5 h-3.5 text-[#C8962E]" />
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Filtres + grille */}
                <section className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-8 pb-20">
                    {/* Barre de filtres */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Rechercher un produit..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white dark:bg-white/5 border-stone-200 dark:border-white/10"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <button
                                onClick={() => setCategorieId(null)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${categorieId === null ? 'bg-[#C8962E] text-white' : 'bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-[#C8962E]'}`}
                            >
                                Tous
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategorieId(cat.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${categorieId === cat.id ? 'bg-[#C8962E] text-white' : 'bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:border-[#C8962E]'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Résultats */}
                    <p className="text-sm text-slate-400 mb-4">{produitsFiltres.length} produit{produitsFiltres.length !== 1 ? 's' : ''} disponible{produitsFiltres.length !== 1 ? 's' : ''}</p>

                    {produitsFiltres.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Package className="w-16 h-16 text-slate-300 dark:text-white/10 mb-4" />
                            <p className="text-slate-500 dark:text-white/40 text-lg font-medium">Aucun produit disponible</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence>
                                {produitsFiltres.map((produit, i) => {
                                    const inCart = panier[String(produit.id)];
                                    return (
                                        <motion.div
                                            key={produit.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="group bg-white dark:bg-white/[0.03] rounded-2xl border border-stone-200 dark:border-white/[0.07] overflow-hidden hover:shadow-xl hover:shadow-[#C8962E]/5 hover:-translate-y-1 transition-all duration-300"
                                        >
                                            {/* Image produit */}
                                            <div className="relative h-48 bg-gradient-to-br from-stone-100 to-stone-200 dark:from-white/5 dark:to-white/[0.02] overflow-hidden">
                                                {(() => {
                                                    const imgPath = produit.images?.[0]?.image?.image_path;
                                                    return imgPath ? (
                                                        <img
                                                            src={`/storage/${imgPath}`}
                                                            alt={produit.nom}
                                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Package className="w-20 h-20 text-stone-300 dark:text-white/10" />
                                                        </div>
                                                    );
                                                })()}
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5 border-0">
                                                        En stock ({produit.stock_reel})
                                                    </Badge>
                                                </div>
                                                {inCart && (
                                                    <div className="absolute top-3 right-3">
                                                        <Badge className="bg-[#C8962E] text-white text-xs px-2 py-0.5 border-0">
                                                            {inCart.quantite} dans le panier
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4">
                                                <p className="text-[10px] font-semibold text-[#C8962E] uppercase tracking-wider mb-1">
                                                    {produit.categorie?.name ?? 'Général'}
                                                </p>
                                                <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-2 text-sm leading-snug">
                                                    {produit.nom}
                                                </h3>
                                                {produit.sku && (
                                                    <p className="text-[10px] text-slate-400 dark:text-white/30 mb-2">SKU: {produit.sku}</p>
                                                )}

                                                <div className="flex items-center justify-between mt-3">
                                                    <p className="text-lg font-black text-slate-900 dark:text-white">
                                                        {fmtGnf(produit.prix_vente ? produit.prix_vente : 0)}
                                                    </p>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => addToCart(produit)}
                                                        disabled={adding === produit.id}
                                                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C8962E] text-white text-xs font-semibold hover:bg-[#b8841e] transition-colors disabled:opacity-60"
                                                    >
                                                        {adding === produit.id ? (
                                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity }}>
                                                                <RefreshCcw className="w-3.5 h-3.5" />
                                                            </motion.div>
                                                        ) : (
                                                            <>
                                                                <Plus className="w-3.5 h-3.5" />
                                                                Ajouter
                                                            </>
                                                        )}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </section>

                <Footer onDevis={() => {}} />
            </div>

            {/* Bouton flottant panier */}
            <AnimatePresence>
                {panierCount > 0 && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCartOpen(true)}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-bold shadow-2xl shadow-[#C8962E]/40"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>{fmtGnf(panierTotal)}</span>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#C8962E] text-xs font-black">
                            {panierCount}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Drawer panier */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setCartOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-white dark:bg-[#0B1120] shadow-2xl flex flex-col"
                        >
                            {/* Header panier */}
                            <div className="flex items-center justify-between p-5 border-b border-stone-200 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-[#C8962E]" />
                                    <h2 className="font-bold text-lg text-slate-900 dark:text-white">Mon panier</h2>
                                    <Badge className="bg-[#C8962E]/10 text-[#C8962E] border-0 text-xs">{panierCount} article{panierCount > 1 ? 's' : ''}</Badge>
                                </div>
                                <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100 dark:hover:bg-white/10 transition-colors">
                                    <X className="w-4 h-4 text-slate-500 dark:text-white/50" />
                                </button>
                            </div>

                            {/* Items */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                {Object.values(panier).map((item) => (
                                    <motion.div
                                        key={item.produit_id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-white/[0.03] border border-stone-100 dark:border-white/[0.06]"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-stone-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <Package className="w-6 h-6 text-stone-400 dark:text-white/30" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.nom}</p>
                                            <p className="text-xs text-[#C8962E] font-bold">{fmtGnf(item.prix)}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => updateQty(item.produit_id, item.quantite - 1)} className="w-6 h-6 rounded-full bg-stone-200 dark:bg-white/10 flex items-center justify-center hover:bg-[#C8962E] hover:text-white transition-colors">
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-bold text-slate-900 dark:text-white">{item.quantite}</span>
                                            <button onClick={() => updateQty(item.produit_id, item.quantite + 1)} className="w-6 h-6 rounded-full bg-stone-200 dark:bg-white/10 flex items-center justify-center hover:bg-[#C8962E] hover:text-white transition-colors">
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.produit_id)} className="ml-1 text-red-400 hover:text-red-600 transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer panier */}
                            <div className="p-5 border-t border-stone-200 dark:border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-white/50 font-medium">Total</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">{fmtGnf(panierTotal)}</span>
                                </div>
                                <Link
                                    href="/boutique/checkout"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-bold hover:opacity-90 transition-opacity"
                                >
                                    Commander maintenant
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
