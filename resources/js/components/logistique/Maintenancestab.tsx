import { useState, useMemo } from 'react';
import { Form } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Pencil, Trash2, CalendarClock } from 'lucide-react';
import { ThemedInput, ThemedSelect, ThemedTextarea, Button, Panel, DrawerPanel, EmptyState, FilterBar, Pagination } from './Ui';
import { Camion, MaintenanceCamion } from '@/types/logistique';

const PER_PAGE = 8;

const STATUT_OPTIONS = [
    { value: 'planifiée', label: 'Planifiée' },
    { value: 'en cours', label: 'En cours' },
    { value: 'terminée', label: 'Terminée' },
];

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous les statuts' },
    ...STATUT_OPTIONS,
];

const STATUT_CFG: Record<string, { color: string; bg: string; label: string }> = {
    'planifiée':  { color: '#F59E0B', bg: 'bg-amber-500/10',   label: 'Planifiée' },
    'en cours':   { color: '#3B82F6', bg: 'bg-blue-500/10',    label: 'En cours' },
    'terminée':   { color: '#10B981', bg: 'bg-emerald-500/10', label: 'Terminée' },
};

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);
const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

interface MaintenancesTabProps {
    maintenances: MaintenanceCamion[];
    maintenances_prochaines: MaintenanceCamion[];
    camions: Camion[];
}

interface FormState {
    camion_id: string;
    type: string;
    description: string;
    cout: string;
    kilometrage: string;
    date_maintenance: string;
    prochaine_maintenance: string;
    statut: string;
}

const EMPTY_FORM: FormState = {
    camion_id: '',
    type: '',
    description: '',
    cout: '',
    kilometrage: '',
    date_maintenance: new Date().toISOString().slice(0, 10),
    prochaine_maintenance: '',
    statut: 'planifiée',
};

