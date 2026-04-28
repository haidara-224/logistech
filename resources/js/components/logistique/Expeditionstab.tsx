import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Pencil, ArrowRight, Package, ChevronDown } from 'lucide-react';
import { DarkInput, DarkSelect, DarkTextarea, PrimaryButton, StatusBadge, Panel, DrawerPanel, EmptyState } from './Ui';
import { Camion, Chauffeur, Expedition, Produit } from '@/types/logistique';


// ── Product row inside new expedition form ────────────────────────────────────
interface ProductRowState {
    produit_id: number | string;
    quantite: number;
}

interface ProductRowProps {
    row: ProductRowState;
    index: number;
    produits: Produit[];
    onUpdate: (index: number, key: 'produit_id' | 'quantite', value: string | number) => void;
    onRemove: (index: number) => void;
}

function ProductRow({ row, index, produits, onUpdate, onRemove }: ProductRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
        >
            <div className="grid grid-cols-[1fr_100px_auto] gap-3 items-end">
                <DarkSelect
                    label={index === 0 ? 'Produit' : undefined}
                    value={row.produit_id}
                    onChange={e => onUpdate(index, 'produit_id', e.target.value)}
                    name={`produits[${index}][produit_id]`}
                >
                    {produits.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.nom} ({p.sku}) — {p.quantite_stock} en stock
                        </option>
                    ))}
                </DarkSelect>
                <DarkInput
                    label={index === 0 ? 'Qté' : undefined}
                    type="number"
                    min={1}
                    value={row.quantite}
                    onChange={e => onUpdate(index, 'quantite', e.target.value)}
                    name={`produits[${index}][quantite]`}
                />
                <PrimaryButton variant="danger" size="sm" type="button" onClick={() => onRemove(index)}>
                    <Trash2 size={12} />
                </PrimaryButton>
            </div>
        </motion.div>
    );
}

// ── New expedition form ───────────────────────────────────────────────────────
interface NewExpeditionFormProps {
    camionsDisponibles: Camion[];
    chauffeursDisponibles: Chauffeur[];
    produits: Produit[];
}

function NewExpeditionForm({ camionsDisponibles, chauffeursDisponibles, produits }: NewExpeditionFormProps) {
    const [rows, setRows] = useState<ProductRowState[]>([
        { produit_id: produits[0]?.id ?? '', quantite: 1 },
    ]);

    const addRow    = () => setRows(prev => [...prev, { produit_id: produits[0]?.id ?? '', quantite: 1 }]);
    const removeRow = (i: number) => setRows(prev => prev.filter((_, idx) => idx !== i));
    const updateRow = (i: number, key: 'produit_id' | 'quantite', val: string | number) => {
        setRows(prev => {
            const next = [...prev];
            next[i] = { ...next[i], [key]: key === 'quantite' ? Number(val) : val };
            return next;
        });
    };

    return (
        <Form method="post" action="/logistique/expeditions" className="space-y-4">
            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                <>
                    <DarkInput name="reference" label="Référence" placeholder="EXP-2026-001" error={errors.reference} />

                    <div className="grid grid-cols-2 gap-3">
                        <DarkSelect name="camion_id" label="Camion" error={errors.camion_id}>
                            {camionsDisponibles.length === 0
                                ? <option value="">Aucun camion disponible</option>
                                : camionsDisponibles.map(c => (
                                    <option key={c.id} value={c.id}>{c.immatriculation} — {c.marque}</option>
                                ))
                            }
                        </DarkSelect>
                        <DarkSelect name="chauffeur_id" label="Chauffeur" error={errors.chauffeur_id}>
                            {chauffeursDisponibles.length === 0
                                ? <option value="">Aucun chauffeur disponible</option>
                                : chauffeursDisponibles.map(c => (
                                    <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>
                                ))
                            }
                        </DarkSelect>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="origine"     label="Origine"      placeholder="Entrepôt principal" />
                        <DarkInput name="destination" label="Destination"  placeholder="Site client" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="date_depart"        label="Date de départ"  type="date" />
                        <DarkInput name="date_arrivee_prevue" label="Arrivée prévue" type="date" />
                    </div>

                    <DarkSelect name="statut" label="Statut">
                        <option value="en préparation">En préparation</option>
                        <option value="en cours">En cours</option>
                        <option value="livré">Livré</option>
                        <option value="annulé">Annulé</option>
                    </DarkSelect>

                    <div className="space-y-2">
                        <label className="text-[12px] font-medium text-white/40 uppercase tracking-widest">
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
                                />
                            ))}
                        </AnimatePresence>
                        <PrimaryButton type="button" variant="outline" size="sm" onClick={addRow} className="w-full justify-center">
                            <Plus size={12} />
                            Ajouter un produit
                        </PrimaryButton>
                        {errors.produits && <p className="text-[12px] text-red-400">{errors.produits}</p>}
                    </div>

                    <DarkTextarea name="details" label="Détails" rows={3} placeholder="Observations sur le chargement…" />

                    <PrimaryButton type="submit" disabled={processing} className="w-full justify-center">
                        <Plus size={14} />
                        Créer l'expédition
                    </PrimaryButton>
                </>
            )}
        </Form>
    );
}

// ── Edit expedition form ──────────────────────────────────────────────────────
interface EditExpeditionFormProps {
    expedition: Expedition;
    camions: Camion[];
    chauffeurs: Chauffeur[];
}

