import { useState, useMemo } from 'react';
import { Form } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2, Clock, Loader, XCircle, Search, Filter, Calendar } from 'lucide-react';
import { ThemedInput, ThemedSelect, ThemedTextarea, Button, StatusBadge, Panel, DrawerPanel, EmptyState, FilterBar, Pagination } from './Ui';
import type { Livraison, Expedition } from '@/types/logistique';

const PER_PAGE = 10;

const FILTER_OPTIONS = [
    { value: 'all', label: 'Tous les états' },
    { value: 'livré', label: 'Livré' },
    { value: 'en cours', label: 'En cours' },
    { value: 'en préparation', label: 'En préparation' },
    { value: 'annulé', label: 'Annulé' },
];

const stateConfig = {
    'livré': { icon: CheckCircle2, color: '#10B981', bg: 'bg-emerald-500/10', label: 'Livré' },
    'en cours': { icon: Loader, color: '#3B82F6', bg: 'bg-blue-500/10', label: 'En cours' },
    'en préparation': { icon: Clock, color: '#F59E0B', bg: 'bg-amber-500/10', label: 'En préparation' },
    'annulé': { icon: XCircle, color: '#EF4444', bg: 'bg-red-500/10', label: 'Annulé' },
};

interface LivraisonsTabProps {
    livraisons: Livraison[];
    expeditions: Expedition[];
}