export default function MaintenancesTab({ maintenances, maintenances_prochaines, camions }: MaintenancesTabProps) {
    const [search, setSearch]       = useState('');
    const [filterStatut, setFilterStatut] = useState('all');
    const [page, setPage]           = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing]     = useState<MaintenanceCamion | null>(null);
    const [form, setForm]           = useState<FormState>(EMPTY_FORM);

    const filtered = useMemo(() => {
        return maintenances.filter((m) => {
            const q = search.toLowerCase();
            const matchSearch = !q
                || (m.camion?.immatriculation ?? '').toLowerCase().includes(q)
                || m.type.toLowerCase().includes(q)
                || (m.description ?? '').toLowerCase().includes(q);
            const matchStatut = filterStatut === 'all' || m.statut === filterStatut;
            return matchSearch && matchStatut;
        });
    }, [maintenances, search, filterStatut]);

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    function openCreate() {
        setEditing(null);
        setForm(EMPTY_FORM);
        setDrawerOpen(true);
    }

    function openEdit(m: MaintenanceCamion) {
        setEditing(m);
        setForm({
            camion_id: String(m.camion_id),
            type: m.type,
            description: m.description ?? '',
            cout: m.cout != null ? String(m.cout) : '',
            kilometrage: m.kilometrage != null ? String(m.kilometrage) : '',
            date_maintenance: m.date_maintenance?.slice(0, 10) ?? '',
            prochaine_maintenance: m.prochaine_maintenance?.slice(0, 10) ?? '',
            statut: m.statut,
        });
        setDrawerOpen(true);
    }

    function set(field: keyof FormState) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
    }

    return (
        <div className="space-y-6">
            {/* Upcoming maintenances alert */}
            {maintenances_prochaines.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarClock size={16} className="text-amber-500" />
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                            {maintenances_prochaines.length} maintenance{maintenances_prochaines.length > 1 ? 's' : ''} prévue{maintenances_prochaines.length > 1 ? 's' : ''} dans les 30 prochains jours
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {maintenances_prochaines.map((m) => (
                            <span key={m.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/40 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                <Wrench size={11} />
                                {m.camion?.immatriculation} — {fmtDate(m.prochaine_maintenance)}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}

            <Panel
                title="Maintenances"
                subtitle={`${filtered.length} enregistrement${filtered.length !== 1 ? 's' : ''}`}
                action={
                    <Button size="sm" onClick={openCreate}>
                        <Plus size={14} /> Nouvelle maintenance
                    </Button>
                }
            >
                <FilterBar
                    search={search}
                    onSearch={(v) => { setSearch(v); setPage(1); }}
                    placeholder="Rechercher par camion, type…"
                    filterValue={filterStatut}
                    onFilter={(v) => { setFilterStatut(v); setPage(1); }}
                    filterOptions={FILTER_OPTIONS}
                    filterLabel="Statut"
                />

                {paginated.length === 0 ? (
                    <EmptyState icon={<Wrench size={32} />} message="Aucune maintenance trouvée" />
                ) : (
                    <div className="space-y-1 mt-2">
                        {paginated.map((m, idx) => {
                            const cfg = STATUT_CFG[m.statut] ?? { color: '#6B7280', bg: 'bg-gray-500/10', label: m.statut };
                            return (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="group flex items-center gap-4 px-4 py-3.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/30 transition-all duration-200"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
                                        <Wrench size={15} className="text-orange-500" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground">
                                            {m.camion?.immatriculation ?? `Camion #${m.camion_id}`}
                                            <span className="ml-2 text-xs font-normal text-muted-foreground">{m.type}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {m.description || '—'}
                                        </p>
                                    </div>

                                    <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                                        <span>{fmtDate(m.date_maintenance)}</span>
                                        {m.prochaine_maintenance && (
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                <CalendarClock size={10} />
                                                {fmtDate(m.prochaine_maintenance)}
                                            </span>
                                        )}
                                    </div>

                                    {m.cout != null && (
                                        <div className="hidden md:block text-right shrink-0">
                                            <p className="text-sm font-bold text-foreground tabular-nums">{fmt(Number(m.cout))}</p>
                                            <p className="text-[10px] text-muted-foreground">GNF</p>
                                        </div>
                                    )}

                                    <span
                                        className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 ${cfg.bg}`}
                                        style={{ color: cfg.color }}
                                    >
                                        {cfg.label}
                                    </span>

                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={() => openEdit(m)}
                                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={13} className="text-muted-foreground" />
                                        </button>
                                        <Form
                                            method="delete"
                                            action={`/dashboard/logistique/maintenances/${m.id}`}
                                            onSubmit={(e) => { if (!confirm('Supprimer cette maintenance ?')) e.preventDefault(); }}
                                        >
                                            <button type="submit" className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors" title="Supprimer">
                                                <Trash2 size={13} className="text-destructive/70" />
                                            </button>
                                        </Form>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPage={setPage}
                        total={filtered.length}
                        perPage={PER_PAGE}
                    />
                )}
            </Panel>

            {/* Drawer: Create / Edit */}
            <DrawerPanel
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editing ? 'Modifier la maintenance' : 'Nouvelle maintenance'}
            >
                <Form
                    method={editing ? 'put' : 'post'}
                    action={editing ? `/dashboard/logistique/maintenances/${editing.id}` : '/dashboard/logistique/maintenances'}
                    onSuccess={() => setDrawerOpen(false)}
                    className="space-y-4"
                >
                    <ThemedSelect label="Camion" name="camion_id" value={form.camion_id} onChange={set('camion_id')} required>
                        <option value="">Sélectionner un camion</option>
                        {camions.map((c) => (
                            <option key={c.id} value={c.id}>{c.immatriculation}{c.marque ? ` — ${c.marque}` : ''}</option>
                        ))}
                    </ThemedSelect>

                    <ThemedInput label="Type de maintenance" name="type" value={form.type} onChange={set('type')} placeholder="Vidange, pneus, freins…" required />

                    <ThemedTextarea label="Description" name="description" value={form.description} onChange={set('description')} placeholder="Détails de l'intervention…" rows={3} />

                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput label="Coût (GNF)" name="cout" type="number" min="0" value={form.cout} onChange={set('cout')} placeholder="0" />
                        <ThemedInput label="Kilométrage" name="kilometrage" type="number" min="0" value={form.kilometrage} onChange={set('kilometrage')} placeholder="km" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <ThemedInput label="Date maintenance" name="date_maintenance" type="date" value={form.date_maintenance} onChange={set('date_maintenance')} required />
                        <ThemedInput label="Prochaine maintenance" name="prochaine_maintenance" type="date" value={form.prochaine_maintenance} onChange={set('prochaine_maintenance')} />
                    </div>

                    <ThemedSelect label="Statut" name="statut" value={form.statut} onChange={set('statut')}>
                        {STATUT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </ThemedSelect>

                    <div className="flex gap-2 pt-2">
                        <Button type="submit" className="flex-1">
                            {editing ? 'Enregistrer' : 'Créer'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setDrawerOpen(false)}>
                            Annuler
                        </Button>
                    </div>
                </Form>
            </DrawerPanel>
        </div>
    );
}
