import { useState, useMemo } from 'react';
import { Form } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Pencil, ArrowRight, Package, ChevronDown, Search, X, Check, Phone, Truck, History, Calendar } from 'lucide-react';
import { ThemedInput, ThemedSelect, ThemedTextarea, Button, StatusBadge, Panel, DrawerPanel, EmptyState, FilterBar, Pagination } from './Ui';
import { Camion, Chauffeur, Expedition, Produit } from '@/types/logistique';

const PER_PAGE = 6;
const PRODUITS_PER_PAGE = 8;

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'en préparation', label: 'En préparation' },
    { value: 'en cours', label: 'En cours' },
    { value: 'livré', label: 'Livré' },
    { value: 'annulé', label: 'Annulé' },
];

interface ProductRowState {
    produit_id: number | string;
    quantite: number;
    produit?: Produit;
}

interface ProductRowProps {
    row: ProductRowState;
    index: number;
    onUpdate: (index: number, key: 'produit_id' | 'quantite', value: string | number, produit?: Produit) => void;
    onRemove: (index: number) => void;
    onOpenModal: (index: number) => void;
    produits: Produit[];
    errors?: Record<string, string>;
}

function ProductRow({ row, index, onUpdate, onRemove, onOpenModal, errors }: ProductRowProps) {
    const errProduit  = errors?.[`produits.${index}.produit_id`];
    const errQuantite = errors?.[`produits.${index}.quantite`];

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-muted/30 p-4"
        >
            {/* Hidden input so produit_id is included in form submission */}
            <input type="hidden" name={`produits[${index}][produit_id]`} value={row.produit_id} />

            <div className="grid grid-cols-[1fr_100px_auto] gap-3 items-end">
                <div>
                    {index === 0 && (
                        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                            Produit
                        </label>
                    )}
                    <button
                        type="button"
                        onClick={() => onOpenModal(index)}
                        className={`w-full bg-card border rounded-xl px-3.5 py-2.5 text-sm text-foreground text-left flex items-center justify-between hover:border-ring transition-all duration-200 cursor-pointer ${errProduit ? 'border-destructive' : 'border-border'}`}
                    >
                        <span className={row.produit_id ? 'text-foreground' : 'text-muted-foreground/50'}>
                            {row.produit ? `${row.produit.nom} (${row.produit.sku})` : 'Sélectionner un produit'}
                        </span>
                        <ChevronDown size={14} className="text-muted-foreground" />
                    </button>
                    {errProduit && <p className="text-xs text-destructive mt-1">{errProduit}</p>}
                </div>
                <div>
                    <ThemedInput
                        label={index === 0 ? 'Qté' : undefined}
                        type="number"
                        min={1}
                        value={row.quantite}
                        onChange={e => onUpdate(index, 'quantite', e.target.value)}
                        name={`produits[${index}][quantite]`}
                        error={errQuantite}
                    />
                </div>
                <Button variant="danger" size="sm" type="button" onClick={() => onRemove(index)}>
                    <Trash2 size={12} className='text-white' />
                </Button>
            </div>
        </motion.div>
    );
}

// ── Product selection modal ───────────────────────────────────────────────────
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    produits: Produit[];
    onSelect: (produit: Produit) => void;
}

