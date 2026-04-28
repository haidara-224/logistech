import { useState } from 'react';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Plus, Pencil, Trash2, Phone, Shield } from 'lucide-react';
import { DarkInput, DarkSelect, DarkTextarea, PrimaryButton, StatusBadge, Panel, DrawerPanel, EmptyState } from './Ui';
import { Chauffeur } from '@/types/logistique';


// ── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
    { bg: 'rgba(139,92,246,0.15)',  color: '#8B5CF6' },
    { bg: 'rgba(59,130,246,0.15)',  color: '#3B82F6' },
    { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
    { bg: 'rgba(249,115,22,0.15)', color: '#F97316' },
    { bg: 'rgba(236,72,153,0.15)', color: '#EC4899' },
];

function Avatar({ nom, prenom }: { nom: string; prenom?: string }) {
    const initials = [nom?.[0], prenom?.[0]].filter(Boolean).join('').toUpperCase() || '?';
    const c = AVATAR_COLORS[(nom?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
    return (
        <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
            style={{ background: c.bg, color: c.color }}
        >
            {initials}
        </div>
    );
}

// ── Row ───────────────────────────────────────────────────────────────────────
interface ChauffeurRowProps {
    chauffeur: Chauffeur;
    index: number;
    onEdit: (id: number) => void;
}

function ChauffeurRow({ chauffeur, index, onEdit }: ChauffeurRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.03] transition-all duration-200"
        >
            <Avatar nom={chauffeur.nom} prenom={chauffeur.prenom} />

            <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white">
                    {[chauffeur.nom, chauffeur.prenom].filter(Boolean).join(' ')}
                </p>
                <p className="text-[12px] text-white/35 mt-0.5 flex items-center gap-2">
                    {chauffeur.telephone && (
                        <span className="flex items-center gap-1">
                            <Phone size={10} />{chauffeur.telephone}
                        </span>
                    )}
                    {chauffeur.permis && (
                        <span className="flex items-center gap-1">
                            <Shield size={10} />Permis {chauffeur.permis}
                        </span>
                    )}
                </p>
            </div>

            <StatusBadge status={chauffeur.statut} />

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <PrimaryButton variant="ghost" size="sm" onClick={() => onEdit(chauffeur.id)}>
                    <Pencil size={12} />
                </PrimaryButton>
                <Form method="delete" action={`/logistique/chauffeurs/${chauffeur.id}`}>
                    <PrimaryButton variant="danger" size="sm" type="submit">
                        <Trash2 size={12} />
                    </PrimaryButton>
                </Form>
            </div>
        </motion.div>
    );
}

// ── New form ──────────────────────────────────────────────────────────────────
function NewChauffeurForm() {
    return (
        <Form method="post" action="/logistique/chauffeurs" className="space-y-4">
            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="nom" label="Nom" placeholder="Camara" error={errors.nom} />
                        <DarkInput name="prenom" label="Prénom" placeholder="Mamadou" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="telephone" label="Téléphone" placeholder="+224 620 00 00 00" />
                        <DarkInput name="email" label="Email" type="email" placeholder="chauffeur@exemple.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <DarkInput name="permis" label="Catégories permis" placeholder="C, D" />
                        <DarkSelect name="statut" label="Statut">
                            <option value="disponible">Disponible</option>
                            <option value="en mission">En mission</option>
                            <option value="repos">Repos</option>
                        </DarkSelect>
                    </div>
                    <DarkTextarea name="notes" label="Notes" rows={3} placeholder="Disponibilités, informations complémentaires…" />
                    <PrimaryButton type="submit" disabled={processing} className="w-full justify-center">
                        <Plus size={14} />
                        Enregistrer le chauffeur
                    </PrimaryButton>
                </>
            )}
        </Form>
    );
}

// ── Edit form ─────────────────────────────────────────────────────────────────
function EditChauffeurForm({ chauffeur }: { chauffeur: Chauffeur }) {
    return (
        <Form method="put" action={`/logistique/chauffeurs/${chauffeur.id}`} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="nom" label="Nom" defaultValue={chauffeur.nom} />
                <DarkInput name="prenom" label="Prénom" defaultValue={chauffeur.prenom ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="telephone" label="Téléphone" defaultValue={chauffeur.telephone ?? ''} />
                <DarkInput name="email" label="Email" type="email" defaultValue={chauffeur.email ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <DarkInput name="permis" label="Permis" defaultValue={chauffeur.permis ?? ''} />
                <DarkSelect name="statut" label="Statut" defaultValue={chauffeur.statut}>
                    <option value="disponible">Disponible</option>
                    <option value="en mission">En mission</option>
                    <option value="repos">Repos</option>
                </DarkSelect>
            </div>
            <PrimaryButton type="submit" className="w-full justify-center">
                Enregistrer les modifications
            </PrimaryButton>
        </Form>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ChauffeursTab({ chauffeurs }: { chauffeurs: Chauffeur[] }) {
    const [editId, setEditId]   = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);

    const editing = chauffeurs.find(c => c.id === editId) ?? null;

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <Panel
                title="Chauffeurs"
                subtitle={`${chauffeurs.length} conducteur${chauffeurs.length !== 1 ? 's' : ''} enregistré${chauffeurs.length !== 1 ? 's' : ''}`}
                action={
                    <PrimaryButton variant="secondary" size="sm" onClick={() => { setShowNew(true); setEditId(null); }}>
                        <Plus size={13} />
                        Nouveau
                    </PrimaryButton>
                }
            >
                {chauffeurs.length === 0 ? (
                    <EmptyState message="Aucun chauffeur enregistré" />
                ) : (
                    <div className="space-y-1">
                        {chauffeurs.map((c, i) => (
                            <ChauffeurRow
                                key={c.id}
                                chauffeur={c}
                                index={i}
                                onEdit={(id) => { setEditId(id); setShowNew(false); }}
                            />
                        ))}
                    </div>
                )}
            </Panel>

            <div className="space-y-4">
                <DrawerPanel open={showNew} onClose={() => setShowNew(false)} title="Nouveau chauffeur" subtitle="Ajoutez un conducteur à l'équipe">
                    <NewChauffeurForm />
                </DrawerPanel>

                <DrawerPanel
                    open={!!editing}
                    onClose={() => setEditId(null)}
                    title="Modifier le chauffeur"
                    subtitle={editing ? [editing.nom, editing.prenom].filter(Boolean).join(' ') : undefined}
                >
                    {editing && <EditChauffeurForm chauffeur={editing} />}
                </DrawerPanel>

                {!showNew && !editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5 text-center"
                    >
                        <Users size={24} className="text-white/15 mx-auto mb-3" />
                        <p className="text-[13px] text-white/25">Sélectionnez un chauffeur pour le modifier.</p>
                        <PrimaryButton variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Ajouter un chauffeur
                        </PrimaryButton>
                    </motion.div>
                )}
            </div>
        </div>
    );
}