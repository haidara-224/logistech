import { useState, useMemo } from 'react';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Users, Plus, Pencil, Trash2, Phone, Shield, MapPin } from 'lucide-react';
import { ThemedInput, ThemedSelect, ThemedTextarea, Button, StatusBadge, Panel, DrawerPanel, EmptyState, FilterBar, Pagination } from './Ui';
import { Chauffeur, Expedition } from '@/types/logistique';

const PER_PAGE = 8;

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'en mission', label: 'En mission' },
    { value: 'repos', label: 'Repos' },
];

const AVATAR_COLORS = [
    'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
    'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-400',
];

function Avatar({ nom, prenom }: { nom: string; prenom?: string }) {
    const initials = [nom?.[0], prenom?.[0]].filter(Boolean).join('').toUpperCase() || '?';
    const colorClass = AVATAR_COLORS[(nom?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${colorClass}`}>
            {initials}
        </div>
    );
}

interface ChauffeurRowProps {
    chauffeur: Chauffeur;
    index: number;
    onEdit: (id: number) => void;
    missionRef?: string;
}

function ChauffeurRow({ chauffeur, index, onEdit, missionRef }: ChauffeurRowProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200"
        >
            <Avatar nom={chauffeur.nom} prenom={chauffeur.prenom} />

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                    {[chauffeur.nom, chauffeur.prenom].filter(Boolean).join(' ')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    {chauffeur.telephone && (
                        <span className="flex items-center gap-1">
                            <Phone size={10} />
                            {chauffeur.telephone}
                        </span>
                    )}
                    {chauffeur.permis && (
                        <span className="flex items-center gap-1">
                            <Shield size={10} />
                            Permis {chauffeur.permis}
                        </span>
                    )}
                </p>
                {missionRef && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={9} />
                        {missionRef}
                    </p>
                )}
            </div>

            <StatusBadge status={chauffeur.statut} />

            <div className="flex items-center gap-1 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => onEdit(chauffeur.id)}>
                    <Pencil size={12} />
                </Button>
                <Form method="delete" action={`/logistique/chauffeurs/${chauffeur.id}`}>
                    <Button variant="danger" size="sm" type="submit">
                        <Trash2 size={16} className='text-white' />
                    </Button>
                </Form>
            </div>
        </motion.div>
    );
}

function NewChauffeurForm() {
    return (
        <Form method="post" action="/logistique/chauffeurs" className="space-y-4">
            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                <>
                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput name="nom" label="Nom" placeholder="Camara" error={errors.nom} />
                        <ThemedInput name="prenom" label="Prénom" placeholder="Mamadou" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput name="telephone" label="Téléphone" placeholder="+224 620 00 00 00" />
                        <ThemedInput name="email" label="Email" type="email" placeholder="chauffeur@exemple.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput name="permis" label="Catégories permis" placeholder="C, D" />
                        <ThemedSelect name="statut" label="Statut">
                            <option value="disponible">Disponible</option>
                            <option value="en mission">En mission</option>
                            <option value="repos">Repos</option>
                        </ThemedSelect>
                    </div>
                    <ThemedTextarea name="notes" label="Notes" rows={3} placeholder="Disponibilités, informations complémentaires…" />
                    <Button type="submit" disabled={processing} className="w-full">
                        <Plus size={14} />
                        Enregistrer le chauffeur
                    </Button>
                </>
            )}
        </Form>
    );
}

function EditChauffeurForm({ chauffeur }: { chauffeur: Chauffeur }) {
    return (
        <Form method="put" action={`/logistique/chauffeurs/${chauffeur.id}`} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="nom" label="Nom" defaultValue={chauffeur.nom} />
                <ThemedInput name="prenom" label="Prénom" defaultValue={chauffeur.prenom ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="telephone" label="Téléphone" defaultValue={chauffeur.telephone ?? ''} />
                <ThemedInput name="email" label="Email" type="email" defaultValue={chauffeur.email ?? ''} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <ThemedInput name="permis" label="Permis" defaultValue={chauffeur.permis ?? ''} />
                <ThemedSelect name="statut" label="Statut" defaultValue={chauffeur.statut}>
                    <option value="disponible">Disponible</option>
                    <option value="en mission">En mission</option>
                    <option value="repos">Repos</option>
                </ThemedSelect>
            </div>
            <Button type="submit" className="w-full">
                Enregistrer les modifications
            </Button>
        </Form>
    );
}

export default function ChauffeursTab({ chauffeurs, expeditions }: { chauffeurs: Chauffeur[]; expeditions: Expedition[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return chauffeurs.filter(c => {
            const matchesFilter = filter === 'all' || c.statut === filter;
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                c.nom.toLowerCase().includes(q) ||
                (c.prenom ?? '').toLowerCase().includes(q) ||
                (c.telephone ?? '').toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [chauffeurs, search, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const editing = chauffeurs.find(c => c.id === editId) ?? null;

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleFilter = (v: string) => { setFilter(v); setPage(1); };

    const activeMissions = useMemo(() => {
        const map: Record<number, string> = {};
        expeditions
            .filter(e => e.statut === 'en cours' || e.statut === 'en préparation')
            .forEach(e => { if (e.chauffeur?.id) map[e.chauffeur.id] = e.reference; });
        return map;
    }, [expeditions]);

    const disponibleCount = chauffeurs.filter(c => c.statut === 'disponible').length;

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            <Panel
                title="Chauffeurs"
                subtitle={`${filtered.length} conducteur${filtered.length !== 1 ? 's' : ''} • ${disponibleCount} disponible${disponibleCount !== 1 ? 's' : ''}`}
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
                    placeholder="Rechercher par nom, téléphone…"
                    filterLabel="Statut chauffeur"
                />

                {paginated.length === 0 ? (
                    <EmptyState 
                        message={search || filter !== 'all' ? 'Aucun résultat pour ces filtres' : 'Aucun chauffeur enregistré'} 
                        icon={<Users size={32} />}
                    />
                ) : (
                    <div className="space-y-1">
                        {paginated.map((c, i) => (
                            <ChauffeurRow
                                key={c.id}
                                chauffeur={c}
                                index={i}
                                onEdit={(id) => { setEditId(id); setShowNew(false); }}
                                missionRef={activeMissions[c.id]}
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
                <DrawerPanel open={showNew} onClose={() => setShowNew(false)} title="Nouveau chauffeur" subtitle="Ajoutez un conducteur à l'équipe">
                    <NewChauffeurForm />
                </DrawerPanel>

                <DrawerPanel open={!!editing} onClose={() => setEditId(null)} title="Modifier le chauffeur" subtitle={editing ? [editing.nom, editing.prenom].filter(Boolean).join(' ') : undefined}>
                    {editing && <EditChauffeurForm chauffeur={editing} />}
                </DrawerPanel>

                {!showNew && !editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-2xl border border-border bg-card p-5 text-center"
                    >
                        <Users size={24} className="text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground/50">
                            Sélectionnez un chauffeur pour le modifier.
                        </p>
                        <Button variant="outline" size="sm" className="mx-auto mt-4" onClick={() => setShowNew(true)}>
                            <Plus size={12} />
                            Ajouter un chauffeur
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}