function EditExpeditionForm({ expedition, camions, chauffeurs }: EditExpeditionFormProps) {
    return (
        <Form method="put" action={`/logistique/expeditions/${expedition.id}`} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="reference" label="Référence" defaultValue={expedition.reference} />
                <DarkSelect name="statut" label="Statut" defaultValue={expedition.statut}>
                    <option value="en préparation">En préparation</option>
                    <option value="en cours">En cours</option>
                    <option value="livré">Livré</option>
                    <option value="annulé">Annulé</option>
                </DarkSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="origine"     label="Origine"     defaultValue={expedition.origine} />
                <DarkInput name="destination" label="Destination" defaultValue={expedition.destination} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="date_depart"         label="Date départ"    type="date" defaultValue={expedition.date_depart ?? ''} />
                <DarkInput name="date_arrivee_prevue" label="Arrivée prévue" type="date" defaultValue={expedition.date_arrivee_prevue ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkSelect name="camion_id" label="Camion" defaultValue={expedition.camion?.id}>
                    {camions.map(c => <option key={c.id} value={c.id}>{c.immatriculation}</option>)}
                </DarkSelect>
                <DarkSelect name="chauffeur_id" label="Chauffeur" defaultValue={expedition.chauffeur?.id}>
                    {chauffeurs.map(c => (
                        <option key={c.id} value={c.id}>{[c.nom, c.prenom].filter(Boolean).join(' ')}</option>
                    ))}
                </DarkSelect>
            </div>
            <PrimaryButton type="submit" className="w-full justify-center">
                Enregistrer les modifications
            </PrimaryButton>
        </Form>
    );
}

// ── Expedition card (accordion) ───────────────────────────────────────────────
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
            className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <MapPin size={13} className="text-emerald-400" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-white">{expedition.reference}</p>
                    <p className="text-[12px] text-white/35 flex items-center gap-1.5 mt-0.5">
                        <span className="truncate">{expedition.origine}</span>
                        <ArrowRight size={10} className="flex-shrink-0 text-white/20" />
                        <span className="truncate">{expedition.destination}</span>
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[12px] text-white/30">
                    <span>{expedition.camion?.immatriculation ?? '—'}</span>
                    <span className="text-white/15">·</span>
                    <span>{[expedition.chauffeur?.nom, expedition.chauffeur?.prenom].filter(Boolean).join(' ') || '—'}</span>
                </div>

                <StatusBadge status={expedition.statut} />

                <div className="flex items-center gap-1">
                    <PrimaryButton variant="ghost" size="sm" onClick={() => onEdit(expedition.id)}>
                        <Pencil size={12} />
                    </PrimaryButton>
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                        <ChevronDown
                            size={13}
                            className={`text-white/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Accordion content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/[0.05] px-4 py-3 bg-white/[0.02]"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <Form method="patch" action={`/logistique/expeditions/${expedition.id}/statut`} className="flex gap-2">
                                <select
                                    name="statut"
                                    defaultValue={expedition.statut}
                                    className="flex-1 bg-[#141416] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-white outline-none"
                                >
                                    <option value="en préparation">En préparation</option>
                                    <option value="en cours">En cours</option>
                                    <option value="livré">Livré</option>
                                    <option value="annulé">Annulé</option>
                                </select>
                                <PrimaryButton type="submit" variant="secondary" size="sm">MAJ</PrimaryButton>
                            </Form>

                            <Form method="delete" action={`/logistique/expeditions/${expedition.id}`}>
                                <PrimaryButton type="submit" variant="danger" size="sm" className="w-full justify-center">
                                    <Trash2 size={12} />
                                    Supprimer
                                </PrimaryButton>
                            </Form>
                        </div>

                        {expedition.produits?.length > 0 && (
                            <p className="flex items-center gap-2 text-[12px] text-white/30">
                                <Package size={11} />
                                {expedition.produits.map(p => `${p.nom} ×${p.pivot?.quantite}`).join(', ')}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
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
    const [editId, setEditId]   = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);

    const editing = expeditions.find(e => e.id === editId) ?? null;

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
            <Panel
                title="Expéditions"
                subtitle={`${expeditions.length} expédition${expeditions.length !== 1 ? 's' : ''}`}
                action={
                    <PrimaryButton variant="secondary" size="sm" onClick={() => { setShowNew(true); setEditId(null); }}>
                        <Plus size={13} />
                        Nouvelle
                    </PrimaryButton>
                }
            >
                {expeditions.length === 0 ? (
                    <EmptyState message="Aucune expédition enregistrée" />
                ) : (
                    <div className="space-y-2">
                        {expeditions.map((exp, i) => (
                            <ExpeditionCard
                                key={exp.id}
                                expedition={exp}
                                index={i}
                                onEdit={(id) => { setEditId(id); setShowNew(false); }}
                            />
                        ))}
                    </div>
                )}
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
                        className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 text-center"
                    >
                        <MapPin size={24} className="text-white/15 mx-auto mb-3" />
                        <p className="text-[13px] text-white/25">Créez une nouvelle expédition ou modifiez-en une existante.</p>
                        <PrimaryButton variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Créer une expédition
                        </PrimaryButton>
                    </motion.div>
                )}
            </div>
        </div>
    );
}