import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Umbrella, Check, X, Clock, CheckCircle2, XCircle,
    Calendar, User, Activity, ChevronRight,
} from 'lucide-react';
import { Panel, DrawerPanel, EmptyState, FilterBar } from '@/components/logistique/Ui';
import type { CongeChauffeur, Chauffeur } from '@/types/logistique';

interface Props {
    conges: CongeChauffeur[];
    chauffeurs: Chauffeur[];
    stats: { en_attente: number; approuve: number; refuse: number };
}

const CONGE_TYPE_LABELS: Record<string, string> = {
    conge_annuel: 'Congé annuel',
    maladie:      'Maladie',
    recuperation: 'Récupération',
    autre:        'Autre',
};

const CONGE_TYPE_COLORS: Record<string, string> = {
    conge_annuel: '#3b82f6',
    maladie:      '#f97316',
    recuperation: '#8b5cf6',
    autre:        '#6b7280',
};

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtDateShort = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

const nbJours = (debut: string, fin: string) =>
    Math.round((new Date(fin).getTime() - new Date(debut).getTime()) / 86400000) + 1;

const FILTER_OPTIONS = [
    { value: 'all',        label: 'Tous les statuts' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'approuve',   label: 'Approuvés' },
    { value: 'refuse',     label: 'Refusés' },
];

// ── Status badge ─────────────────────────────────────────────────────────────
function StatutBadge({ s }: { s: CongeChauffeur['statut'] }) {
    const cfg = {
        en_attente: { color: '#f59e0b', bg: '#f59e0b18', label: 'En attente', icon: Clock },
        approuve:   { color: '#10b981', bg: '#10b98118', label: 'Approuvé',   icon: CheckCircle2 },
        refuse:     { color: '#ef4444', bg: '#ef444418', label: 'Refusé',     icon: XCircle },
    }[s];
    const Icon = cfg.icon;
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
            style={{ color: cfg.color, background: cfg.bg }}>
            <Icon size={11} />{cfg.label}
        </span>
    );
}

// ── Conge row ─────────────────────────────────────────────────────────────────
function CongeRow({ conge, isSelected, onClick }: {
    conge: CongeChauffeur;
    isSelected: boolean;
    onClick: () => void;
}) {
    const chauffeur = conge.chauffeur;
    const color = CONGE_TYPE_COLORS[conge.type] ?? '#6b7280';
    const label = CONGE_TYPE_LABELS[conge.type] ?? conge.type;

    return (
        <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className={`w-full text-left flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border hover:bg-muted/30 bg-transparent'
            }`}
        >
            {/* Type icon */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}15` }}>
                <Umbrella size={15} style={{ color }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <StatutBadge s={conge.statut} />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <User size={10} />
                        {chauffeur ? `${chauffeur.prenom ?? ''} ${chauffeur.nom}`.trim() : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {fmtDateShort(conge.date_debut)} → {fmtDateShort(conge.date_fin)}
                        <span className="opacity-50 ml-0.5">({nbJours(conge.date_debut, conge.date_fin)}j)</span>
                    </span>
                </p>
            </div>

            <ChevronRight size={14} className={`shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
        </motion.button>
    );
}

