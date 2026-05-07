import { useState } from "react";
import { FadeIn } from "./ui-primitives";
import { Filter, MapPin, X, Grid3x3, LayoutGrid } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, usePage } from "@inertiajs/react";
import { useTranslation } from "@/hooks/use-translation";

type GalleryFilter = "tous" | "charpente" | "transport" | "froid" | "batiment";

type GalleryItem = { id: number; cat: GalleryFilter; img: string; title: string; loc: string };

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  { id:1, cat:"charpente", img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg", title:"Charpente Industrielle",    loc:"Conakry"         },
  { id:2, cat:"transport", img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.25 PM.jpeg",     title:"Flotte de Transport",       loc:"Route Coyah"     },
  { id:3, cat:"froid",     img:"/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.20 PM.jpeg",        title:"Chambre Froide",            loc:"Port de Conakry" },
  { id:4, cat:"batiment",  img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.23 PM.jpeg",     title:"Construction",              loc:"Kipé"            },
  { id:5, cat:"charpente", img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg", title:"Hangar Agricole",           loc:"Kindia"          },
  { id:6, cat:"transport", img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.35 PM.jpeg",     title:"Transport International",   loc:"Labé"            },
  { id:7, cat:"froid",     img:"/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.00.49 PM.jpeg",        title:"Installation Frigorifique", loc:"Ratoma"          },
  { id:8, cat:"batiment",  img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.24 PM (1).jpeg", title:"Bâtiment Commercial",       loc:"Matoto"          },
  { id:9, cat:"charpente", img:"/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (2).jpeg", title:"Structure Métallique",      loc:"Dixinn"          },
];

const FILTER_META: Record<GalleryFilter, { color: string; labelKey: string }> = {
  tous:      { color: "#C8962E", labelKey: "gallery_filter_all"       },
  charpente: { color: "#C8962E", labelKey: "gallery_filter_charpente" },
  transport: { color: "#3B82F6", labelKey: "gallery_filter_transport" },
  froid:     { color: "#06B6D4", labelKey: "gallery_filter_froid"     },
  batiment:  { color: "#10B981", labelKey: "gallery_filter_batiment"  },
};

const FILTER_KEYS: GalleryFilter[] = ["tous", "charpente", "transport", "froid", "batiment"];

function catColor(cat: GalleryFilter) {
  return FILTER_META[cat]?.color ?? "#C8962E";
}

export function Gallery(_: { onDevis: () => void }) {
  const { t } = useTranslation();
  const { landing } = usePage().props as any;
  const [filter,   setFilter]   = useState<GalleryFilter>("tous");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("grid");

  const GALLERY_ITEMS: GalleryItem[] = (landing?.galleryItems?.length > 0)
    ? landing.galleryItems.map((item: any) => ({
        id:    item.id,
        cat:   item.cat as GalleryFilter,
        img:   item.image_path,
        title: item.title ?? '',
        loc:   item.location ?? '',
      }))
    : DEFAULT_GALLERY_ITEMS;

  const FILTERS = FILTER_KEYS.map(key => ({ key, label: t(FILTER_META[key].labelKey), color: FILTER_META[key].color }));

  const filtered = filter === "tous" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((i: GalleryItem) => i.cat === filter);
  const lightboxItem = lightbox !== null ? GALLERY_ITEMS.find((i: GalleryItem) => i.id === lightbox) : null;

  const getMasonryHeight = (index: number) => {
    const heights = ["320px", "380px", "300px", "420px", "350px", "370px", "310px", "400px", "340px"];
    return heights[index % heights.length];
  };

  return (
    <section id="gallery" className="relative py-24 md:py-32 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-[#0A0F1A] dark:via-[#0B1120] dark:to-[#0A0F1A]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8962E]/20 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8962E]/10 border border-[#C8962E]/20 mb-4">
            <Grid3x3 className="w-3 h-3 text-[#C8962E]" />
            <span className="text-[#C8962E] text-xs font-semibold uppercase tracking-wider">
              {t('gallery_badge')}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('gallery_title')}
          </h2>
          <p className="text-gray-500 dark:text-white/40 text-base max-w-2xl mx-auto">
            {t('gallery_subtitle')}
          </p>
        </FadeIn>

        {/* Filtres avec vue toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden group"
                >
                  <span className={`relative z-10 flex items-center gap-1.5 ${active ? 'text-white' : 'text-gray-600 dark:text-white/60'}`}>
                    {active && <Filter size={12} />}
                    {f.label}
                    <span className="text-xs opacity-70">({f.key === "tous" ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.cat === f.key).length})</span>
                  </span>
                  {active && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 rounded-full"
                      style={{ background: f.color }}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Toggle vue */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-200/50 dark:bg-white/5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? 'bg-white dark:bg-white/10 shadow-sm' : ''}`}
            >
              <LayoutGrid size={16} className={viewMode === "grid" ? 'text-[#C8962E]' : 'text-gray-400'} />
            </button>
            <button
              onClick={() => setViewMode("masonry")}
              className={`p-2 rounded-lg transition-all ${viewMode === "masonry" ? 'bg-white dark:bg-white/10 shadow-sm' : ''}`}
            >
              <Grid3x3 size={16} className={viewMode === "masonry" ? 'text-[#C8962E]' : 'text-gray-400'} />
            </button>
          </div>
        </div>

        {/* Grid Mode */}
        {viewMode === "grid" && (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setLightbox(item.id)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer bg-white dark:bg-white/5 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.85) 0%, rgba(200,150,46,0.2) 100%)" }} />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm"
                        style={{ background: `${catColor(item.cat)}22`, color: catColor(item.cat), border: `1px solid ${catColor(item.cat)}40` }}>
                        {item.cat}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-[#C8962E] text-xs flex items-center gap-1.5 mt-1"><MapPin size={10} /> {item.loc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Masonry Mode */}
        {viewMode === "masonry" && (
          <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setLightbox(item.id)}
                  className="group relative rounded-xl overflow-hidden cursor-pointer bg-white dark:bg-white/5 shadow-lg hover:shadow-xl transition-all duration-300 break-inside-avoid mb-5"
                >
                  <div className="relative overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ height: getMasonryHeight(i) }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.85) 0%, rgba(200,150,46,0.2) 100%)" }} />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm"
                        style={{ background: `${catColor(item.cat)}22`, color: catColor(item.cat), border: `1px solid ${catColor(item.cat)}40` }}>
                        {item.cat}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-[#C8962E] text-xs flex items-center gap-1.5 mt-1"><MapPin size={10} /> {item.loc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* CTA */}
        <FadeIn delay={0.3} className="text-center mt-16">
          <Link
            href="/images"
            className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#C8962E] to-[#E8B84B] shadow-lg hover:shadow-xl transition-all"
          >
            {t('gallery_view_all')}
          </Link>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <img src={lightboxItem.img} alt={lightboxItem.title} className="w-full object-cover" style={{ maxHeight: "80vh" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.95), transparent)" }}>
                <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {lightboxItem.title}
                </h3>
                <p className="text-[#C8962E] text-sm flex items-center gap-1.5 mt-1">
                  <MapPin size={12} /> {lightboxItem.loc}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-all"
              >
                <X size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