function ProductModal({ isOpen, onClose, produits, onSelect }: ProductModalProps) {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return produits;
        return produits.filter(p => 
            p.nom.toLowerCase().includes(q) || 
            p.sku.toLowerCase().includes(q)
        );
    }, [produits, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUITS_PER_PAGE));
    const paginated = filtered.slice((page - 1) * PRODUITS_PER_PAGE, page * PRODUITS_PER_PAGE);

    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(1);
    };

    const handleSelect = (produit: Produit) => {
        onSelect(produit);
        onClose();
        setSearch('');
        setPage(1);
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Sélectionner un produit</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Choisissez un produit à ajouter à l'expédition</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                    >
                        <X size={16} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Modal search */}
                <div className="p-5 border-b border-border">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            placeholder="Rechercher par nom ou SKU..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted/30 border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Modal product list */}
                <div className="max-h-100 overflow-y-auto p-2">
                    {paginated.length === 0 ? (
                        <div className="text-center py-12">
                            <Package size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">
                                {search ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {paginated.map((produit) => (
                                <button
                                    key={produit.id}
                                    onClick={() => handleSelect(produit)}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left cursor-pointer group"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-foreground">{produit.nom}</span>
                                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                {produit.sku}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Stock: {produit.quantite_stock} unités
                                        </p>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
                                        <Check size={12} className="text-muted-foreground group-hover:text-primary" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modal pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                            {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronDown size={14} className="rotate-90" />
                            </button>
                            <span className="text-xs text-foreground px-2">
                                Page {page} / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronDown size={14} className="-rotate-90" />
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

interface NewExpeditionFormProps {
    camionsDisponibles: Camion[];
    chauffeursDisponibles: Chauffeur[];
    produits: Produit[];
}

function NewExpeditionForm({ camionsDisponibles, chauffeursDisponibles, produits }: NewExpeditionFormProps) {
    const [rows, setRows] = useState<ProductRowState[]>([
        { produit_id: '', quantite: 1, produit: undefined },
    ]);
    const [modalIndex, setModalIndex] = useState<number | null>(null);

    const addRow = () => setRows(prev => [...prev, { produit_id: '', quantite: 1, produit: undefined }]);
    const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));
    const updateRow = (i: number, key: 'produit_id' | 'quantite', val: string | number, produit?: Produit) => {
        setRows(prev => {
            const next = [...prev];
            if (key === 'produit_id') {
                next[i] = { ...next[i], produit_id: val, produit };
            } else {
                next[i] = { ...next[i], quantite: Number(val) };
            }
            return next;
        });
    };

    const handleSelectProduct = (index: number, produit: Produit) => {
        updateRow(index, 'produit_id', produit.id, produit);
    };

    return (
        <>
            <Form method="post" action="/dashboard/logistique/expeditions" className="space-y-4">
                {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <ThemedSelect name="camion_id" label="Camion" error={errors.camion_id}>
                                {camionsDisponibles.length === 0
                                    ? <option value="">Aucun camion disponible</option>
                                    : camionsDisponibles.map(c => (
                                        <option key={c.id} value={c.id}>{c.immatriculation} — {c.marque}</option>
                                    ))
                                }
                            </ThemedSelect>
                            <ThemedSelect name="chauffeur_id" label="Chauffeur" error={errors.chauffeur_id}>
                                {chauffeursDisponibles.length === 0
                                    ? <option value="">Aucun chauffeur disponible</option>
                                    : chauffeursDisponibles.map(c => (
                                        <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                                    ))
                                }
                            </ThemedSelect>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <ThemedInput name="origine" label="Origine" placeholder="Entrepôt principal" error={errors.origine} />
                            <ThemedInput name="destination" label="Destination" placeholder="Site client" error={errors.destination} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <ThemedInput name="date_depart" label="Date de départ" type="date" error={errors.date_depart} />
                            <ThemedInput name="date_arrivee_prevue" label="Arrivée prévue" type="date" error={errors.date_arrivee_prevue} />
                        </div>

                        <ThemedSelect name="statut" label="Statut" error={errors.statut}>
                            <option value="en préparation">En préparation</option>
                            <option value="en cours">En cours</option>
                            <option value="livré">Livré</option>
                            <option value="annulé">Annulé</option>
                        </ThemedSelect>

                        <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                                Produits à livrer
                            </label>
                            <AnimatePresence>
                                {rows.map((row, i) => (
                                    <ProductRow
                                        key={i}
                                        row={row}
                                        index={i}
                                        produits={produits}
                                        onUpdate={updateRow}
                                        onRemove={removeRow}
                                        onOpenModal={(idx) => setModalIndex(idx)}
                                        errors={errors}
                                    />
                                ))}
                            </AnimatePresence>
                            <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full">
                                <Plus size={12} />
                                Ajouter un produit
                            </Button>
                            {errors.produits && <p className="text-xs text-destructive">{errors.produits}</p>}
                        </div>

                        <ThemedTextarea name="details" label="Détails" rows={3} placeholder="Observations sur le chargement…" />

                        <Button type="submit" disabled={processing} className="w-full">
                            <Plus size={14} />
                            Créer l'expédition
                        </Button>
                    </>
                )}
            </Form>

            {/* Product selection modal */}
            <ProductModal
                isOpen={modalIndex !== null}
                onClose={() => setModalIndex(null)}
                produits={produits}
                onSelect={(produit) => {
                    if (modalIndex !== null) {
                        handleSelectProduct(modalIndex, produit);
                        setModalIndex(null);
                    }
                }}
            />
        </>
    );
}

interface EditExpeditionFormProps {
    expedition: Expedition;
    camions: Camion[];
    chauffeurs: Chauffeur[];
}

function EditExpeditionForm({ expedition, camions, chauffeurs }: EditExpeditionFormProps) {
    return (
        <Form method="put" action={`/dashboard/logistique/expeditions/${expedition.id}`} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="reference" label="Référence" defaultValue={expedition.reference} />
                <ThemedSelect name="statut" label="Statut" defaultValue={expedition.statut}>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours">En cours</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                </ThemedSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="origine" label="Origine" defaultValue={expedition.origine} />
                <ThemedInput name="destination" label="Destination" defaultValue={expedition.destination} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="date_depart" label="Date départ" type="date" defaultValue={expedition.date_depart ?? ''} />
                <ThemedInput name="date_arrivee_prevue" label="Arrivée prévue" type="date" defaultValue={expedition.date_arrivee_prevue ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedSelect name="camion_id" label="Camion" defaultValue={expedition.camion?.id}>
                    {camions.map(c => <option key={c.id} value={c.id}>{c.immatriculation}</option>)}
                </ThemedSelect>
                <ThemedSelect name="chauffeur_id" label="Chauffeur" defaultValue={expedition.chauffeur?.id}>
                    {chauffeurs.map(c => (
                        <option key={c.id} value={c.id}>{[c.nom, c.prenom].filter(Boolean).join(' ')}</option>
                    ))}
                </ThemedSelect>
            </div>
            <Button type="submit" className="w-full">
                Enregistrer les modifications
            </Button>
        </Form>
    );
}

interface ExpeditionCardProps {
    expedition: Expedition;
    index: number;
    onEdit: (id: number) => void;
}

function ExpeditionCard({ expedition, index, onEdit }: ExpeditionCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
            <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <MapPin size={13} className="text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                        {expedition.reference}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{expedition.origine}</span>
                        <ArrowRight size={10} className="shrink-0 text-muted-foreground/30" />
                        <span className="truncate">{expedition.destination}</span>
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{expedition.camion?.immatriculation ?? '—'}</span>
                    <span className="text-border">·</span>
                    <span>{[expedition.chauffeur?.nom, expedition.chauffeur?.prenom].filter(Boolean).join(' ') || '—'}</span>
                </div>

                <StatusBadge status={expedition.statut} />

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(expedition.id)}>
                        <Pencil size={12} />
                    </Button>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
                    >
                        <ChevronDown
                            size={13}
                            className={`text-muted-foreground transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border bg-muted/20"
                    >
                        {/* Actions */}
                        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                            <Form method="patch" action={`/dashboard/logistique/expeditions/${expedition.id}/statut`} className="flex gap-2 flex-1">
                                <select
                                    name="statut"
                                    defaultValue={expedition.statut}
                                    className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-ring"
                                >
                                    <option value="en préparation">En préparation</option>
                                    <option value="en cours">En cours</option>
                                    <option value="livré">Livré</option>
                                    <option value="annulé">Annulé</option>
                                </select>
                                <Button type="submit" variant="secondary" size="sm">MAJ statut</Button>
                            </Form>
                            <Form method="delete" action={`/dashboard/logistique/expeditions/${expedition.id}`}>
                                <Button type="submit" variant="danger" size="sm" className="text-white">
                                    <Trash2 size={12} className="text-white" />
                                </Button>
                            </Form>
                        </div>

                        {/* Info grid: chauffeur + camion */}
                        <div className="grid grid-cols-2 gap-2 px-4 pb-2">
                            {expedition.chauffeur && (
                                <div className="rounded-lg bg-card border border-border px-3 py-2">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Chauffeur</p>
                                    <p className="text-xs font-semibold text-foreground">
                                        {[expedition.chauffeur.nom, expedition.chauffeur.prenom].filter(Boolean).join(' ')}
                                    </p>
                                    {expedition.chauffeur.telephone && (
                                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <Phone size={9} />
                                            {expedition.chauffeur.telephone}
                                        </p>
                                    )}
                                </div>
                            )}
                            {expedition.camion && (
                                <div className="rounded-lg bg-card border border-border px-3 py-2">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Camion</p>
                                    <p className="text-xs font-semibold text-foreground">{expedition.camion.immatriculation}</p>
                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <Truck size={9} />
                                        {[expedition.camion.marque, expedition.camion.modele].filter(Boolean).join(' ') || 'Modèle non précisé'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Dates */}
                        {(expedition.date_depart || expedition.date_arrivee_prevue) && (
                            <div className="flex items-center gap-4 px-4 pb-2 text-[11px] text-muted-foreground">
                                <Calendar size={10} className="shrink-0" />
                                {expedition.date_depart && (
                                    <span>Départ : <span className="text-foreground font-medium">{new Date(expedition.date_depart).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
                                )}
                                {expedition.date_arrivee_prevue && (
                                    <span>Arrivée prévue : <span className="text-foreground font-medium">{new Date(expedition.date_arrivee_prevue).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
                                )}
                            </div>
                        )}

                        {/* Products */}
                        {expedition.produits?.length > 0 && (
                            <div className="px-4 pb-2">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <Package size={10} /> Produits ({expedition.produits.length})
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {expedition.produits.map(p => (
                                        <span key={p.id} className="text-[11px] bg-card border border-border rounded-md px-2 py-0.5 text-foreground">
                                            {p.nom} <span className="text-muted-foreground">×{p.pivot?.quantite}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Livraisons history */}
                        {expedition.livraisons && expedition.livraisons.length > 0 && (
                            <div className="px-4 pb-3">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <History size={10} /> Historique des mises à jour
                                </p>
                                <div className="space-y-1.5">
                                    {expedition.livraisons.map((l) => (
                                        <div key={l.id} className="flex items-center gap-2 text-[11px]">
                                            <span className="text-muted-foreground shrink-0 w-20">
                                                {l.date_statut ? new Date(l.date_statut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—'}
                                            </span>
                                            <StatusBadge status={l.etat} />
                                            {l.commentaire && (
                                                <span className="text-muted-foreground truncate">{l.commentaire}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        {expedition.details && (
                            <div className="px-4 pb-3 text-[11px] text-muted-foreground italic border-t border-border/50 pt-2">
                                {expedition.details}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

interface ExpeditionsTabProps {
    expeditions: Expedition[];
    camionsDisponibles: Camion[];
    chauffeursDisponibles: Chauffeur[];
    camions: Camion[];
    chauffeurs: Chauffeur[];
    produits: Produit[];
}

export default function ExpeditionsTab({
    expeditions,
    camionsDisponibles,
    chauffeursDisponibles,
    camions,
    chauffeurs,
    produits,
}: ExpeditionsTabProps) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return expeditions.filter(e => {
            const matchesFilter = filter === 'all' || e.statut === filter;
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                e.reference.toLowerCase().includes(q) ||
                e.origine.toLowerCase().includes(q) ||
                e.destination.toLowerCase().includes(q) ||
                (e.camion?.immatriculation ?? '').toLowerCase().includes(q) ||
                (e.chauffeur?.nom ?? '').toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [expeditions, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const editing = expeditions.find(e => e.id === editId) ?? null;

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleFilter = (v: string) => { setFilter(v); setPage(1); };

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
            <Panel
                title="Expéditions"
                subtitle={`${filtered.length} expédition${filtered.length !== 1 ? 's' : ''}`}
                action={
                    <Button variant="secondary" size="sm" onClick={() => { setShowNew(true); setEditId(null); }}>
                        <Plus size={13} />
                        Nouvelle
                    </Button>
                }
            >
                <FilterBar
                    search={search}
                    onSearch={handleSearch}
                    filterValue={filter}
                    onFilter={handleFilter}
                    filterOptions={FILTER_OPTIONS}
                    placeholder="Référence, origine, destination…"
                    filterLabel="Statut expédition"
                />

                {paginated.length === 0 ? (
                    <EmptyState 
                        message={search || filter !== 'all' ? 'Aucun résultat pour ces filtres' : 'Aucune expédition enregistrée'} 
                        icon={<MapPin size={32} />}
                    />
                ) : (
                    <div className="space-y-2">
                        {paginated.map((exp, i) => (
                            <ExpeditionCard
                                key={exp.id}
                                expedition={exp}
                                index={i}
                                onEdit={(id) => { setEditId(id); setShowNew(false); }}
                            />
                        ))}
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPage={setPage}
                    total={filtered.length}
                    perPage={PER_PAGE}
                />
            </Panel>

            <div className="space-y-4">
                <DrawerPanel open={showNew} onClose={() => setShowNew(false)} title="Nouvelle expédition" subtitle="Configurez les détails du transport">
                    <NewExpeditionForm
                        camionsDisponibles={camionsDisponibles}
                        chauffeursDisponibles={chauffeursDisponibles}
                        produits={produits}
                    />
                </DrawerPanel>

                <DrawerPanel open={!!editing} onClose={() => setEditId(null)} title="Modifier l'expédition" subtitle={editing?.reference}>
                    {editing && <EditExpeditionForm expedition={editing} camions={camions} chauffeurs={chauffeurs} />}
                </DrawerPanel>

                {!showNew && !editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-border bg-card p-5 text-center"
                    >
                        <MapPin size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground/50">
                            Créez une nouvelle expédition ou modifiez-en une existante.
                        </p>
                        <Button variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Créer une expédition
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}