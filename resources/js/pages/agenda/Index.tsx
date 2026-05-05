import { Head, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Plus, X, Bell, BellRing,
    Truck, MapPin, Wrench, Calendar, Clock, AlertTriangle,
    Pencil, Trash2, CalendarDays, SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ─────────────────────────────────────────────────────────────────────
interface CalendarEvent {
    id: string;
    raw_id?: number;
    type: 'custom' | 'expedition_depart' | 'expedition_arrivee' | 'maintenance' | 'maintenance_prochaine';
    titre: string;
    description?: string;
    date: string;
    date_fin?: string;
    heure?: string;
    couleur: string;
    priorite: 'basse' | 'normale' | 'haute' | 'urgente';
    editable: boolean;
    statut?: string;
    en_retard?: boolean;
    alerter_avant?: number;
}

interface Props {
    evenements: CalendarEvent[];
    alertes: CalendarEvent[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const PRIORITE_CFG = {
    urgente: { label: 'Urgente', color: '#EF4444', bg: '#fee2e2', icon: AlertTriangle },
    haute:   { label: 'Haute',   color: '#F97316', bg: '#ffedd5', icon: BellRing },
    normale: { label: 'Normale', color: '#3B82F6', bg: '#dbeafe', icon: Bell },
    basse:   { label: 'Basse',   color: '#10B981', bg: '#d1fae5', icon: Calendar },
};

const TYPE_ICON: Record<CalendarEvent['type'], React.ElementType> = {
    custom:               CalendarDays,
    expedition_depart:    MapPin,
    expedition_arrivee:   Truck,
    maintenance:          Wrench,
    maintenance_prochaine: Wrench,
};

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function isoToday() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
    // 0=Sun...6=Sat → convert to Mon=0...Sun=6
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
}

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDiff(date: string): string {
    const diff = Math.round((new Date(date).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86_400_000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Demain';
    if (diff === -1) return 'Hier';
    if (diff < 0)  return `Il y a ${Math.abs(diff)} j`;
    return `Dans ${diff} j`;
}

// ── Event form ────────────────────────────────────────────────────────────────
const COLORS = ['#6366f1','#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#F97316','#EC4899'];

interface EventFormProps {
    initial?: Partial<CalendarEvent> & { raw_id?: number };
    onClose: () => void;
}

function EventForm({ initial, onClose }: EventFormProps) {
    const [form, setForm] = useState({
        titre:         initial?.titre         ?? '',
        description:   initial?.description   ?? '',
        date_debut:    initial?.date           ?? isoToday(),
        date_fin:      initial?.date_fin       ?? '',
        heure_debut:   initial?.heure          ?? '',
        heure_fin:     '',
        couleur:       initial?.couleur        ?? '#6366f1',
        priorite:      initial?.priorite       ?? 'normale',
        alerter_avant: String(initial?.alerter_avant ?? 1),
    });
    const [saving, setSaving] = useState(false);

    function set(k: string) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm(p => ({ ...p, [k]: e.target.value }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const payload = { ...form, alerter_avant: Number(form.alerter_avant) };

        if (initial?.raw_id) {
            router.put(`/dashboard/agenda/${initial.raw_id}`, payload, {
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            });
        } else {
            router.post('/dashboard/agenda', payload, {
                onFinish: () => setSaving(false),
                onSuccess: () => onClose(),
            });
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 16 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">
                        {initial?.raw_id ? 'Modifier l\'événement' : 'Nouvel événement'}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center">
                        <X size={14} className="text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Titre</label>
                        <input value={form.titre} onChange={set('titre')} required placeholder="Nom de l'événement"
                            className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Détails optionnels…"
                            className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all resize-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Date début</label>
                            <input type="date" value={form.date_debut} onChange={set('date_debut')} required
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Date fin</label>
                            <input type="date" value={form.date_fin} onChange={set('date_fin')}
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Heure début</label>
                            <input type="time" value={form.heure_debut} onChange={set('heure_debut')}
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Heure fin</label>
                            <input type="time" value={form.heure_fin} onChange={set('heure_fin')}
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Priorité</label>
                            <select value={form.priorite} onChange={set('priorite')}
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring cursor-pointer transition-all">
                                <option value="basse">Basse</option>
                                <option value="normale">Normale</option>
                                <option value="haute">Haute</option>
                                <option value="urgente">Urgente</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Alerte (jours avant)</label>
                            <input type="number" min="0" max="30" value={form.alerter_avant} onChange={set('alerter_avant')}
                                className="w-full bg-muted/30 border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all" />
                        </div>
                    </div>

                    {/* Color picker */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Couleur</label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map(c => (
                                <button
                                    key={c} type="button"
                                    onClick={() => setForm(p => ({ ...p, couleur: c }))}
                                    className={`w-7 h-7 rounded-lg transition-all ${form.couleur === c ? 'ring-2 ring-offset-2 ring-ring scale-110' : 'hover:scale-105'}`}
                                    style={{ background: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button type="submit" disabled={saving}
                            className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-50 transition-all hover:opacity-90">
                            {saving ? 'Enregistrement…' : (initial?.raw_id ? 'Enregistrer' : 'Créer')}
                        </button>
                        <button type="button" onClick={onClose}
                            className="px-4 rounded-xl bg-muted text-muted-foreground text-sm font-semibold hover:bg-muted/80 transition-all">
                            Annuler
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AgendaIndex({ evenements, alertes }: Props) {
    const { flash } = usePage().props as any;
    const today = isoToday();

    const [year, setYear]     = useState(new Date().getFullYear());
    const [month, setMonth]   = useState(new Date().getMonth());
    const [filterDay, setFilterDay] = useState<string>('');
    const [selected, setSelected]   = useState<string | null>(today);
    const [formOpen, setFormOpen]   = useState(false);
    const [editing, setEditing]     = useState<CalendarEvent | null>(null);

    const YEAR_RANGE = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error)   toast.error(flash.error);
    }, [flash]);

    // Build calendar grid
    const grid = useMemo(() => {
        const totalDays = daysInMonth(year, month);
        const startOffset = firstDayOfMonth(year, month);
        const cells: (number | null)[] = [
            ...Array(startOffset).fill(null),
            ...Array.from({ length: totalDays }, (_, i) => i + 1),
        ];
        // Pad to complete weeks
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [year, month]);

    // Events indexed by date
    const byDate = useMemo(() => {
        const map: Record<string, CalendarEvent[]> = {};
        evenements.forEach(e => {
            if (!map[e.date]) map[e.date] = [];
            map[e.date].push(e);
        });
        return map;
    }, [evenements]);

    const selectedEvents = selected ? (byDate[selected] ?? []) : [];

    const urgentCount = alertes.filter(a => a.priorite === 'urgente' || a.priorite === 'haute').length;

    function prevMonth() {
        if (month === 0) { setYear(y => y - 1); setMonth(11); }
        else setMonth(m => m - 1);
    }
    function nextMonth() {
        if (month === 11) { setYear(y => y + 1); setMonth(0); }
        else setMonth(m => m + 1);
    }

    function deleteEvent(ev: CalendarEvent) {
        if (!ev.raw_id) return;
        if (!confirm(`Supprimer "${ev.titre}" ?`)) return;
        router.delete(`/dashboard/agenda/${ev.raw_id}`);
    }

    function dayIso(day: number) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    return (
        <>
            <Head title="Agenda" />
            <AnimatePresence>
                {(formOpen || editing) && (
                    <EventForm
                        initial={editing ?? { date: selected ?? today }}
                        onClose={() => { setFormOpen(false); setEditing(null); }}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 py-8">

                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground tracking-tight">Agenda</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Planification, expéditions, maintenances & rappels
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {urgentCount > 0 && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-sm font-semibold">
                                    <BellRing size={15} className="animate-pulse" />
                                    {urgentCount} alerte{urgentCount > 1 ? 's' : ''} urgente{urgentCount > 1 ? 's' : ''}
                                </div>
                            )}
                            <button
                                onClick={() => { setEditing(null); setFormOpen(true); }}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                            >
                                <Plus size={15} />
                                Nouvel événement
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

                        {/* ── Calendar ── */}
                        <div className="space-y-4">
                            {/* Filter bar */}
                            <div className="bg-card border border-border rounded-2xl px-5 py-3 space-y-3">
                                {/* Prev / title / next */}
                                <div className="flex items-center justify-between">
                                    <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                                        <ChevronLeft size={16} className="text-muted-foreground" />
                                    </button>
                                    <p className="font-bold text-foreground">{MONTHS_FR[month]} {year}</p>
                                    <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
                                        <ChevronRight size={16} className="text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Selectors row */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <SlidersHorizontal size={13} className="text-muted-foreground shrink-0" />

                                    {/* Year */}
                                    <select
                                        value={year}
                                        onChange={e => setYear(Number(e.target.value))}
                                        className="flex-1 min-w-[90px] bg-muted/40 border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-ring cursor-pointer transition-colors"
                                    >
                                        {YEAR_RANGE.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>

                                    {/* Month */}
                                    <select
                                        value={month}
                                        onChange={e => setMonth(Number(e.target.value))}
                                        className="flex-1 min-w-[110px] bg-muted/40 border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-ring cursor-pointer transition-colors"
                                    >
                                        {MONTHS_FR.map((m, i) => (
                                            <option key={i} value={i}>{m}</option>
                                        ))}
                                    </select>

                                    {/* Day */}
                                    <input
                                        type="number"
                                        min={1}
                                        max={daysInMonth(year, month)}
                                        placeholder="Jour"
                                        value={filterDay}
                                        onChange={e => {
                                            const v = e.target.value;
                                            setFilterDay(v);
                                            if (v) {
                                                const d = Math.min(Math.max(1, Number(v)), daysInMonth(year, month));
                                                setSelected(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
                                            }
                                        }}
                                        className="w-20 bg-muted/40 border border-border rounded-lg px-2.5 py-1.5 text-xs font-semibold text-foreground outline-none focus:border-ring transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                                    />

                                    {/* Today shortcut */}
                                    <button
                                        onClick={() => {
                                            const now = new Date();
                                            setYear(now.getFullYear());
                                            setMonth(now.getMonth());
                                            setFilterDay('');
                                            setSelected(today);
                                        }}
                                        className="text-xs font-semibold text-muted-foreground hover:text-foreground border border-border rounded-lg px-2.5 py-1.5 hover:bg-muted transition-colors whitespace-nowrap"
                                    >
                                        Aujourd'hui
                                    </button>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="bg-card border border-border rounded-2xl overflow-hidden">
                                {/* Day headers */}
                                <div className="grid grid-cols-7 border-b border-border">
                                    {DAYS_FR.map(d => (
                                        <div key={d} className="text-center py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Day cells */}
                                <div className="grid grid-cols-7">
                                    {grid.map((day, idx) => {
                                        if (!day) return (
                                            <div key={`empty-${idx}`} className="min-h-20 border-b border-r border-border/40 bg-muted/5 last:border-r-0" />
                                        );

                                        const iso      = dayIso(day);
                                        const isToday  = iso === today;
                                        const isSel    = iso === selected;
                                        const events   = byDate[iso] ?? [];
                                        const colIdx   = idx % 7;

                                        return (
                                            <motion.div
                                                key={iso}
                                                onClick={() => setSelected(iso)}
                                                whileHover={{ scale: 1.01 }}
                                                className={`min-h-20 border-b border-r border-border/40 last:border-r-0 p-1.5 cursor-pointer transition-colors duration-150
                                                    ${isSel ? 'bg-primary/8 ring-2 ring-inset ring-primary/40' : 'hover:bg-muted/30'}
                                                    ${colIdx === 6 ? 'border-r-0' : ''}`}
                                            >
                                                {/* Day number */}
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                                        ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                                        {day}
                                                    </span>
                                                    {events.length > 0 && (
                                                        <span className="text-[9px] font-bold text-muted-foreground">{events.length}</span>
                                                    )}
                                                </div>

                                                {/* Event pills */}
                                                <div className="space-y-0.5">
                                                    {events.slice(0, 3).map(ev => (
                                                        <div
                                                            key={ev.id}
                                                            className="truncate text-[10px] font-semibold px-1.5 py-px rounded"
                                                            style={{ background: ev.couleur + '25', color: ev.couleur, borderLeft: `2px solid ${ev.couleur}` }}
                                                        >
                                                            {ev.titre}
                                                        </div>
                                                    ))}
                                                    {events.length > 3 && (
                                                        <div className="text-[9px] text-muted-foreground pl-1">+{events.length - 3} autres</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected day events */}
                            <AnimatePresence mode="wait">
                                {selected && (
                                    <motion.div
                                        key={selected}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-card border border-border rounded-2xl p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-semibold text-foreground">{fmtDate(selected)}</p>
                                                <p className="text-xs text-muted-foreground">{selectedEvents.length} événement{selectedEvents.length !== 1 ? 's' : ''}</p>
                                            </div>
                                            <button
                                                onClick={() => { setEditing(null); setFormOpen(true); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                                            >
                                                <Plus size={12} /> Ajouter
                                            </button>
                                        </div>

                                        {selectedEvents.length === 0 ? (
                                            <p className="text-sm text-muted-foreground/50 text-center py-6 italic">Aucun événement ce jour</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {selectedEvents.map(ev => {
                                                    const Icon = TYPE_ICON[ev.type];
                                                    return (
                                                        <div
                                                            key={ev.id}
                                                            className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors group"
                                                        >
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                                style={{ background: ev.couleur + '20', border: `1.5px solid ${ev.couleur}40` }}>
                                                                <Icon size={14} style={{ color: ev.couleur }} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-foreground">{ev.titre}</p>
                                                                {ev.description && (
                                                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{ev.description}</p>
                                                                )}
                                                                {ev.heure && (
                                                                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                        <Clock size={9} /> {ev.heure}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {ev.editable && (
                                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                    <button onClick={() => setEditing(ev)}
                                                                        className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                                                        <Pencil size={12} className="text-muted-foreground" />
                                                                    </button>
                                                                    <button onClick={() => deleteEvent(ev)}
                                                                        className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                                                                        <Trash2 size={12} className="text-destructive/70" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* ── Alerts sidebar ── */}
                        <div className="space-y-4">
                            {/* Alert header */}
                            <div className="bg-card border border-border rounded-2xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${urgentCount > 0 ? 'bg-red-500/15' : 'bg-muted'}`}>
                                        <BellRing size={15} className={urgentCount > 0 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Alertes & Rappels</p>
                                        <p className="text-xs text-muted-foreground">30 prochains jours</p>
                                    </div>
                                    {urgentCount > 0 && (
                                        <span className="ml-auto text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                                            {urgentCount}
                                        </span>
                                    )}
                                </div>

                                {alertes.length === 0 ? (
                                    <p className="text-xs text-muted-foreground/50 text-center py-6 italic">Aucune alerte à venir</p>
                                ) : (
                                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                        {alertes.map(ev => {
                                            const pCfg = PRIORITE_CFG[ev.priorite];
                                            const Icon = TYPE_ICON[ev.type];
                                            const PIcon = pCfg.icon;
                                            return (
                                                <motion.div
                                                    key={ev.id}
                                                    initial={{ opacity: 0, x: 8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    onClick={() => {
                                                        setSelected(ev.date);
                                                        const d = new Date(ev.date);
                                                        setYear(d.getFullYear());
                                                        setMonth(d.getMonth());
                                                    }}
                                                    className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-muted/30 transition-colors"
                                                    style={{ borderColor: pCfg.color + '35', background: pCfg.color + '08' }}
                                                >
                                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                        style={{ background: pCfg.bg, color: pCfg.color }}>
                                                        <Icon size={12} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-foreground leading-tight truncate">{ev.titre}</p>
                                                        {ev.description && (
                                                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">{ev.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] font-semibold" style={{ color: pCfg.color }}>
                                                                {fmtDiff(ev.date)}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">{fmtDate(ev.date)}</span>
                                                        </div>
                                                    </div>
                                                    <PIcon size={12} style={{ color: pCfg.color }} className="shrink-0 mt-0.5" />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Legend */}
                            <div className="bg-card border border-border rounded-2xl p-4">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Légende</p>
                                <div className="space-y-2">
                                    {[
                                        { color: '#3B82F6', label: 'Départ expédition' },
                                        { color: '#10B981', label: 'Arrivée prévue' },
                                        { color: '#F59E0B', label: 'Maintenance' },
                                        { color: '#F97316', label: 'Prochain entretien' },
                                        { color: '#EF4444', label: 'En retard / Urgent' },
                                        { color: '#6366f1', label: 'Événement personnalisé' },
                                    ].map(l => (
                                        <div key={l.label} className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="w-3 h-3 rounded shrink-0" style={{ background: l.color + '30', border: `2px solid ${l.color}` }} />
                                            {l.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AgendaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Agenda',    href: '/dashboard/agenda' },
    ],
};
