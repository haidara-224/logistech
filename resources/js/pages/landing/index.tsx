import { Head, router, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Trash2, Plus, Save, Image as ImageIcon, Globe,
    HardHat, Truck, Snowflake, Building2, Package,
    Edit2, Check, X, ChevronDown, ChevronUp,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';

// ─── Types ───────────────────────────────────────────────────────────────────

interface HeroImage {
    url: string;
    cat: string;
    title_fr: string;
    title_en: string;
    desc_fr: string;
    desc_en: string;
}

interface HeroLabels {
    badge_fr: string; badge_en: string;
    title1_fr: string; title1_en: string;
    title2_fr: string; title2_en: string;
    subtitle_fr: string; subtitle_en: string;
}

interface ServiceData {
    images: string[];
    title_fr: string; title_en: string;
    short_fr: string; short_en: string;
    desc_fr: string;  desc_en: string;
    features_fr: string[]; features_en: string[];
}

interface GalleryItem {
    id: number; cat: string; title: string | null;
    location: string | null; image_path: string;
    sort_order: number; is_active: boolean;
}

interface Props {
    heroImages: HeroImage[];
    heroLabels: HeroLabels;
    logo: string | null;
    aboutImage: string | null;
    services: Record<string, ServiceData>;
    galleryItems: GalleryItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CAT_OPTIONS = [
    { value: 'charpente', label: 'Charpente' },
    { value: 'transport', label: 'Transport' },
    { value: 'froid',     label: 'Froid' },
    { value: 'batiment',  label: 'Bâtiment' },
];

const CAT_COLORS: Record<string, string> = {
    charpente: '#C8962E', transport: '#3B82F6',
    froid: '#06B6D4',     batiment: '#10B981',
};

const SERVICES_META = [
    { id: 'charpente', label: 'Charpente Métallique', icon: HardHat,    color: '#C8962E' },
    { id: 'transport', label: 'Transport Routier',    icon: Truck,      color: '#3B82F6' },
    { id: 'froid',     label: 'Froid Industriel',     icon: Snowflake,  color: '#06B6D4' },
    { id: 'batiment',  label: 'Bâtiment',             icon: Building2,  color: '#10B981' },
    { id: 'logistique',label: 'Logistique',            icon: Package,    color: '#8B5CF6' },
];

const CSRF = () =>
    (document.querySelector('meta[name=csrf-token]') as HTMLMetaElement)?.content ?? '';

// ─── Shared components ────────────────────────────────────────────────────────

function UploadBtn({ onFile, loading = false, children }: {
    onFile: (f: File) => void; loading?: boolean; children: React.ReactNode;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <>
            <input ref={ref} type="file" accept="image/*" className="hidden"
                onChange={e => { if (e.target.files?.[0]) { onFile(e.target.files[0]); e.target.value = ''; } }} />
            <Button variant="outline" size="sm" disabled={loading} onClick={() => ref.current?.click()} className="gap-2">
                <Upload size={14} />{children}
            </Button>
        </>
    );
}

function BilingualField({ label, valFr, valEn, onFr, onEn, multiline = false }: {
    label: string; valFr: string; valEn: string;
    onFr: (v: string) => void; onEn: (v: string) => void;
    multiline?: boolean;
}) {
    const cls = "mt-1 text-xs " + (multiline ? "min-h-[70px] resize-y" : "h-8");
    return (
        <div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">{label}</p>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label className="text-[10px] text-amber-600">🇫🇷 FR</Label>
                    {multiline
                        ? <textarea value={valFr} onChange={e => onFr(e.target.value)} className={`w-full rounded-md border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 ${cls} text-gray-900 dark:text-white`} />
                        : <Input value={valFr} onChange={e => onFr(e.target.value)} className={cls} />}
                </div>
                <div>
                    <Label className="text-[10px] text-blue-500">🇬🇧 EN</Label>
                    {multiline
                        ? <textarea value={valEn} onChange={e => onEn(e.target.value)} className={`w-full rounded-md border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 ${cls} text-gray-900 dark:text-white`} />
                        : <Input value={valEn} onChange={e => onEn(e.target.value)} className={cls} />}
                </div>
            </div>
        </div>
    );
}

function SaveBtn({ onClick, loading, label = 'Sauvegarder' }: { onClick: () => void; loading: boolean; label?: string }) {
    return (
        <Button size="sm" onClick={onClick} disabled={loading}
            className="gap-2 bg-[#C8962E] hover:bg-[#b8861e] text-white">
            <Save size={14} />{loading ? 'Sauvegarde...' : label}
        </Button>
    );
}

function uploadFile(section: string, file: File): Promise<string> {
    const fd = new FormData();
    fd.append('image', file);
    return fetch(`/dashboard/landing/upload/${section}`, {
        method: 'POST', body: fd,
        headers: { 'X-CSRF-TOKEN': CSRF() },
    }).then(r => r.json()).then(d => d.url as string);
}

// ─── Hero Tab ─────────────────────────────────────────────────────────────────

function HeroTab({ heroImages: initImgs, heroLabels: initLabels }: { heroImages: HeroImage[]; heroLabels: HeroLabels }) {
    const [images, setImages]   = useState<HeroImage[]>(initImgs);
    const [labels, setLabels]   = useState<HeroLabels>(initLabels);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving]   = useState(false);

    const setLabel = (k: keyof HeroLabels, v: string) => setLabels(prev => ({ ...prev, [k]: v }));

    const addImage = async (file: File) => {
        setUploading(true);
        const url = await uploadFile('hero', file);
        setImages(prev => [...prev, { url, cat: 'charpente', title_fr: '', title_en: '', desc_fr: '', desc_en: '' }]);
        setUploading(false);
    };

    const updateImg = (idx: number, field: keyof HeroImage, val: string) =>
        setImages(prev => prev.map((img, i) => i === idx ? { ...img, [field]: val } : img));

    const removeImg = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));

    const save = () => {
        setSaving(true);
        router.post('/dashboard/landing/hero', { images: images as any, labels: labels as any }, {
            preserveScroll: true, onFinish: () => setSaving(false),
        });
    };

    return (
        <div className="space-y-8">
            {/* Labels section */}
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 space-y-5">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Textes du Hero</h3>
                <BilingualField label="Badge" valFr={labels.badge_fr} valEn={labels.badge_en}
                    onFr={v => setLabel('badge_fr', v)} onEn={v => setLabel('badge_en', v)} />
                <BilingualField label="Titre ligne 1" valFr={labels.title1_fr} valEn={labels.title1_en}
                    onFr={v => setLabel('title1_fr', v)} onEn={v => setLabel('title1_en', v)} />
                <BilingualField label="Titre ligne 2" valFr={labels.title2_fr} valEn={labels.title2_en}
                    onFr={v => setLabel('title2_fr', v)} onEn={v => setLabel('title2_en', v)} />
                <BilingualField label="Sous-titre" valFr={labels.subtitle_fr} valEn={labels.subtitle_en}
                    onFr={v => setLabel('subtitle_fr', v)} onEn={v => setLabel('subtitle_en', v)} multiline />
                <p className="text-xs text-gray-400">Laissez vide pour utiliser les traductions par défaut.</p>
            </div>

            {/* Images section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Images du carrousel <span className="font-normal text-gray-400">({images.length}/6)</span></h3>
                    <div className="flex gap-2">
                        <UploadBtn onFile={addImage} loading={uploading || images.length >= 6}>
                            {uploading ? 'Upload...' : 'Ajouter une image'}
                        </UploadBtn>
                        <SaveBtn onClick={save} loading={saving} />
                    </div>
                </div>

                {images.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                        <ImageIcon size={36} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">Aucune image — images par défaut utilisées.</p>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {images.map((img, idx) => (
                        <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
                            <div className="relative aspect-video">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <button onClick={() => removeImg(idx)}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-all">
                                    <Trash2 size={12} />
                                </button>
                                <div className="absolute top-2 left-2 text-[10px] font-bold text-white w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">{idx + 1}</div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <Label className="text-[10px] text-gray-400">Catégorie</Label>
                                    <select value={img.cat} onChange={e => updateImg(idx, 'cat', e.target.value)}
                                        className="mt-1 w-full h-8 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-2 text-xs text-gray-900 dark:text-white">
                                        {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-[10px] text-amber-600">🇫🇷 Titre</Label>
                                        <Input value={img.title_fr} onChange={e => updateImg(idx, 'title_fr', e.target.value)} className="h-7 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] text-blue-500">🇬🇧 Titre</Label>
                                        <Input value={img.title_en} onChange={e => updateImg(idx, 'title_en', e.target.value)} className="h-7 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] text-amber-600">🇫🇷 Desc</Label>
                                        <Input value={img.desc_fr} onChange={e => updateImg(idx, 'desc_fr', e.target.value)} className="h-7 text-xs mt-1" />
                                    </div>
                                    <div>
                                        <Label className="text-[10px] text-blue-500">🇬🇧 Desc</Label>
                                        <Input value={img.desc_en} onChange={e => updateImg(idx, 'desc_en', e.target.value)} className="h-7 text-xs mt-1" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Logo Tab ─────────────────────────────────────────────────────────────────

function LogoTab({ logo: init }: { logo: string | null }) {
    const [logo, setLogo]   = useState(init);
    const [loading, setLoading] = useState(false);

    const upload = async (file: File) => {
        setLoading(true);
        const fd = new FormData();
        fd.append('image', file);
        const data = await fetch('/dashboard/landing/logo', {
            method: 'POST', body: fd, headers: { 'X-CSRF-TOKEN': CSRF() },
        }).then(r => r.json());
        setLogo(data.url);
        setLoading(false);
    };

    return (
        <div className="max-w-sm space-y-4">
            <p className="text-sm text-gray-500 dark:text-white/40">Logo affiché dans la navbar et le loading screen.</p>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 flex flex-col items-center gap-4">
                {logo
                    ? <img src={logo} alt="Logo" className="w-32 h-32 object-contain rounded-xl border border-gray-200 dark:border-white/10" />
                    : <div className="w-32 h-32 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center"><ImageIcon size={36} className="text-gray-300" /></div>}
                <UploadBtn onFile={upload} loading={loading}>
                    {loading ? 'Upload...' : logo ? 'Changer le logo' : 'Uploader le logo'}
                </UploadBtn>
            </div>
        </div>
    );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────

function ServiceCard({ meta, initData }: { meta: typeof SERVICES_META[0]; initData: ServiceData }) {
    const [data, setData]     = useState<ServiceData>(initData);
    const [open, setOpen]     = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const set = (field: keyof ServiceData, val: any) => setData(prev => ({ ...prev, [field]: val }));
    const setFeature = (lang: 'fr' | 'en', idx: number, val: string) => {
        const key = `features_${lang}` as keyof ServiceData;
        const arr = [...(data[key] as string[])];
        arr[idx] = val;
        set(key, arr);
    };

    const addImage = async (file: File) => {
        setUploading(true);
        const url = await uploadFile(meta.id, file);
        set('images', [...data.images, url]);
        setUploading(false);
    };

    const removeImage = (idx: number) => set('images', data.images.filter((_, i) => i !== idx));

    const save = () => {
        setSaving(true);
        router.post(`/dashboard/landing/services/${meta.id}`, data as any, {
            preserveScroll: true, onFinish: () => setSaving(false),
        });
    };

    const Icon = meta.icon;

    return (
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
            {/* Header */}
            <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}15` }}>
                        <Icon size={18} style={{ color: meta.color }} />
                    </div>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{meta.label}</span>
                    <Badge variant="secondary" className="text-[10px]">{data.images.length} photo{data.images.length > 1 ? 's' : ''}</Badge>
                    {(data.title_fr || data.title_en) && <Badge className="text-[10px] bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">Labels ✓</Badge>}
                </div>
                {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden">
                        <div className="px-5 pb-6 space-y-6 border-t border-gray-100 dark:border-white/5 pt-5">

                            {/* Labels */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">Labels</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <BilingualField label="Titre" valFr={data.title_fr} valEn={data.title_en}
                                        onFr={v => set('title_fr', v)} onEn={v => set('title_en', v)} />
                                    <BilingualField label="Sous-titre court" valFr={data.short_fr} valEn={data.short_en}
                                        onFr={v => set('short_fr', v)} onEn={v => set('short_en', v)} />
                                </div>
                                <BilingualField label="Description" valFr={data.desc_fr} valEn={data.desc_en}
                                    onFr={v => set('desc_fr', v)} onEn={v => set('desc_en', v)} multiline />
                            </div>

                            {/* Features */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Features ({data.features_fr.length})</h4>
                                <div className="space-y-2">
                                    {data.features_fr.map((_, idx) => (
                                        <div key={idx} className="grid grid-cols-2 gap-2 items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-amber-600 font-semibold w-4">🇫🇷</span>
                                                <Input value={data.features_fr[idx] ?? ''} onChange={e => setFeature('fr', idx, e.target.value)} className="h-7 text-xs" placeholder={`Feature ${idx + 1} FR`} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-blue-500 font-semibold w-4">🇬🇧</span>
                                                <Input value={data.features_en[idx] ?? ''} onChange={e => setFeature('en', idx, e.target.value)} className="h-7 text-xs" placeholder={`Feature ${idx + 1} EN`} />
                                            </div>
                                        </div>
                                    ))}
                                    {data.features_fr.length < 6 && (
                                        <button onClick={() => { set('features_fr', [...data.features_fr, '']); set('features_en', [...data.features_en, '']); }}
                                            className="text-xs text-[#C8962E] hover:underline flex items-center gap-1 mt-1">
                                            <Plus size={11} /> Ajouter une feature
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Images */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-white/40 uppercase tracking-wider">Photos du service</h4>
                                    <UploadBtn onFile={addImage} loading={uploading}>
                                        {uploading ? 'Upload...' : 'Ajouter'}
                                    </UploadBtn>
                                </div>
                                {data.images.length === 0 ? (
                                    <p className="text-xs text-gray-400 py-3 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-lg">Photos par défaut utilisées</p>
                                ) : (
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                        {data.images.map((url, idx) => (
                                            <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square">
                                                <img src={url} alt="" className="w-full h-full object-cover" />
                                                <button onClick={() => removeImage(idx)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                                    <Trash2 size={14} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <SaveBtn onClick={save} loading={saving} label={`Sauvegarder ${meta.label}`} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ServicesTab({ services }: { services: Record<string, ServiceData> }) {
    const empty: ServiceData = { images: [], title_fr: '', title_en: '', short_fr: '', short_en: '', desc_fr: '', desc_en: '', features_fr: ['', '', '', ''], features_en: ['', '', '', ''] };
    return (
        <div className="space-y-3">
            {SERVICES_META.map(meta => (
                <ServiceCard key={meta.id} meta={meta} initData={services[meta.id] ?? empty} />
            ))}
        </div>
    );
}

// ─── About Tab ────────────────────────────────────────────────────────────────

function AboutTab({ aboutImage: init }: { aboutImage: string | null }) {
    const [img, setImg]     = useState(init);
    const [loading, setLoading] = useState(false);

    const upload = async (file: File) => {
        setLoading(true);
        const fd = new FormData();
        fd.append('image', file);
        const data = await fetch('/dashboard/landing/about', {
            method: 'POST', body: fd, headers: { 'X-CSRF-TOKEN': CSRF() },
        }).then(r => r.json());
        setImg(data.url);
        setLoading(false);
    };

    return (
        <div className="max-w-lg space-y-4">
            <p className="text-sm text-gray-500 dark:text-white/40">Image principale de la section "À propos". Les textes sont gérés via les traductions.</p>
            <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
                {img
                    ? <img src={img} alt="" className="w-full aspect-[4/3] object-cover" />
                    : <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-white/5 flex flex-col items-center justify-center gap-2">
                        <ImageIcon size={36} className="text-gray-300" />
                        <p className="text-xs text-gray-400">Image par défaut utilisée</p>
                    </div>}
                <div className="p-4 flex justify-end">
                    <UploadBtn onFile={upload} loading={loading}>
                        {loading ? 'Upload...' : img ? "Changer l'image" : 'Uploader une image'}
                    </UploadBtn>
                </div>
            </div>
        </div>
    );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────

function GalerieTab({ galleryItems: init }: { galleryItems: GalleryItem[] }) {
    const [items, setItems]   = useState<GalleryItem[]>(init);
    const [editId, setEditId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const addForm = useForm({ cat: 'charpente', title: '', location: '', image: null as File | null });

    const submitAdd = () => {
        if (!addForm.data.image) { return; }
        setUploading(true);
        router.post('/dashboard/landing/gallery', {
            image: addForm.data.image, cat: addForm.data.cat,
            title: addForm.data.title, location: addForm.data.location,
        } as any, {
            forceFormData: true, preserveScroll: true,
            onSuccess: (page) => {
                setShowAdd(false); addForm.reset();
                // Refresh items from page props
                const newItems = (page.props as any).galleryItems;
                if (newItems) { setItems(newItems); }
            },
            onFinish: () => setUploading(false),
        });
    };

    const deleteItem = (id: number) => {
        router.delete(`/dashboard/landing/gallery/${id}`, {
            preserveScroll: true,
            onSuccess: () => setItems(prev => prev.filter(i => i.id !== id)),
        });
    };

    const toggleActive = (item: GalleryItem) => {
        router.put(`/dashboard/landing/gallery/${item.id}`,
            { cat: item.cat, title: item.title, location: item.location, is_active: !item.is_active },
            { preserveScroll: true, onSuccess: () => setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i)) }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-white/40">
                    {items.length} photo{items.length > 1 ? 's' : ''} — les catégories correspondent aux filtres de la galerie
                </p>
                <Button size="sm" onClick={() => setShowAdd(v => !v)} className="gap-2 bg-[#C8962E] hover:bg-[#b8861e] text-white">
                    <Plus size={14} />Ajouter une photo
                </Button>
            </div>

            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-[#C8962E]/30 bg-amber-50/50 dark:bg-[#C8962E]/5 p-5">
                        <h4 className="font-semibold text-sm mb-4">Nouvelle photo</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs">Image *</Label>
                                <div className="mt-1">
                                    {addForm.data.image
                                        ? <div className="relative rounded-lg overflow-hidden aspect-video">
                                            <img src={URL.createObjectURL(addForm.data.image)} alt="" className="w-full h-full object-cover" />
                                            <button onClick={() => addForm.setData('image', null)}
                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                                                <X size={12} />
                                            </button>
                                        </div>
                                        : <UploadBtn onFile={f => addForm.setData('image', f)}>Choisir une image</UploadBtn>}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-xs">Catégorie * <span className="text-gray-400">(utilisée pour les filtres)</span></Label>
                                    <select value={addForm.data.cat} onChange={e => addForm.setData('cat', e.target.value)}
                                        className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                                        {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <Label className="text-xs">Titre</Label>
                                    <Input value={addForm.data.title} onChange={e => addForm.setData('title', e.target.value)} className="mt-1 h-9 text-sm" placeholder="ex: Charpente Industrielle" />
                                </div>
                                <div>
                                    <Label className="text-xs">Localisation</Label>
                                    <Input value={addForm.data.location} onChange={e => addForm.setData('location', e.target.value)} className="mt-1 h-9 text-sm" placeholder="ex: Conakry" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Annuler</Button>
                            <Button size="sm" onClick={submitAdd} disabled={!addForm.data.image || uploading}
                                className="bg-[#C8962E] hover:bg-[#b8861e] text-white gap-2">
                                {uploading ? 'Ajout...' : <><Plus size={13} />Ajouter</>}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {items.length === 0 && !showAdd && (
                <div className="text-center py-16 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400">Aucune photo. Les photos par défaut sont affichées.</p>
                </div>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(item => (
                    <motion.div key={item.id} layout
                        className={`rounded-xl border overflow-hidden bg-white dark:bg-white/5 ${item.is_active ? 'border-gray-200 dark:border-white/10' : 'opacity-60 border-gray-200/50 dark:border-white/5'}`}>
                        <div className="relative aspect-[4/3]">
                            <img src={item.image_path} alt={item.title ?? ''} className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium backdrop-blur-sm"
                                    style={{ background: `${CAT_COLORS[item.cat]}22`, color: CAT_COLORS[item.cat], border: `1px solid ${CAT_COLORS[item.cat]}40` }}>
                                    {item.cat}
                                </span>
                            </div>
                        </div>
                        <div className="p-3">
                            {editId === item.id
                                ? <EditGalleryItem item={item} onDone={() => setEditId(null)} onUpdated={updated => setItems(prev => prev.map(i => i.id === updated.id ? updated : i))} />
                                : <>
                                    <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{item.title || '—'}</p>
                                    <p className="text-xs text-gray-400 truncate">{item.location || '—'}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <button onClick={() => toggleActive(item)}
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.is_active ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 'bg-gray-100 text-gray-400 dark:bg-white/5'}`}>
                                            {item.is_active ? 'Visible' : 'Masqué'}
                                        </button>
                                        <div className="flex gap-1">
                                            <button onClick={() => setEditId(item.id)} className="w-6 h-6 rounded hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center">
                                                <Edit2 size={12} className="text-gray-400" />
                                            </button>
                                            <button onClick={() => deleteItem(item.id)} className="w-6 h-6 rounded hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center">
                                                <Trash2 size={12} className="text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function EditGalleryItem({ item, onDone, onUpdated }: { item: GalleryItem; onDone: () => void; onUpdated: (i: GalleryItem) => void }) {
    const form = useForm({ cat: item.cat, title: item.title ?? '', location: item.location ?? '', is_active: item.is_active });

    const save = () => {
        form.put(`/dashboard/landing/gallery/${item.id}`, {
            preserveScroll: true,
            onSuccess: () => { onUpdated({ ...item, ...form.data }); onDone(); },
        });
    };

    return (
        <div className="space-y-2">
            <select value={form.data.cat} onChange={e => form.setData('cat', e.target.value)}
                className="w-full h-8 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-2 text-xs text-gray-900 dark:text-white">
                {CAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <Input value={form.data.title} onChange={e => form.setData('title', e.target.value)} className="h-8 text-xs" placeholder="Titre" />
            <Input value={form.data.location} onChange={e => form.setData('location', e.target.value)} className="h-8 text-xs" placeholder="Localisation" />
            <div className="flex gap-1 justify-end">
                <button onClick={onDone} className="w-6 h-6 rounded bg-gray-100 dark:bg-white/10 flex items-center justify-center"><X size={11} /></button>
                <button onClick={save} className="w-6 h-6 rounded bg-[#C8962E] text-white flex items-center justify-center"><Check size={11} /></button>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingAdmin({ heroImages, heroLabels, logo, aboutImage, services, galleryItems }: Props) {
    return (
        <>
            <Head title="Page d'accueil" />
            <div className="px-4 py-6 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#C8962E]/10 flex items-center justify-center">
                        <Globe size={20} className="text-[#C8962E]" />
                    </div>
                    <Heading title="Gestion de la page d'accueil" description="Modifiez les images et textes de chaque section." />
                </div>

                <Tabs defaultValue="hero">
                    <TabsList className="flex-wrap h-auto gap-1">
                        <TabsTrigger value="hero">🖼 Hero</TabsTrigger>
                        <TabsTrigger value="logo">🔰 Logo</TabsTrigger>
                        <TabsTrigger value="services">🔧 Services</TabsTrigger>
                        <TabsTrigger value="about">🏢 À propos</TabsTrigger>
                        <TabsTrigger value="galerie">📷 Galerie</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                        <TabsContent value="hero"><HeroTab heroImages={heroImages} heroLabels={heroLabels} /></TabsContent>
                        <TabsContent value="logo"><LogoTab logo={logo} /></TabsContent>
                        <TabsContent value="services"><ServicesTab services={services} /></TabsContent>
                        <TabsContent value="about"><AboutTab aboutImage={aboutImage} /></TabsContent>
                        <TabsContent value="galerie"><GalerieTab galleryItems={galleryItems} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </>
    );
}

LandingAdmin.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: "Page d'accueil", href: '/dashboard/landing' },
    ],
};
