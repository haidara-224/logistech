import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck, Users, MapPin, Package, ChevronRight,
    Activity, GitBranch, BarChart2, CheckCircle2,
    X, Phone, Mail, IdCard, ArrowRight, TrendingUp,
} from 'lucide-react';
import { Camion, Chauffeur, Expedition } from '@/types/logistique';

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { color: string; bg: string; label: string }> = {
    'disponible':     { color: '#10B981', bg: '#d1fae5', label: 'Disponible' },
    'en mission':     { color: '#3B82F6', bg: '#dbeafe', label: 'En mission' },
    'maintenance':    { color: '#F59E0B', bg: '#fef3c7', label: 'Maintenance' },
    'en préparation': { color: '#F59E0B', bg: '#fef9c3', label: 'Préparation' },
    'en cours':       { color: '#3B82F6', bg: '#dbeafe', label: 'En cours' },
    'livré':          { color: '#10B981', bg: '#d1fae5', label: 'Livré' },
    'annulé':         { color: '#EF4444', bg: '#fee2e2', label: 'Annulé' },
};

const GANTT_CFG: Record<string, { bar: string; border: string; text: string }> = {
    'en préparation': { bar: '#fef9c3', border: '#ca8a04', text: '#78350f' },
    'en cours':       { bar: '#dbeafe', border: '#2563eb', text: '#1e3a8a' },
    'livré':          { bar: '#d1fae5', border: '#059669', text: '#064e3b' },
    'annulé':         { bar: '#fee2e2', border: '#dc2626', text: '#7f1d1d' },
};

const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtShort = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : '—';

const PX_PER_DAY = 30;
const ROW_H      = 56;
const LABEL_W    = 180;
const HEADER_H   = 60;
const BAR_H      = 28;

// ── Chauffeur history panel ───────────────────────────────────────────────────
interface HistoryPanelProps {
    chauffeur: Chauffeur;
    expeditions: Expedition[];
    onClose: () => void;
}

