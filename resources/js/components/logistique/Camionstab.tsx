import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Truck, Plus, Pencil, Trash2, Weight, Box } from 'lucide-react';
import { DarkInput, DarkSelect, DarkTextarea, PrimaryButton, StatusBadge, Panel, DrawerPanel, EmptyState } from './Ui';
import { Camion } from '@/types/logistique';


// ── Row ───────────────────────────────────────────────────────────────────────
interface CamionRowProps {
    camion: Camion;
    index: number;
    onEdit: (id: number) => void;
}

function CamionRow({ camion, index, onEdit }: CamionRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.03] transition-all duration-200"
        >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
                <Truck size={15} className="text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white">{camion.immatriculation}</p>
                <p className="text-[12px] text-white/35 mt-0.5">
                    {[camion.marque, camion.modele].filter(Boolean).join(' ') || 'Modèle non précisé'}
                </p>
            </div>

            <div className="hidden md:flex items-center gap-3 text-[12px] text-white/30">
                <span className="flex items-center gap-1">
                    <Weight size={11} />{camion.capacite_poids.toLocaleString()} kg
                </span>
                <span className="text-white/15">·</span>
                <span className="flex items-center gap-1">
                    <Box size={11} />{camion.capacite_volume} m³
                </span>
            </div>

            <StatusBadge status={camion.statut} />

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <PrimaryButton variant="ghost" size="sm" onClick={() => onEdit(camion.id)}>
                    <Pencil size={12} />
                </PrimaryButton>
                <Form method="delete" action={`/logistique/camions/${camion.id}`}>
                    <PrimaryButton variant="danger" size="sm" type="submit">
                        <Trash2 size={12} />
                    </PrimaryButton>
                </Form>
            </div>
        </motion.div>
    );
}

// ── New form ──────────────────────────────────────────────────────────────────
function NewCamionForm() {
    return (
        <Form method="post" action="/logistique/camions" className="space-y-4">
            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                <>
                    <DarkInput name="immatriculation" label="Immatriculation" placeholder="TG-1234-A" error={errors.immatriculation} />
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="marque" label="Marque" placeholder="Volvo" />
                        <DarkInput name="modele" label="Modèle" placeholder="FH 540" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="capacite_poids" label="Poids max (kg)" type="number" placeholder="12000" />
                        <DarkInput name="capacite_volume" label="Volume max (m³)" type="number" placeholder="80" />
                    </div>
                    <DarkSelect name="statut" label="Statut">
                        <option value="disponible">Disponible</option>
                        <option value="en mission">En mission</option>
                        <option value="maintenance">Maintenance</option>
                    </DarkSelect>
                    <DarkTextarea name="notes" label="Notes" rows={3} placeholder="Informations complémentaires…" />
                    <PrimaryButton type="submit" disabled={processing} className="w-full justify-center">
                        <Plus size={14} />
                        Enregistrer le camion
                    </PrimaryButton>
                </>
            )}
        </Form>
    );
}

// ── Edit form ─────────────────────────────────────────────────────────────────
function EditCamionForm({ camion }: { camion: Camion }) {
    return (
        <Form method="put" action={`/logistique/camions/${camion.id}`} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="immatriculation" label="Immatriculation" defaultValue={camion.immatriculation} />
                <DarkInput name="marque" label="Marque" defaultValue={camion.marque ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="modele" label="Modèle" defaultValue={camion.modele ?? ''} />
                <DarkSelect name="statut" label="Statut" defaultValue={camion.statut}>
                    <option value="disponible">Disponible</option>
                    <option value="en mission">En mission</option>
                    <option value="maintenance">Maintenance</option>
                </DarkSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="capacite_poids" label="Poids max (kg)" type="number" defaultValue={camion.capacite_poids} />
                <DarkInput name="capacite_volume" label="Volume max (m³)" type="number" defaultValue={camion.capacite_volume} />
            </div>
            <PrimaryButton type="submit" className="w-full justify-center">
                Enregistrer les modifications
            </PrimaryButton>
        </Form>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CamionsTab({ camions }: { camions: Camion[] }) {
    const [editId, setEditId]   = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);

    const editingCamion = camions.find(c => c.id === editId) ?? null;

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            {/* List */}
            <Panel
                title="Flotte de camions"
                subtitle={`${camions.length} véhicule${camions.length !== 1 ? 's' : ''} enregistré${camions.length !== 1 ? 's' : ''}`}
                action={
                    <PrimaryButton variant="secondary" size="sm" onClick={() => { setShowNew(true); setEditId(null); }}>
                        <Plus size={13} />
                        Nouveau
                    </PrimaryButton>
                }
            >
                {camions.length === 0 ? (
                    <EmptyState message="Aucun camion enregistré" />
                ) : (
                    <div className="space-y-1">
                        {camions.map((camion, i) => (
                            <CamionRow
                                key={camion.id}
                                camion={camion}
                                index={i}
                                onEdit={(id) => { setEditId(id); setShowNew(false); }}
                            />
                        ))}
                    </div>
                )}
            </Panel>

            {/* Side drawers */}
            <div className="space-y-4">
                <DrawerPanel open={showNew} onClose={() => setShowNew(false)} title="Nouveau camion" subtitle="Ajoutez un véhicule à la flotte">
                    <NewCamionForm />
                </DrawerPanel>

                <DrawerPanel open={!!editingCamion} onClose={() => setEditId(null)} title="Modifier le camion" subtitle={editingCamion?.immatriculation}>
                    {editingCamion && <EditCamionForm camion={editingCamion} />}
                </DrawerPanel>

                {!showNew && !editingCamion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 text-center"
                    >
                        <Truck size={24} className="text-white/15 mx-auto mb-3" />
                        <p className="text-[13px] text-white/25">
                            Sélectionnez un camion pour le modifier, ou ajoutez-en un nouveau.
                        </p>
                        <PrimaryButton variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Ajouter un camion
                        </PrimaryButton>
                    </motion.div>
                )}
            </div>
        </div>
    );
}