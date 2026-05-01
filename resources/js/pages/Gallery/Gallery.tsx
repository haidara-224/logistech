import AppLayoutLanding from "@/layouts/LandindLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, MapPin, Calendar, Eye, Heart, Share2, Download, ChevronLeft, ChevronRight, Grid3x3, LayoutGrid, ZoomIn } from "lucide-react";

type GalleryFilter = "all" | "charpente" | "transport" | "froid" | "batiment" | "logistique";

const GALLERY_ITEMS = [
  { id: 1, cat: "charpente", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg", title: "Charpente Industrielle", loc: "Conakry", date: "2024", likes: 24, views: 156 },
  { id: 2, cat: "transport", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.25 PM.jpeg", title: "Flotte de Transport", loc: "Route Coyah", date: "2024", likes: 18, views: 89 },
  { id: 3, cat: "froid", img: "/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.20 PM.jpeg", title: "Chambre Froide", loc: "Port de Conakry", date: "2024", likes: 32, views: 203 },
  { id: 4, cat: "batiment", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.23 PM.jpeg", title: "Construction Moderne", loc: "Kipé", date: "2023", likes: 45, views: 312 },
  { id: 5, cat: "charpente", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg", title: "Hangar Agricole", loc: "Kindia", date: "2024", likes: 12, views: 67 },
  { id: 6, cat: "transport", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.35 PM.jpeg", title: "Transport International", loc: "Labé", date: "2024", likes: 29, views: 145 },
  { id: 7, cat: "froid", img: "/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.00.49 PM.jpeg", title: "Installation Frigorifique", loc: "Ratoma", date: "2024", likes: 37, views: 198 },
  { id: 8, cat: "batiment", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.24 PM (1).jpeg", title: "Bâtiment Commercial", loc: "Matoto", date: "2023", likes: 41, views: 267 },
  { id: 9, cat: "charpente", img: "/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (2).jpeg", title: "Structure Métallique", loc: "Dixinn", date: "2024", likes: 23, views: 112 },
];

const FILTERS = [
  { key: "all", label: "Tous", icon: Grid3x3, color: "#C8962E" },
  { key: "charpente", label: "Charpente", icon: null, color: "#C8962E" },
  { key: "transport", label: "Transport", icon: null, color: "#3B82F6" },
  { key: "froid", label: "Froid", icon: null, color: "#06B6D4" },
  { key: "batiment", label: "Bâtiment", icon: null, color: "#10B981" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [likedImages, setLikedImages] = useState<number[]>([]);

  const filtered = GALLERY_ITEMS.filter(item => {
    const matchFilter = filter === "all" || item.cat === filter;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.loc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleLike = (id: number) => {
    setLikedImages(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      <Head title="Galerie - LOGISTECH EQUIP+" />
      
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-[#0A0F1A] dark:via-[#0B1120] dark:to-[#0A0F1A]">
        
        {/* Hero Section */}
        <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="/LOgistech FRoid/WhatsApp Image 2026-04-28 at 7.34.02 PM.jpeg"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          
          <div className="relative z-10 text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Notre Galerie
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Découvrez nos réalisations à travers la Guinée
              </p>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          
          {/* Barre d'outils */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-12">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C8962E] transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map(f => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key as GalleryFilter)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      active 
                        ? "text-white shadow-lg" 
                        : "text-gray-600 dark:text-white/60 hover:text-[#C8962E]"
                    }`}
                    style={active ? { background: f.color } : {}}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 p-1 rounded-xl bg-gray-200/50 dark:bg-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-white/20 shadow-sm" : ""}`}
              >
                <LayoutGrid size={18} className={viewMode === "grid" ? "text-[#C8962E]" : "text-gray-400"} />
              </button>
              <button
                onClick={() => setViewMode("masonry")}
                className={`p-2 rounded-lg transition-all ${viewMode === "masonry" ? "bg-white dark:bg-white/20 shadow-sm" : ""}`}
              >
                <Grid3x3 size={18} className={viewMode === "masonry" ? "text-[#C8962E]" : "text-gray-400"} />
              </button>
            </div>
          </div>

          {/* Compteur */}
          <div className="mb-6 text-right">
            <p className="text-sm text-gray-500 dark:text-white/40">
              {filtered.length} projet{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Galerie Grid */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-white/5 shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={item.img} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                        <button 
                          onClick={() => toggleLike(item.id)}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-[#C8962E] transition-all"
                        >
                          <Heart size={14} className={likedImages.includes(item.id) ? "fill-red-500 text-red-500" : "text-white"} />
                        </button>
                        <button 
                          onClick={() => setSelectedImage(item)}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-[#C8962E] transition-all"
                        >
                          <ZoomIn size={14} className="text-white" />
                        </button>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <span 
                          className="px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                          style={{ 
                            background: `${FILTERS.find(f => f.key === item.cat)?.color}22`,
                            color: FILTERS.find(f => f.key === item.cat)?.color,
                            border: `1px solid ${FILTERS.find(f => f.key === item.cat)?.color}40`
                          }}
                        >
                          {item.cat}
                        </span>
                      </div>

                      {/* Infos */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                        <h3 className="text-white font-semibold text-base">{item.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-white/60 text-xs">
                          <span className="flex items-center gap-1"><MapPin size={10} /> {item.loc}</span>
                          <span className="flex items-center gap-1"><Calendar size={10} /> {item.date}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-white/40 text-xs">
                          <span className="flex items-center gap-1"><Heart size={10} /> {item.likes + (likedImages.includes(item.id) ? 1 : 0)}</span>
                          <span className="flex items-center gap-1"><Eye size={10} /> {item.views}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Galerie Masonry */}
          {viewMode === "masonry" && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              <AnimatePresence>
                {filtered.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03 }}
                    whileHover={{ y: -4 }}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-white/5 shadow-lg break-inside-avoid"
                    onClick={() => setSelectedImage(item)}
                  >
                    <img 
                      src={item.img} 
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 left-3">
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm"
                        style={{ 
                          background: `${FILTERS.find(f => f.key === item.cat)?.color}22`,
                          color: FILTERS.find(f => f.key === item.cat)?.color,
                        }}
                      >
                        {item.cat}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      <p className="text-white/50 text-xs flex items-center gap-1"><MapPin size={10} /> {item.loc}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-white/40">Aucun projet trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox amélioré */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.img} 
                alt={selectedImage.title}
                className="w-full object-contain max-h-[85vh]"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-white/60 text-sm">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {selectedImage.loc}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> {selectedImage.date}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-[#C8962E] transition-all"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

GalleryPage.layout = (page: any) => (
  <AppLayoutLanding {...page.props}>{page}</AppLayoutLanding>
);