function ChauffeурHistoryPanel({ chauffeur, expeditions, onClose }: HistoryPanelProps) {
    const exps = expeditions.filter(e => e.chauffeur?.id === chauffeur.id);

    const camionsUtilises = useMemo(() => {
        const seen = new Map<number, Camion>();
        exps.forEach(e => { if (e.camion) seen.set(e.camion.id, e.camion); });
        return [...seen.values()];
    }, [exps]);

    const stats = useMemo(() => {
        const livrees   = exps.filter(e => e.statut === 'livré').length;
        const encours   = exps.filter(e => e.statut === 'en cours').length;
        const annulees  = exps.filter(e => e.statut === 'annulé').length;
        const total     = exps.length;
        return { total, livrees, encours, annulees, taux: total > 0 ? Math.round((livrees / total) * 100) : null };
    }, [exps]);

    const initials = [chauffeur.nom, chauffeur.prenom]
        .filter(Boolean)
        .map(s => s![0].toUpperCase())
        .join('');

    const statusCfg = STATUS_CFG[chauffeur.statut] ?? STATUS_CFG['disponible'];

    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden flex flex-col"
            style={{ maxHeight: '85vh' }}
        >
            {/* Header */}
            <div className="flex items-start gap-4 p-5 border-b border-border bg-muted/20 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-base shrink-0">
                    {initials || <Users size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-foreground truncate">
                        {[chauffeur.nom, chauffeur.prenom].filter(Boolean).join(' ')}
                    </p>
                    <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                        style={{ color: statusCfg.color, background: statusCfg.bg }}
                    >
                        {statusCfg.label}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors shrink-0"
                >
                    <X size={14} className="text-muted-foreground" />
                </button>
            </div>

            <div className="overflow-y-auto flex-1">
                {/* Contact */}
                {(chauffeur.telephone || chauffeur.email || chauffeur.permis) && (
                    <div className="px-5 py-3 border-b border-border/50 space-y-1.5">
                        {chauffeur.telephone && (
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Phone size={11} className="text-purple-400 shrink-0" />
                                {chauffeur.telephone}
                            </p>
                        )}
                        {chauffeur.email && (
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <Mail size={11} className="text-purple-400 shrink-0" />
                                {chauffeur.email}
                            </p>
                        )}
                        {chauffeur.permis && (
                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <IdCard size={11} className="text-purple-400 shrink-0" />
                                Permis : {chauffeur.permis}
                            </p>
                        )}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-4 border-b border-border/50">
                    {[
                        { label: 'Expéditions', value: stats.total,    color: '#6366F1' },
                        { label: 'Livrées',     value: stats.livrees,  color: '#10B981' },
                        { label: 'En cours',    value: stats.encours,  color: '#3B82F6' },
                        { label: 'Annulées',    value: stats.annulees, color: '#EF4444' },
                    ].map(s => (
                        <div key={s.label} className="rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</p>
                        </div>
                    ))}

                    {stats.taux !== null && (
                        <div className="col-span-2 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2.5 flex items-center gap-3">
                            <TrendingUp size={16} className="text-emerald-600 shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                    Taux de succès : {stats.taux}%
                                </p>
                                <div className="mt-1 h-1.5 rounded-full bg-emerald-200 dark:bg-emerald-900 overflow-hidden w-36">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.taux}%` }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Camions utilisés */}
                {camionsUtilises.length > 0 && (
                    <div className="px-4 py-3 border-b border-border/50">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Véhicules utilisés
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {camionsUtilises.map(c => (
                                <div
                                    key={c.id}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40"
                                >
                                    <Truck size={11} className="text-blue-500 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 leading-tight">
                                            {c.immatriculation}
                                        </p>
                                        {(c.marque || c.modele) && (
                                            <p className="text-[10px] text-blue-500/70 leading-tight">
                                                {[c.marque, c.modele].filter(Boolean).join(' ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Expedition history */}
                <div className="px-4 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                        Historique des expéditions
                    </p>
                    {exps.length === 0 ? (
                        <p className="text-xs text-muted-foreground/60 italic py-4 text-center">
                            Aucune expédition enregistrée
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {exps.map(exp => {
                                const cfg = GANTT_CFG[exp.statut] ?? GANTT_CFG['en cours'];
                                return (
                                    <div
                                        key={exp.id}
                                        className="rounded-xl border border-border bg-muted/20 p-3 space-y-2"
                                    >
                                        {/* Top row */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-foreground font-mono">{exp.reference}</p>
                                                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <span className="truncate">{exp.origine}</span>
                                                    <ArrowRight size={9} className="shrink-0 opacity-40" />
                                                    <span className="truncate">{exp.destination}</span>
                                                </p>
                                            </div>
                                            <span
                                                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap"
                                                style={{ color: cfg.text, background: cfg.bar, border: `1px solid ${cfg.border}` }}
                                            >
                                                {exp.statut}
                                            </span>
                                        </div>

                                        {/* Dates + camion */}
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                                            <span>{fmtShort(exp.date_depart)} → {fmtShort(exp.date_arrivee_prevue)}</span>
                                            {exp.camion && (
                                                <span className="flex items-center gap-1">
                                                    <Truck size={9} />
                                                    {exp.camion.immatriculation}
                                                </span>
                                            )}
                                            {exp.produits?.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Package size={9} />
                                                    {exp.produits.length} produit{exp.produits.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>

                                        {/* Livraisons */}
                                        {exp.livraisons && exp.livraisons.length > 0 && (
                                            <div className="border-t border-border/50 pt-1.5 space-y-1">
                                                {exp.livraisons.map(l => {
                                                    const lCfg = STATUS_CFG[l.etat] ?? STATUS_CFG['en cours'];
                                                    return (
                                                        <div key={l.id} className="flex items-center gap-2 text-[10px]">
                                                            <span className="text-muted-foreground shrink-0 w-14">
                                                                {fmtShort(l.date_statut)}
                                                            </span>
                                                            <span
                                                                className="font-semibold px-1.5 py-px rounded-full"
                                                                style={{ color: lCfg.color, background: lCfg.bg }}
                                                            >
                                                                {l.etat}
                                                            </span>
                                                            {l.commentaire && (
                                                                <span className="text-muted-foreground truncate">{l.commentaire}</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Tree ─────────────────────────────────────────────────────────────────────
interface TreeNodeProps {
    label: string;
    sublabel?: string;
    icon: React.ElementType;
    iconColor: string;
    status?: string;
    defaultOpen?: boolean;
    children?: React.ReactNode;
    leaf?: boolean;
}

function TreeNode({ label, sublabel, icon: Icon, iconColor, status, defaultOpen = false, children, leaf = false }: TreeNodeProps) {
    const [open, setOpen] = useState(defaultOpen);
    const hasChildren = !!children;
    const cfg = status ? STATUS_CFG[status] : null;

    return (
        <div>
            <div
                onClick={() => hasChildren && setOpen(o => !o)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors duration-150
                    ${hasChildren ? 'cursor-pointer hover:bg-muted/50' : 'cursor-default opacity-80'}`}
            >
                <motion.div
                    animate={{ rotate: hasChildren && open ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    className="shrink-0"
                >
                    {hasChildren
                        ? <ChevronRight size={13} className="text-muted-foreground" />
                        : <div className="w-3" />
                    }
                </motion.div>

                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                    style={{ background: `${iconColor}18`, border: `1.5px solid ${iconColor}35` }}
                >
                    <Icon size={15} style={{ color: iconColor }} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{label}</p>
                    {sublabel && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{sublabel}</p>}
                </div>

                {cfg && (
                    <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{ color: cfg.color, background: cfg.bg }}
                    >
                        {cfg.label}
                    </span>
                )}
            </div>

            <AnimatePresence initial={false}>
                {open && children && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="ml-6 pl-4 border-l-2 border-border/50 space-y-0.5 my-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Fleet tree ────────────────────────────────────────────────────────────────
function FleetTree({ camions, expeditions }: { camions: Camion[]; expeditions: Expedition[] }) {
    const expByCamion = useMemo(() => {
        const map: Record<number, Expedition[]> = {};
        camions.forEach(c => { map[c.id] = []; });
        expeditions.forEach(e => {
            if (e.camion?.id != null && map[e.camion.id] !== undefined) {
                map[e.camion.id].push(e);
            }
        });
        return map;
    }, [camions, expeditions]);

    return (
        <div className="rounded-2xl border border-border bg-card">
            <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Arbre de flotte</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Hiérarchie Camion → Expédition → Produits & Livraisons
                </p>
            </div>
            <div className="p-4">
                <TreeNode
                    label="Flotte LOGISTECH"
                    sublabel={`${camions.length} camions · ${expeditions.length} expéditions`}
                    icon={Activity}
                    iconColor="#F97316"
                    defaultOpen
                >
                    {camions.map(camion => {
                        const exps = expByCamion[camion.id] ?? [];
                        return (
                            <TreeNode
                                key={camion.id}
                                label={camion.immatriculation}
                                sublabel={
                                    [camion.marque, camion.modele].filter(Boolean).join(' ') ||
                                    `${exps.length} expédition(s)`
                                }
                                icon={Truck}
                                iconColor="#3B82F6"
                                status={camion.statut}
                                defaultOpen={camion.statut === 'en mission'}
                            >
                                {exps.length === 0
                                    ? <p className="px-3 py-2 text-xs text-muted-foreground/60 italic">Aucune expédition liée</p>
                                    : exps.map(exp => (
                                        <TreeNode
                                            key={exp.id}
                                            label={exp.reference}
                                            sublabel={`${exp.origine} → ${exp.destination}`}
                                            icon={MapPin}
                                            iconColor="#10B981"
                                            status={exp.statut}
                                            defaultOpen={exp.statut === 'en cours'}
                                        >
                                            {exp.produits?.map(p => (
                                                <TreeNode
                                                    key={`p-${p.id}`}
                                                    label={p.nom}
                                                    sublabel={`× ${p.pivot?.quantite ?? 1} unité(s)`}
                                                    icon={Package}
                                                    iconColor="#8B5CF6"
                                                    leaf
                                                />
                                            ))}
                                            {exp.livraisons?.map(l => (
                                                <TreeNode
                                                    key={`l-${l.id}`}
                                                    label={`Livraison — ${l.etat}`}
                                                    sublabel={fmtDate(l.date_statut)}
                                                    icon={CheckCircle2}
                                                    iconColor="#10B981"
                                                    status={l.etat}
                                                    leaf
                                                />
                                            ))}
                                        </TreeNode>
                                    ))
                                }
                            </TreeNode>
                        );
                    })}
                </TreeNode>
            </div>
        </div>
    );
}

// ── Gantt ─────────────────────────────────────────────────────────────────────
interface TooltipState { exp: Expedition; x: number; y: number; }

interface GanttChartProps {
    chauffeurs: Chauffeur[];
    expeditions: Expedition[];
    onSelectChauffeur: (c: Chauffeur) => void;
    selectedId: number | null;
}

function GanttChart({ chauffeurs, expeditions, onSelectChauffeur, selectedId }: GanttChartProps) {
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);

    const { startDate, totalDays } = useMemo(() => {
        const dates: number[] = [];
        expeditions.forEach(e => {
            if (e.date_depart)         dates.push(new Date(e.date_depart).getTime());
            if (e.date_arrivee_prevue) dates.push(new Date(e.date_arrivee_prevue).getTime());
        });
        const today = Date.now();
        dates.push(today - 30 * 86_400_000);
        dates.push(today + 60 * 86_400_000);
        const min = new Date(Math.min(...dates));
        const max = new Date(Math.max(...dates));
        min.setHours(0, 0, 0, 0);
        max.setHours(23, 59, 59, 999);
        return {
            startDate: min,
            totalDays: Math.ceil((max.getTime() - min.getTime()) / 86_400_000) + 1,
        };
    }, [expeditions]);

    const timeLabels = useMemo(() => {
        const labels: { label: string; x: number; major: boolean }[] = [];
        const cur = new Date(startDate);
        while (cur.getTime() < startDate.getTime() + totalDays * 86_400_000) {
            const offset = Math.round((cur.getTime() - startDate.getTime()) / 86_400_000);
            if (cur.getDate() === 1) {
                labels.push({ label: cur.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }), x: offset * PX_PER_DAY, major: true });
            } else if (cur.getDay() === 1) {
                labels.push({ label: cur.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), x: offset * PX_PER_DAY, major: false });
            }
            cur.setDate(cur.getDate() + 1);
        }
        return labels;
    }, [startDate, totalDays]);

    const todayX = useMemo(() => {
        const t = new Date(); t.setHours(0, 0, 0, 0);
        return Math.round((t.getTime() - startDate.getTime()) / 86_400_000) * PX_PER_DAY;
    }, [startDate]);

    const byChau = useMemo(() => {
        const map: Record<number, Expedition[]> = {};
        chauffeurs.forEach(c => { map[c.id] = []; });
        expeditions.forEach(e => {
            const cid = e.chauffeur?.id;
            if (cid != null && map[cid] !== undefined) map[cid].push(e);
        });
        return map;
    }, [chauffeurs, expeditions]);

    function getBar(exp: Expedition) {
        const s = exp.date_depart         ? new Date(exp.date_depart)          : null;
        const e = exp.date_arrivee_prevue ? new Date(exp.date_arrivee_prevue)  : null;
        if (!s && !e) return null;
        const start = s ?? e!;
        const end   = e ?? new Date(start.getTime() + 3 * 86_400_000);
        const left  = Math.round((start.getTime() - startDate.getTime()) / 86_400_000) * PX_PER_DAY;
        const width = Math.max(PX_PER_DAY * 2, Math.round((end.getTime() - start.getTime()) / 86_400_000) * PX_PER_DAY);
        return { left, width };
    }

    const totalW = totalDays * PX_PER_DAY;

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
                <div style={{ width: LABEL_W + totalW }}>
                    {/* Header */}
                    <div className="flex border-b border-border bg-muted/20 sticky top-0 z-20" style={{ height: HEADER_H }}>
                        <div className="shrink-0 flex items-end px-4 pb-2 border-r border-border" style={{ width: LABEL_W }}>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Chauffeur <span className="font-normal normal-case opacity-60">· cliquez pour l'historique</span>
                            </span>
                        </div>
                        <div className="relative overflow-hidden flex-1" style={{ width: totalW }}>
                            {timeLabels.map((tl, i) => (
                                <div key={i} className="absolute bottom-0 pb-2" style={{ left: tl.x + 4 }}>
                                    <span className={`text-[11px] whitespace-nowrap font-${tl.major ? 'bold' : 'normal'} ${tl.major ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {tl.label}
                                    </span>
                                </div>
                            ))}
                            {timeLabels.map((tl, i) => (
                                <div key={`g-${i}`} className={`absolute inset-y-0 ${tl.major ? 'w-px bg-border' : 'w-px bg-border/40'}`} style={{ left: tl.x }} />
                            ))}
                            <div className="absolute inset-y-0 flex flex-col items-center" style={{ left: todayX }}>
                                <div className="w-px flex-1 bg-red-500" />
                                <span className="text-[9px] font-bold text-red-500 pb-1 whitespace-nowrap">auj.</span>
                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    {chauffeurs.map((chau, ri) => {
                        const exps  = byChau[chau.id] ?? [];
                        const even  = ri % 2 === 0;
                        const isSelected = selectedId === chau.id;

                        return (
                            <div
                                key={chau.id}
                                className={`flex border-b border-border/40 last:border-0 transition-colors duration-150
                                    ${isSelected ? 'ring-2 ring-inset ring-purple-400/50' : ''}`}
                                style={{ height: ROW_H }}
                            >
                                {/* Label — clickable */}
                                <button
                                    onClick={() => onSelectChauffeur(chau)}
                                    className={`shrink-0 flex items-center gap-2.5 px-4 border-r border-border text-left transition-colors duration-150
                                        ${isSelected ? 'bg-purple-500/10' : even ? 'bg-muted/10 hover:bg-muted/20' : 'hover:bg-muted/10'}`}
                                    style={{ width: LABEL_W }}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors
                                        ${isSelected ? 'bg-purple-500/20 border-purple-500/40' : 'bg-purple-500/10 border-purple-500/20'} border`}>
                                        <Users size={12} className={isSelected ? 'text-purple-600' : 'text-purple-500'} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-xs font-semibold truncate leading-tight ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-foreground'}`}>
                                            {[chau.nom, chau.prenom].filter(Boolean).join(' ')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">{exps.length} exp.</p>
                                    </div>
                                </button>

                                {/* Timeline */}
                                <div
                                    className={`relative ${even ? 'bg-muted/10' : ''} ${isSelected ? 'bg-purple-500/5' : ''}`}
                                    style={{ width: totalW }}
                                >
                                    {timeLabels.map((tl, i) => (
                                        <div key={i} className={`absolute inset-y-0 ${tl.major ? 'w-px bg-border/60' : 'w-px bg-border/25'}`} style={{ left: tl.x }} />
                                    ))}
                                    <div className="absolute inset-y-0 w-px bg-red-400/50" style={{ left: todayX }} />
                                    {exps.map(exp => {
                                        const bar = getBar(exp);
                                        if (!bar) return null;
                                        const cfg = GANTT_CFG[exp.statut] ?? GANTT_CFG['en cours'];
                                        return (
                                            <motion.div
                                                key={exp.id}
                                                initial={{ opacity: 0, scaleX: 0 }}
                                                animate={{ opacity: 1, scaleX: 1 }}
                                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                                style={{
                                                    position: 'absolute',
                                                    left: bar.left + 3,
                                                    width: bar.width - 6,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    height: BAR_H,
                                                    borderRadius: 7,
                                                    background: cfg.bar,
                                                    borderLeft: `3px solid ${cfg.border}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    paddingLeft: 8,
                                                    paddingRight: 6,
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    transformOrigin: 'left center',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                                }}
                                                onMouseEnter={e => setTooltip({ exp, x: e.clientX, y: e.clientY })}
                                                onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                                                onMouseLeave={() => setTooltip(null)}
                                            >
                                                <span style={{ color: cfg.text, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                    {exp.reference}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="fixed z-50 pointer-events-none bg-card border border-border rounded-xl shadow-2xl p-3.5 text-xs"
                        style={{ left: tooltip.x + 14, top: tooltip.y - 140, minWidth: 210 }}
                    >
                        <p className="font-bold text-foreground text-sm mb-2">{tooltip.exp.reference}</p>
                        <div className="space-y-1 text-muted-foreground">
                            <div className="flex justify-between gap-4"><span>Origine</span><span className="text-foreground font-medium">{tooltip.exp.origine}</span></div>
                            <div className="flex justify-between gap-4"><span>Destination</span><span className="text-foreground font-medium">{tooltip.exp.destination}</span></div>
                            <div className="flex justify-between gap-4"><span>Départ</span><span className="text-foreground font-medium">{fmtShort(tooltip.exp.date_depart)}</span></div>
                            <div className="flex justify-between gap-4"><span>Arrivée prévue</span><span className="text-foreground font-medium">{fmtShort(tooltip.exp.date_arrivee_prevue)}</span></div>
                            <div className="flex justify-between gap-4"><span>Produits</span><span className="text-foreground font-medium">{tooltip.exp.produits?.length ?? 0}</span></div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ color: GANTT_CFG[tooltip.exp.statut]?.text, background: GANTT_CFG[tooltip.exp.statut]?.bar }}>
                                {tooltip.exp.statut}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
interface VisualisationTabProps {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    expeditions: Expedition[];
}

export default function VisualisationTab({ camions, chauffeurs, expeditions }: VisualisationTabProps) {
    const [view, setView]                   = useState<'gantt' | 'arbre'>('gantt');
    const [selectedChauffeur, setSelected]  = useState<Chauffeur | null>(null);

    const VIEWS = [
        { id: 'gantt', label: 'Gantt',           icon: BarChart2 },
        { id: 'arbre', label: 'Arbre de flotte', icon: GitBranch },
    ] as const;

    return (
        <div className="space-y-5">
            {/* View switcher */}
            <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-xl w-fit border border-border">
                {VIEWS.map(v => {
                    const Icon   = v.icon;
                    const active = view === v.id;
                    return (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
                            style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                        >
                            {active && (
                                <motion.div layoutId="viz-pill" className="absolute inset-0 rounded-lg bg-secondary"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                            )}
                            <Icon size={14} className="relative" />
                            <span className="relative">{v.label}</span>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {view === 'gantt' && (
                    <motion.div key="gantt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}
                        className="space-y-4"
                    >
                        {/* Legend */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">Planning Gantt — Chauffeurs</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Cliquez sur un chauffeur pour voir son historique complet
                                </p>
                            </div>
                            <div className="flex items-center gap-4 flex-wrap">
                                {Object.entries(GANTT_CFG).map(([s, c]) => (
                                    <span key={s} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                        <span className="w-3 h-3 rounded-sm" style={{ background: c.bar, border: `2px solid ${c.border}` }} />
                                        {s}
                                    </span>
                                ))}
                                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                    <span className="w-px h-3 bg-red-500" /> Aujourd'hui
                                </span>
                            </div>
                        </div>

                        {/* Gantt + history panel side by side */}
                        <div className="grid gap-4" style={{ gridTemplateColumns: selectedChauffeur ? '1fr 320px' : '1fr' }}>
                            <GanttChart
                                chauffeurs={chauffeurs}
                                expeditions={expeditions}
                                onSelectChauffeur={c => setSelected(prev => prev?.id === c.id ? null : c)}
                                selectedId={selectedChauffeur?.id ?? null}
                            />

                            <AnimatePresence>
                                {selectedChauffeur && (
                                    <ChauffeурHistoryPanel
                                        key={selectedChauffeur.id}
                                        chauffeur={selectedChauffeur}
                                        expeditions={expeditions}
                                        onClose={() => setSelected(null)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {view === 'arbre' && (
                    <motion.div key="arbre" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                        <FleetTree camions={camions} expeditions={expeditions} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
