import { useState, useMemo } from 'react';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Truck, Plus, Pencil, Trash2, Weight, Box, Search } from 'lucide-react';
import { ThemedInput, ThemedSelect, ThemedTextarea, Button, StatusBadge, Panel, DrawerPanel, EmptyState, FilterBar, Pagination } from './Ui';
import { Camion } from '@/types/logistique';

const PER_PAGE = 8;

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'en mission', label: 'En mission' },
    { value: 'maintenance', label: 'Maintenance' },
];

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
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200"
        >
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                <Truck size={15} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                    {camion.immatriculation}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {[camion.marque, camion.modele].filter(Boolean).join(' ') || 'Modèle non précisé'}
                </p>
            </div>

            <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Weight size={11} />
                    <span>{camion.capacite_poids.toLocaleString()} kg</span>
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1.5">
                    <Box size={11} />
                    <span>{camion.capacite_volume} m³</span>
                </span>
            </div>

            <StatusBadge status={camion.statut} />

            <div className="flex items-center gap-1  group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEdit(camion.id)}>
                    <Pencil size={12} />
                </Button>
                <Form method="delete" action={`/logistique/camions/${camion.id}`}>
                    <Button variant="danger" size="sm" type="submit">
                        <Trash2 size={16} className='text-white' />
                    </Button>
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
                    <ThemedInput name="immatriculation" label="Immatriculation" placeholder="TG-1234-A" error={errors.immatriculation} />
                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput name="marque" label="Marque" placeholder="Volvo" />
                        <ThemedInput name="modele" label="Modèle" placeholder="FH 540" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput name="capacite_poids" label="Poids max (kg)" type="number" placeholder="12000" />
                        <ThemedInput name="capacite_volume" label="Volume max (m³)" type="number" placeholder="80" />
                    </div>
                    <ThemedSelect name="statut" label="Statut">
                        <option value="disponible">Disponible</option>
                        <option value="en mission">En mission</option>
                        <option value="maintenance">Maintenance</option>
                    </ThemedSelect>
                    <ThemedTextarea name="notes" label="Notes" rows={3} placeholder="Informations complémentaires…" />
                    <Button type="submit" disabled={processing} className="w-full">
                        <Plus size={14} />
                        Enregistrer le camion
                    </Button>
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
                <ThemedInput name="immatriculation" label="Immatriculation" defaultValue={camion.immatriculation} />
                <ThemedInput name="marque" label="Marque" defaultValue={camion.marque ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="modele" label="Modèle" defaultValue={camion.modele ?? ''} />
                <ThemedSelect name="statut" label="Statut" defaultValue={camion.statut}>
                    <option value="disponible">Disponible</option>
                    <option value="en mission">En mission</option>
                    <option value="maintenance">Maintenance</option>
                </ThemedSelect>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="capacite_poids" label="Poids max (kg)" type="number" defaultValue={camion.capacite_poids} />
                <ThemedInput name="capacite_volume" label="Volume max (m³)" type="number" defaultValue={camion.capacite_volume} />
            </div>
            <Button type="submit" className="w-full">
                Enregistrer les modifications
            </Button>
        </Form>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CamionsTab({ camions }: { camions: Camion[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return camions.filter(c => {
            const matchesFilter = filter === 'all' || c.statut === filter;
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                c.immatriculation.toLowerCase().includes(q) ||
                (c.marque ?? '').toLowerCase().includes(q) ||
                (c.modele ?? '').toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [camions, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const editingCamion = camions.find(c => c.id === editId) ?? null;

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleFilter = (v: string) => { setFilter(v); setPage(1); };

    const disponibleCount = camions.filter(c => c.statut === 'disponible').length;

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <Panel
                title="Flotte de camions"
                subtitle={`${filtered.length} véhicule${filtered.length !== 1 ? 's' : ''} • ${disponibleCount} disponible${disponibleCount !== 1 ? 's' : ''}`}
                action={
                    <Button variant="secondary" size="sm" onClick={() => { setShowNew(true); setEditId(null); }}>
                        <Plus size={13} />
                        Nouveau
                    </Button>
                }
            >
                <FilterBar
                    search={search}
                    onSearch={handleSearch}
                    filterValue={filter}
                    onFilter={handleFilter}
                    filterOptions={FILTER_OPTIONS}
                    placeholder="Rechercher par immatriculation, marque…"
                    filterLabel="Statut camion"
                />

                {paginated.length === 0 ? (
                    <EmptyState 
                        message={search || filter !== 'all' ? 'Aucun résultat pour ces filtres' : 'Aucun camion enregistré'} 
                        icon={<Truck size={32} />}
                    />
                ) : (
                    <div className="space-y-1">
                        {paginated.map((camion, i) => (
                            <CamionRow
                                key={camion.id}
                                camion={camion}
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
                        className="rounded-2xl border border-border bg-card p-5 text-center"
                    >
                        <Truck size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground/50">
                            Sélectionnez un camion pour le modifier, ou ajoutez-en un nouveau.
                        </p>
                        <Button variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Ajouter un camion
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}