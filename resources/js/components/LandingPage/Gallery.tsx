import { useState } from "react";
import { FadeIn } from "./ui-primitives";
import { Filter, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type GalleryFilter = "tous" | "charpente" | "transport" | "froid" | "batiment";

const GALLERY_ITEMS = [
  { id:1, cat:"charpente" as GalleryFilter, img:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", title:"Charpente Industrielle",    loc:"Conakry"         },
  { id:2, cat:"transport" as GalleryFilter, img:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80", title:"Flotte de Transport",       loc:"Route Coyah"     },
  { id:3, cat:"froid"     as GalleryFilter, img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title:"Chambre Froide",            loc:"Port de Conakry" },
  { id:4, cat:"batiment"  as GalleryFilter, img:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80", title:"Complexe Résidentiel",      loc:"Kipé"            },
  { id:5, cat:"charpente" as GalleryFilter, img:"https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", title:"Hangar Agricole",           loc:"Kindia"          },
  { id:6, cat:"transport" as GalleryFilter, img:"https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80", title:"Transport International",   loc:"Labé"            },
  { id:7, cat:"batiment"  as GalleryFilter, img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", title:"Bâtiment Commercial",       loc:"Matam"           },
  { id:8, cat:"froid"     as GalleryFilter, img:"https://images.unsplash.com/photo-1581093804475-577d72e35d50?w=600&q=80", title:"Installation Frigorifique", loc:"Ratoma"          },
  { id:9, cat:"charpente" as GalleryFilter, img:"https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80", title:"Structure Métallique",      loc:"Dixinn"          },
];

const FILTERS: { key: GalleryFilter; label: string; color: string }[] = [
  { key:"tous",      label:"Tous",      color:"#C8962E" },
  { key:"charpente", label:"Charpente", color:"#C8962E" },
  { key:"transport", label:"Transport", color:"#3B82F6" },
  { key:"froid",     label:"Froid",     color:"#06B6D4" },
  { key:"batiment",  label:"Bâtiment",  color:"#10B981" },
];

function catColor(cat: GalleryFilter) {
  return FILTERS.find(f => f.key === cat)?.color ?? "#C8962E";
}

export function Gallery({ onDevis }: { onDevis: () => void }) {
  const [filter,   setFilter]   = useState<GalleryFilter>("tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "tous" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === filter);
  const lightboxItem = lightbox !== null ? GALLERY_ITEMS.find(i => i.id === lightbox) : null;

  return (
    <section id="gallery" className="relative py-32 bg-stone-100 dark:bg-[#060D1A]">
      {/* Séparateur haut */}
      <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.3),transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Portfolio</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }}
            className="text-5xl lg:text-7xl font-bold mt-3 text-slate-900 dark:text-white">
            Nos Réalisations
          </h2>
        </FadeIn>

        {/* Filtres */}
        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-3 mb-12">
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${active
                    ? "text-black shadow-md"
                    : "bg-white border border-stone-300 text-slate-600 hover:border-amber-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white/50 dark:hover:border-white/20"
                  }`}
                style={active ? { background: f.color, border: `1px solid ${f.color}` } : {}}>
                {active && <Filter size={13} />}
                {f.label}
                <span className="text-xs opacity-60">
                  ({f.key === "tous" ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.cat === f.key).length})
                </span>
              </button>
            );
          })}
        </FadeIn>

        {/* Grille */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div key={item.id} layout
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setLightbox(item.id)}
                className="group relative rounded-xl overflow-hidden cursor-pointer shadow-md shadow-stone-200/80 dark:shadow-none"
                style={{ aspectRatio: i % 5 === 0 ? "1/1.3" : "4/3" }}>
                <img src={item.img} alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ background: "linear-gradient(0deg,rgba(6,13,26,0.9) 0%,rgba(200,150,46,0.08) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-3 opacity-0
                  group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-[#C8962E] text-xs flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} /> {item.loc}
                  </p>
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: catColor(item.cat) + "22", color: catColor(item.cat), border: `1px solid ${catColor(item.cat)}30` }}>
                  {item.cat}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <FadeIn delay={0.3} className="text-center mt-16">
          <p className="text-slate-500 dark:text-white/40 mb-5">Votre projet pourrait figurer dans cette galerie.</p>
          <button onClick={onDevis}
            className="px-10 py-4 rounded-xl font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)", boxShadow: "0 20px 50px rgba(200,150,46,0.25)" }}>
            Démarrer mon projet →
          </button>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <img src={lightboxItem.img.replace("w=600", "w=1200")} alt={lightboxItem.title}
                className="w-full object-cover" style={{ maxHeight: "80vh" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6"
                style={{ background: "linear-gradient(0deg,rgba(6,13,26,0.95),transparent)" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-white text-xl font-bold">{lightboxItem.title}</h3>
                <p className="text-[#C8962E] text-sm flex items-center gap-1.5 mt-1"><MapPin size={12} /> {lightboxItem.loc}</p>
              </div>
              <button onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}