// ── Timeline entry component ─────────────────────────────────────────────────
function LivraisonEntry({ livraison, index, isLast }: { livraison: Livraison; index: number; isLast: boolean }) {
    const cfg = stateConfig[livraison.etat as keyof typeof stateConfig] ?? stateConfig['en préparation'];
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="flex gap-4 relative"
        >
            {/* Timeline line */}
            <div className="flex flex-col items-center shrink-0">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${cfg.bg}`}
                    style={{ borderColor: cfg.color + '33' }}
                >
                    <Icon size={14} style={{ color: cfg.color }} />
                </div>
                {!isLast && <div className="w-px flex-1 mt-2 bg-border min-h-4" />}
            </div>

            {/* Content */}
            <div className={`pb-5 flex-1 min-w-0 ${isLast ? '' : 'border-l border-border/50 pl-4 -ml-px'}`}>
                <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                            {livraison.expedition?.reference ?? 'Réf. inconnue'}
                        </span>
                        <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ color: cfg.color, background: cfg.bg }}
                        >
                            {cfg.label}
                        </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">
                        {livraison.date_statut
                            ? new Date(livraison.date_statut).toLocaleDateString('fr-FR', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })
                            : '—'}
                    </span>
                </div>
                {livraison.commentaire && (
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {livraison.commentaire}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

// ── Livraison card for list view ─────────────────────────────────────────────
function LivraisonCard({ livraison, index }: { livraison: Livraison; index: number }) {
    const cfg = stateConfig[livraison.etat as keyof typeof stateConfig] ?? stateConfig['en préparation'];
    const Icon = cfg.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-border hover:bg-muted/30 transition-all duration-200"
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                <Icon size={16} style={{ color: cfg.color }} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                    {livraison.expedition?.reference ?? 'Réf. inconnue'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {livraison.commentaire || 'Aucun commentaire'}
                </p>
            </div>

            <div className="hidden md:block text-right">
                <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{ color: cfg.color, background: cfg.bg }}
                >
                    {cfg.label}
                </span>
                <p className="text-[10px] text-muted-foreground mt-1">
                    {livraison.date_statut
                        ? new Date(livraison.date_statut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
                        : '—'}
                </p>
            </div>
        </motion.div>
    );
}

// ── New livraison form ───────────────────────────────────────────────────────
function NewLivraisonForm({ expeditions }: { expeditions: Expedition[] }) {
    return (
        <Form method="post" action="/logistique/livraisons" className="space-y-4">
            {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                <>
                    <ThemedSelect name="expedition_id" label="Expédition" error={errors.expedition_id}>
                        <option value="">Sélectionner une expédition</option>
                        {expeditions.length === 0 ? (
                            <option value="" disabled>Aucune expédition disponible</option>
                        ) : (
                            expeditions.map(e => (
                                <option key={e.id} value={e.id}>{e.reference}</option>
                            ))
                        )}
                    </ThemedSelect>

                    <ThemedSelect name="etat" label="État" error={errors.etat}>
                        <option value="en préparation">En préparation</option>
                        <option value="en cours">En cours</option>
                        <option value="livré">Livré</option>
                        <option value="annulé">Annulé</option>
                    </ThemedSelect>

                    <ThemedInput name="date_statut" label="Date & heure" type="datetime-local" error={errors.date_statut} />

                    <ThemedTextarea
                        name="commentaire"
                        label="Commentaire"
                        rows={4}
                        placeholder="Retard, problème de livraison, consigne particulière…"
                    />

                    <Button type="submit" disabled={processing} className="w-full">
                        <Package size={14} />
                        Enregistrer l'état
                    </Button>
                </>
            )}
        </Form>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function LivraisonsTab({ livraisons, expeditions }: LivraisonsTabProps) {
    const [viewMode, setViewMode] = useState<'timeline' | 'list'>('timeline');
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        return livraisons.filter(l => {
            const matchesFilter = filter === 'all' || l.etat === filter;
            const q = search.toLowerCase();
            const matchesSearch = !q ||
                (l.expedition?.reference ?? '').toLowerCase().includes(q) ||
                (l.commentaire ?? '').toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [livraisons, search, filter]);

    // Sort by date (most recent first)
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (!a.date_statut && !b.date_statut) return 0;
            if (!a.date_statut) return 1;
            if (!b.date_statut) return -1;
            return new Date(b.date_statut).getTime() - new Date(a.date_statut).getTime();
        });
    }, [filtered]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSearch = (v: string) => { setSearch(v); setPage(1); };
    const handleFilter = (v: string) => { setFilter(v); setPage(1); };

    const stats = {
        total: livraisons.length,
        livre: livraisons.filter(l => l.etat === 'livré').length,
        enCours: livraisons.filter(l => l.etat === 'en cours').length,
        enPreparation: livraisons.filter(l => l.etat === 'en préparation').length,
        annule: livraisons.filter(l => l.etat === 'annulé').length,
    };

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            {/* Left panel - Livraisons list/timeline */}
            <Panel 
                title="Historique des livraisons" 
                subtitle={`${filtered.length} mise${filtered.length !== 1 ? 's' : ''} à jour • ${stats.livre} livrée${stats.livre !== 1 ? 's' : ''}`}
                action={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg">
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={`px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                                    viewMode === 'timeline' 
                                        ? 'bg-card text-foreground shadow-sm' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Chronologie
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-2 py-1 text-xs rounded-md transition-all cursor-pointer ${
                                    viewMode === 'list' 
                                        ? 'bg-card text-foreground shadow-sm' 
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Liste
                            </button>
                        </div>
                    </div>
                }
            >
                <FilterBar
                    search={search}
                    onSearch={handleSearch}
                    filterValue={filter}
                    onFilter={handleFilter}
                    filterOptions={FILTER_OPTIONS}
                    placeholder="Rechercher par référence, commentaire…"
                    filterLabel="État livraison"
                />

                {/* Stats summary */}
                <div className="grid grid-cols-5 gap-2 mb-5">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-foreground' },
                        { label: 'Livré', value: stats.livre, color: 'text-emerald-500' },
                        { label: 'En cours', value: stats.enCours, color: 'text-blue-500' },
                        { label: 'Préparation', value: stats.enPreparation, color: 'text-amber-500' },
                        { label: 'Annulé', value: stats.annule, color: 'text-red-500' },
                    ].map(stat => (
                        <div key={stat.label} className="text-center p-2 rounded-lg bg-muted/20">
                            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {paginated.length === 0 ? (
                    <EmptyState 
                        message={search || filter !== 'all' ? 'Aucun résultat pour ces filtres' : 'Aucune livraison enregistrée'} 
                        icon={<Package size={32} />}
                    />
                ) : viewMode === 'timeline' ? (
                    <div className="mt-2">
                        {paginated.map((l, i) => (
                            <LivraisonEntry 
                                key={l.id} 
                                livraison={l} 
                                index={i} 
                                isLast={i === paginated.length - 1 && page === totalPages}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {paginated.map((l, i) => (
                            <LivraisonCard key={l.id} livraison={l} index={i} />
                        ))}
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPage={setPage}
                    total={sorted.length}
                    perPage={PER_PAGE}
                />
            </Panel>

            {/* Right panel - New livraison form */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
                <div className="mb-5">
                    <h3 className="text-base font-semibold text-foreground">Nouvel état de livraison</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Enregistrez une mise à jour pour une expédition</p>
                </div>

                <NewLivraisonForm expeditions={expeditions} />

                {/* Mini help */}
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-[10px] text-muted-foreground text-center">
                        Les mises à jour sont horodatées et apparaissent dans la chronologie
                    </p>
                </div>
            </motion.div>
        </div>
    );
}