// ── Decision drawer ───────────────────────────────────────────────────────────
function DecisionDrawer({ conge, onClose }: { conge: CongeChauffeur | null; onClose: () => void }) {
    const [commentaire, setCommentaire] = useState('');
    const [processing, setProcessing]   = useState(false);

    const decide = (statut: 'approuve' | 'refuse') => {
        if (!conge) { return; }
        setProcessing(true);
        router.patch(`/dashboard/conges/${conge.id}/statut`, { statut, commentaire_admin: commentaire || null }, {
            preserveScroll: true,
            onSuccess: () => { onClose(); setCommentaire(''); },
            onFinish:  () => setProcessing(false),
        });
    };

    if (!conge) {
        return (
            <DrawerPanel open={false} onClose={onClose} title="">
                <></>
            </DrawerPanel>
        );
    }

    const color = CONGE_TYPE_COLORS[conge.type] ?? '#6b7280';
    const chauffeur = conge.chauffeur;
    const isDecided = conge.statut !== 'en_attente';

    return (
        <DrawerPanel open={!!conge} onClose={onClose}
            title="Demande de congé"
            subtitle={chauffeur ? `${chauffeur.prenom ?? ''} ${chauffeur.nom}`.trim() : undefined}>

            {/* Type + dates */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 mb-5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}15` }}>
                        <Umbrella size={17} style={{ color }} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            {CONGE_TYPE_LABELS[conge.type] ?? conge.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {fmtDate(conge.date_debut)} → {fmtDate(conge.date_fin)}
                        </p>
                    </div>
                    <div className="ml-auto">
                        <StatutBadge s={conge.statut} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                    {[
                        { label: 'Durée', value: `${nbJours(conge.date_debut, conge.date_fin)} j.` },
                        { label: 'Début', value: fmtDateShort(conge.date_debut) },
                        { label: 'Fin',   value: fmtDateShort(conge.date_fin) },
                    ].map(item => (
                        <div key={item.label} className="text-center">
                            <p className="text-base font-bold text-foreground">{item.value}</p>
                            <p className="text-[10px] text-muted-foreground">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Motif */}
            {conge.motif && (
                <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Motif du chauffeur</p>
                    <p className="text-sm text-foreground bg-muted/30 rounded-xl px-3 py-2.5 border border-border italic">
                        "{conge.motif}"
                    </p>
                </div>
            )}

            {/* Admin comment from a previous decision */}
            {isDecided && conge.commentaire_admin && (
                <div className={`mb-4 rounded-xl px-3 py-2.5 border text-sm ${conge.statut === 'approuve' ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/8 border-red-500/20 text-red-700 dark:text-red-400'}`}>
                    <span className="font-semibold">Votre décision : </span>{conge.commentaire_admin}
                </div>
            )}

            {/* Decision form — only for pending */}
            {!isDecided && (
                <>
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Commentaire (optionnel)
                        </p>
                        <textarea
                            value={commentaire}
                            onChange={e => setCommentaire(e.target.value)}
                            rows={3}
                            placeholder="Raison du refus, conditions, remarques…"
                            className="w-full rounded-xl bg-muted/30 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 resize-none focus:outline-none focus:border-primary/50"
                        />
                    </div>

                    <div className="flex gap-2.5">
                        <button onClick={() => decide('refuse')} disabled={processing}
                            className="flex-1 h-10 rounded-xl border border-border text-muted-foreground text-sm font-semibold hover:bg-red-500/8 hover:text-red-500 hover:border-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                            <X size={14} /> Refuser
                        </button>
                        <button onClick={() => decide('approuve')} disabled={processing}
                            className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                            <Check size={14} /> Approuver
                        </button>
                    </div>
                </>
            )}
        </DrawerPanel>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CongesPage({ conges, chauffeurs, stats }: Props) {
    const [search, setSearch]           = useState('');
    const [filter, setFilter]           = useState('all');
    const [selected, setSelected]       = useState<CongeChauffeur | null>(null);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return conges.filter(c => {
            const matchFilter = filter === 'all' || c.statut === filter;
            const name = `${c.chauffeur?.prenom ?? ''} ${c.chauffeur?.nom ?? ''}`.toLowerCase();
            const matchSearch = !q || name.includes(q) || (c.motif ?? '').toLowerCase().includes(q);
            return matchFilter && matchSearch;
        });
    }, [conges, search, filter]);

    const handleSelect = (c: CongeChauffeur) =>
        setSelected(prev => prev?.id === c.id ? null : c);

    return (
        <>
            <Head title="Congés chauffeurs" />

            <div className="min-h-screen bg-background text-foreground">

                {/* Header */}
                <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-400 mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Umbrella size={15} className="text-white" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight text-foreground">LOGISTECH</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Activity size={14} className="text-emerald-500" />
                            <span>Gestion des congés</span>
                        </div>
                    </div>
                </header>

                <div className="max-w-400 mx-auto px-6 py-8">

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8"
                    >
                        <h1 className="text-4xl leading-none font-bold tracking-tight text-foreground mb-2">
                            Congés <span className="text-muted-foreground/50">chauffeurs</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Traitez les demandes de congé soumises par vos chauffeurs.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'En attente',  value: stats.en_attente, color: '#f59e0b', icon: Clock },
                            { label: 'Approuvés',   value: stats.approuve,   color: '#10b981', icon: CheckCircle2 },
                            { label: 'Refusés',     value: stats.refuse,     color: '#ef4444', icon: XCircle },
                        ].map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label}
                                    className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: `${s.color}15` }}>
                                        <Icon size={18} style={{ color: s.color }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Content: list + decision drawer */}
                    <div className={`grid gap-5 transition-all duration-300 ${selected ? 'lg:grid-cols-[1fr_380px]' : 'grid-cols-1'}`}>

                        {/* Left: list */}
                        <Panel
                            title="Demandes de congé"
                            subtitle={`${filtered.length} demande${filtered.length !== 1 ? 's' : ''}`}
                        >
                            <FilterBar
                                search={search}
                                onSearch={v => setSearch(v)}
                                filterValue={filter}
                                onFilter={v => setFilter(v)}
                                filterOptions={FILTER_OPTIONS}
                                placeholder="Rechercher par chauffeur, motif…"
                                filterLabel="Statut"
                            />

                            {filtered.length === 0 ? (
                                <EmptyState
                                    message="Aucune demande de congé"
                                    icon={<Umbrella size={32} />}
                                />
                            ) : (
                                <div className="space-y-2">
                                    {filtered.map(c => (
                                        <CongeRow
                                            key={c.id}
                                            conge={c}
                                            isSelected={selected?.id === c.id}
                                            onClick={() => handleSelect(c)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Panel>

                        {/* Right: decision drawer */}
                        <AnimatePresence>
                            {selected && (
                                <DecisionDrawer
                                    key={selected.id}
                                    conge={selected}
                                    onClose={() => setSelected(null)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}
