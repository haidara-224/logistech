import { useState } from "react";
import { FadeIn } from "./ui-primitives";
import { Filter, MapPin, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type GalleryFilter = "tous" | "charpente" | "transport" | "froid" | "batiment";
const GALLERY_ITEMS = [
  { id: 1, cat: "charpente" as GalleryFilter, img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", title: "Charpente Industrielle", loc: "Conakry" },
  { id: 2, cat: "transport" as GalleryFilter, img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80", title: "Flotte de Transport", loc: "Route Coyah" },
  { id: 3, cat: "froid" as GalleryFilter, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", title: "Chambre Froide", loc: "Port de Conakry" },
  { id: 4, cat: "batiment" as GalleryFilter, img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80", title: "Complexe Résidentiel", loc: "Kipé" },
  { id: 5, cat: "charpente" as GalleryFilter, img: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80", title: "Hangar Agricole", loc: "Kindia" },
  { id: 6, cat: "transport" as GalleryFilter, img: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80", title: "Transport International", loc: "Labé" },
  { id: 7, cat: "batiment" as GalleryFilter, img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", title: "Bâtiment Commercial", loc: "Matam" },
  { id: 8, cat: "froid" as GalleryFilter, img: "https://images.unsplash.com/photo-1581093804475-577d72e35d50?w=600&q=80", title: "Installation Frigorifique", loc: "Ratoma" },
  { id: 9, cat: "charpente" as GalleryFilter, img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&q=80", title: "Structure Métallique", loc: "Dixinn" },
];

const GALLERY_FILTERS: { key: GalleryFilter; label: string; color: string }[] = [
  { key: "tous", label: "Tous", color: "#C8962E" },
  { key: "charpente", label: "Charpente", color: "#C8962E" },
  { key: "transport", label: "Transport", color: "#3B82F6" },
  { key: "froid", label: "Froid", color: "#06B6D4" },
  { key: "batiment", label: "Bâtiment", color: "#10B981" },
];

export function Gallery({ onDevis }: { onDevis: () => void }) {
  const [filter, setFilter] = useState<GalleryFilter>("tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "tous" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(i => i.cat === filter);
  const activeFilter = GALLERY_FILTERS.find(f => f.key === filter)!;

  return (
    <section id="gallery" className="relative py-32" style={{ background: "#060D1A" }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(200,150,46,0.3),transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <span className="text-[#C8962E] text-xs uppercase tracking-[0.3em] font-medium">Portfolio</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif" }} className="text-5xl lg:text-7xl font-bold text-white mt-3">
            Nos Réalisations
          </h2>
        </FadeIn>

        {/* Filter bar */}
        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-3 mb-12">
          {GALLERY_FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
              style={{
                background: filter === f.key ? f.color : "rgba(255,255,255,0.04)",
                color: filter === f.key ? "black" : "rgba(255,255,255,0.5)",
                border: `1px solid ${filter === f.key ? f.color : "rgba(255,255,255,0.08)"}`,
                fontWeight: filter === f.key ? "700" : "500",
              }}
            >
              {filter === f.key && <Filter size={13} />}
              {f.label}
              <span className="text-xs opacity-60">
                ({f.key === "tous" ? GALLERY_ITEMS.length : GALLERY_ITEMS.filter(i => i.cat === f.key).length})
              </span>
            </button>
          ))}
        </FadeIn>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setLightbox(item.id)}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                style={{ aspectRatio: i % 5 === 0 ? "1/1.3" : "4/3" }}
              >
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-400" style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.9) 0%, rgba(200,150,46,0.1) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-[#C8962E] text-xs flex items-center gap-1.5 mt-0.5">
                    <MapPin size={10} /> {item.loc}
                  </p>
                </div>
                {/* Category badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: (GALLERY_FILTERS.find(f => f.key === item.cat)?.color ?? "#C8962E") + "22", color: GALLERY_FILTERS.find(f => f.key === item.cat)?.color ?? "#C8962E", border: `1px solid ${(GALLERY_FILTERS.find(f => f.key === item.cat)?.color ?? "#C8962E")}30` }}>
                  {item.cat}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <FadeIn delay={0.3} className="text-center mt-16">
          <p className="text-white/40 mb-5">Votre projet pourrait figurer dans cette galerie.</p>
          <button onClick={onDevis} className="px-10 py-4 rounded-xl font-bold text-black transition-all hover:brightness-110 hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg,#C8962E,#E8B84B)", boxShadow: "0 20px 50px rgba(200,150,46,0.25)" }}>
            Démarrer mon projet →
          </button>
        </FadeIn>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (() => {
          const item = GALLERY_ITEMS.find(i => i.id === lightbox)!;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}>
              <div className="absolute inset-0 bg-black/90 backdrop-blur-lg" />
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}>
                <img src={item.img.replace("w=600", "w=1200")} alt={item.title} className="w-full object-cover" style={{ maxHeight: "80vh" }} />
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(0deg, rgba(6,13,26,0.95), transparent)" }}>
                  <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond',serif" }}>{item.title}</h3>
                  <p className="text-[#C8962E] text-sm flex items-center gap-1.5 mt-1"><MapPin size={12} /> {item.loc}</p>
                </div>
                <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80">
                  <X size={16} />
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
