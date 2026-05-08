import { Head, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
    AlertCircle, AlertTriangle, ArrowRight, Bell, CalendarDays,
    Check, CheckCircle2, ChevronRight, Clock, FileText,
    Flag, Home, Lock, LogOut, Moon, Navigation, Package,
    Play, Shield, Sun, Truck, User, X, XCircle, Zap,
    Monitor, Umbrella, Plus, BriefcaseMedical,
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance.tsx';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserAccount { email: string; must_change_password: boolean }

interface Chauffeur {
    id: number; nom: string; prenom: string;
    telephone: string | null; email: string | null;
    statut: 'disponible' | 'en mission' | 'en_repos';
    permis: string | null; notes: string | null;
    user?: UserAccount;
}

interface ChauffeurNotif {
    id: number;
    type: string;
    message: string;
    read_at: string | null;
    created_at: string;
}

interface Camion { id: number; immatriculation: string; marque: string }
interface Produit { id: number; nom: string; pivot: { quantite: number } }
interface Livraison { id: number; etat: string; commentaire: string | null; date_statut: string | null; km_reel: number | null; valide_admin: boolean }

interface Expedition {
    id: number; reference: string;
    origine: string; destination: string;
    date_depart: string; date_arrivee_prevue: string | null;
    statut: string; details: string | null;
    distance_km: number | null; cout_total: number | null;
    camion?: Camion; produits?: Produit[]; livraisons?: Livraison[];
}

interface HseDoc {
    id: number; type: string; numero: string | null;
    date_expiration: string | null; organisme: string | null;
    statut: 'valide' | 'expire_bientot' | 'expire';
    jours_restants: number | null;
}

interface HseIncident {
    id: number; type: string; date_incident: string;
    lieu: string | null; description: string;
    blesses: boolean; nb_blesses: number;
    dommages_vehicule: boolean;
    causes: string[] | null; statut: 'ouvert' | 'en_investigation' | 'clos';
}

interface Conge {
    id: number; date_debut: string; date_fin: string;
    type: string; motif: string | null;
    statut: 'en_attente' | 'approuve' | 'refuse';
    commentaire_admin: string | null;
}

interface Stats {
    incidents_ouverts: number; docs_expires: number;
    docs_expire_bientot: number; docs_valides: number;
    voyages_total: number; conges_en_attente: number;
    notifications_non_lues: number;
}

interface Props {
    chauffeur: Chauffeur;
    activeExpedition: Expedition | null;
    agenda: Expedition[];
    pastExpeditions: Expedition[];
    incidents: HseIncident[];
    documents: HseDoc[];
    conges: Conge[];
    notifications: ChauffeurNotif[];
    stats: Stats;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INCIDENT_TYPES = [
    { value: 'accident',        label: 'Accident',         color: '#ef4444' },
    { value: 'panne',           label: 'Panne',            color: '#f97316' },
    { value: 'vol',             label: 'Vol',              color: '#8b5cf6' },
    { value: 'dommage_cargo',   label: 'Dommage cargo',    color: '#f59e0b' },
    { value: 'presqu_accident', label: 'Presque-accident', color: '#06b6d4' },
    { value: 'blessure',        label: 'Blessure',         color: '#ec4899' },
];

const CAUSES_OPTIONS = [
    { value: 'vitesse',               label: 'Excès de vitesse' },
    { value: 'fatigue',               label: 'Fatigue' },
    { value: 'etat_route',            label: 'État de la route' },
    { value: 'defaillance_mecanique', label: 'Défaillance mécanique' },
    { value: 'meteo',                 label: 'Météo' },
    { value: 'animaux',               label: 'Animaux' },
    { value: 'autre_conducteur',      label: 'Autre conducteur' },
    { value: 'chargement',            label: 'Chargement' },
    { value: 'autre',                 label: 'Autre' },
];

const CONGE_TYPES: Record<string, { label: string; color: string }> = {
    conge_annuel: { label: 'Congé annuel',  color: '#3b82f6' },
    maladie:      { label: 'Maladie',       color: '#f97316' },
    recuperation: { label: 'Récupération',  color: '#8b5cf6' },
    autre:        { label: 'Autre',          color: '#6b7280' },
};

const DOC_LABELS: Record<string, string> = {
    permis_conduire:       'Permis de conduire',
    certificat_medical:    'Certificat médical',
    carte_professionnelle: 'Carte pro. CEDEAO',
    formation_securite:    'Formation sécurité',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const greeting = (prenom: string) => {
    const h = new Date().getHours();
    return `${h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir'}, ${prenom} !`;
};

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const fmtDatetime = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const initials = (prenom: string, nom: string) =>
    `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

const nbJours = (debut: string, fin: string) => {
    const d1 = new Date(debut); const d2 = new Date(fin);
    return Math.round((d2.getTime() - d1.getTime()) / 86400000) + 1;
};

// ─── Reusable badges ─────────────────────────────────────────────────────────

const StatutExpedition = ({ s }: { s: string }) => {
    const map: Record<string, string> = {
        'en préparation':   'bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30',
        'en cours':         'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
        'livraison_soumise':'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
        'livré':            'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-500/15 dark:text-gray-400 dark:border-gray-500/30',
        'annulé':           'bg-red-100 text-red-500 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    };
    const labels: Record<string, string> = {
        'en préparation': 'En préparation', 'en cours': 'En cours',
        'livraison_soumise': 'En validation', 'livré': 'Livré', 'annulé': 'Annulé',
    };
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[s] ?? 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-500/15 dark:text-gray-400'}`}>{labels[s] ?? s}</span>;
};

const StatutIncident = ({ s }: { s: HseIncident['statut'] }) => {
    const map = {
        ouvert:           'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
        en_investigation: 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
        clos:             'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-500/15 dark:text-gray-400 dark:border-gray-500/30',
    };
    const labels = { ouvert: 'Ouvert', en_investigation: 'En investigation', clos: 'Clos' };
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[s]}`}>{labels[s]}</span>;
};

const StatutConge = ({ s }: { s: Conge['statut'] }) => {
    const map = {
        en_attente: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30',
        approuve:   'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30',
        refuse:     'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30',
    };
    const labels = { en_attente: 'En attente', approuve: 'Approuvé', refuse: 'Refusé' };
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${map[s]}`}>{labels[s]}</span>;
};

// ─── Expedition card ──────────────────────────────────────────────────────────

const ExpCard = ({ exp }: { exp: Expedition }) => (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
            <div>
                <p className="text-[11px] text-gray-400 dark:text-white/30 font-mono">{exp.reference}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{fmtDate(exp.date_depart)}</p>
                    {exp.date_arrivee_prevue && (
                        <span className="text-gray-400 dark:text-white/30 text-xs">→ {fmtDate(exp.date_arrivee_prevue)}</span>
                    )}
                </div>
            </div>
            <StatutExpedition s={exp.statut} />
        </div>
        <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-gray-700 dark:text-white/70 truncate">{exp.origine}</span>
            </div>
            <ArrowRight size={12} className="text-gray-300 dark:text-white/20 shrink-0" />
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                <span className="text-gray-700 dark:text-white/70 truncate">{exp.destination}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            </div>
        </div>
        {exp.camion && (
            <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-white/[0.05] text-xs text-gray-400 dark:text-white/30 flex items-center gap-1.5">
                <Truck size={10} /> {exp.camion.immatriculation} — {exp.camion.marque}
            </div>
        )}
    </div>
);

// ─── CongeModal ───────────────────────────────────────────────────────────────

function CongeModal({ onClose }: { onClose: () => void }) {
    const today = new Date().toISOString().split('T')[0];
    const form = useForm({
        date_debut: today,
        date_fin:   today,
        type:       'conge_annuel',
        motif:      '',
    });

    const submit = () => form.post('/chauffeur/conges', {
        preserveScroll: true,
        onSuccess: () => onClose(),
    });

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0d1829] border border-gray-200 dark:border-white/10 shadow-2xl">

                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
                </div>
                <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                            <Umbrella size={14} className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">Demande de congé</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                        <X size={14} className="text-gray-400 dark:text-white/60" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Type */}
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">Type de congé</p>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(CONGE_TYPES).map(([val, { label, color }]) => (
                                <button key={val} onClick={() => form.setData('type', val)}
                                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${form.data.type === val ? 'border-current' : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40'}`}
                                    style={form.data.type === val ? { color, backgroundColor: `${color}15`, borderColor: `${color}40` } : {}}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Date de début</p>
                            <input type="date" value={form.data.date_debut} min={today}
                                onChange={e => form.setData('date_debut', e.target.value)}
                                className="w-full h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 text-sm text-gray-900 dark:text-white" />
                            {form.errors.date_debut && <p className="text-red-500 text-xs mt-1">{form.errors.date_debut}</p>}
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Date de fin</p>
                            <input type="date" value={form.data.date_fin} min={form.data.date_debut}
                                onChange={e => form.setData('date_fin', e.target.value)}
                                className="w-full h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 text-sm text-gray-900 dark:text-white" />
                            {form.errors.date_fin && <p className="text-red-500 text-xs mt-1">{form.errors.date_fin}</p>}
                        </div>
                    </div>

                    {form.data.date_debut && form.data.date_fin && form.data.date_fin >= form.data.date_debut && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Durée : {nbJours(form.data.date_debut, form.data.date_fin)} jour(s)
                        </p>
                    )}

                    {/* Motif */}
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Motif (optionnel)</p>
                        <textarea value={form.data.motif} onChange={e => form.setData('motif', e.target.value)}
                            placeholder="Précisez si nécessaire…" rows={3}
                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 resize-none" />
                    </div>
                </div>

                <div className="px-5 pb-6 pt-2">
                    <button onClick={submit} disabled={form.processing}
                        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                        <Umbrella size={16} />
                        {form.processing ? 'Envoi…' : 'Envoyer la demande'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── NotificationsModal ───────────────────────────────────────────────────────

const NOTIF_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
    conge_approuve:      { icon: CheckCircle2, color: '#10b981' },
    conge_refuse:        { icon: XCircle,      color: '#ef4444' },
    expedition_assignee: { icon: Truck,        color: '#3b82f6' },
    expedition_annulee:  { icon: XCircle,      color: '#ef4444' },
    livraison_validee:   { icon: Package,      color: '#10b981' },
    livraison_annulee:   { icon: Package,      color: '#ef4444' },
};

function NotificationsModal({ notifications, onClose }: { notifications: ChauffeurNotif[]; onClose: () => void }) {
    const fmtAgo = (d: string) => {
        const diff = Date.now() - new Date(d).getTime();
        const m = Math.floor(diff / 60000);
        if (m < 1) { return 'À l\'instant'; }
        if (m < 60) { return `il y a ${m} min`; }
        const h = Math.floor(m / 60);
        if (h < 24) { return `il y a ${h}h`; }
        return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full sm:max-w-lg max-h-[80vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0d1829] border border-gray-200 dark:border-white/10 shadow-2xl">

                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
                </div>
                <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                            <Bell size={14} className="text-purple-500 dark:text-purple-400" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">Notifications</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                        <X size={14} className="text-gray-400 dark:text-white/60" />
                    </button>
                </div>

                <div className="p-3">
                    {notifications.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 dark:text-white/30">
                            <Bell size={28} className="mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Aucune notification</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map(n => {
                                const cfg = NOTIF_CONFIG[n.type] ?? { icon: Bell, color: '#6b7280' };
                                const Icon = cfg.icon;
                                const isNew = !n.read_at;
                                return (
                                    <div key={n.id}
                                        className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-colors ${isNew ? 'bg-purple-50 dark:bg-purple-500/8' : 'bg-transparent'}`}>
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: `${cfg.color}18` }}>
                                            <Icon size={14} style={{ color: cfg.color }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${isNew ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-white/70'}`}>
                                                {n.message}
                                            </p>
                                            <p className="text-[11px] text-gray-400 dark:text-white/30 mt-0.5">{fmtAgo(n.created_at)}</p>
                                        </div>
                                        {isNew && <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

// ─── IncidentModal ────────────────────────────────────────────────────────────

function IncidentModal({ onClose, expedition }: { onClose: () => void; expedition: Expedition | null }) {
    const form = useForm({
        type: 'accident', date_incident: new Date().toISOString().slice(0, 16),
        lieu: '', description: '', blesses: false, nb_blesses: 0,
        dommages_vehicule: false, cout_estime: '',
        causes: [] as string[], expedition_id: expedition?.id?.toString() ?? '',
    });

    const toggleCause = (v: string) =>
        form.setData('causes', form.data.causes.includes(v)
            ? form.data.causes.filter(c => c !== v)
            : [...form.data.causes, v]);

    const submit = () => form.post('/chauffeur/incidents', { preserveScroll: true, onSuccess: () => onClose() });

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0d1829] border border-gray-200 dark:border-white/10 shadow-2xl">

                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-white/20" />
                </div>
                <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                            <AlertTriangle size={14} className="text-red-500 dark:text-red-400" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">Déclarer un incident</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                        <X size={14} className="text-gray-400 dark:text-white/60" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">Type d'incident</p>
                        <div className="grid grid-cols-3 gap-2">
                            {INCIDENT_TYPES.map(t => (
                                <button key={t.value} onClick={() => form.setData('type', t.value)}
                                    className={`py-2.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${form.data.type === t.value ? 'border-current' : 'border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/40'}`}
                                    style={form.data.type === t.value ? { color: t.color, backgroundColor: `${t.color}18`, borderColor: `${t.color}50` } : {}}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Date & heure</p>
                            <input type="datetime-local" value={form.data.date_incident} onChange={e => form.setData('date_incident', e.target.value)}
                                className="w-full h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 text-sm text-gray-900 dark:text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Lieu</p>
                            <input type="text" value={form.data.lieu} onChange={e => form.setData('lieu', e.target.value)}
                                placeholder="Route, km…" className="w-full h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20" />
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">Description *</p>
                        <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)}
                            placeholder="Décrivez ce qui s'est passé…" rows={3}
                            className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 resize-none" />
                        {form.errors.description && <p className="text-red-500 text-xs mt-1">{form.errors.description}</p>}
                    </div>

                    <div className="flex gap-3">
                        {[
                            { key: 'blesses', label: 'Blessés', icon: AlertCircle, activeColor: 'text-red-600 bg-red-50 border-red-300 dark:text-red-400 dark:bg-red-500/15 dark:border-red-500/40' },
                            { key: 'dommages_vehicule', label: 'Dommages', icon: Truck, activeColor: 'text-orange-600 bg-orange-50 border-orange-300 dark:text-orange-400 dark:bg-orange-500/15 dark:border-orange-500/40' },
                        ].map(({ key, label, icon: Icon, activeColor }) => {
                            const active = form.data[key as 'blesses' | 'dommages_vehicule'];
                            return (
                                <button key={key} onClick={() => form.setData(key as any, !active)}
                                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium border transition-all ${active ? activeColor : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 dark:text-white/50'}`}>
                                    <Icon size={14} /> {label}
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">Causes</p>
                        <div className="flex flex-wrap gap-1.5">
                            {CAUSES_OPTIONS.map(c => (
                                <button key={c.value} onClick={() => toggleCause(c.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.data.causes.includes(c.value) ? 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/40 dark:text-emerald-400' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40'}`}>
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-5 pb-6 pt-2">
                    <button onClick={submit} disabled={form.processing}
                        className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 active:scale-[0.98] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                        <AlertTriangle size={16} />
                        {form.processing ? 'Envoi…' : "Déclarer l'incident"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Tab: Accueil ─────────────────────────────────────────────────────────────

function AccueilTab({ chauffeur, activeExpedition, stats, documents, incidents, onDeclareIncident, onTabChange }: {
    chauffeur: Chauffeur; activeExpedition: Expedition | null;
    stats: Stats; documents: HseDoc[]; incidents: HseIncident[];
    onDeclareIncident: () => void; onTabChange: (t: Tab) => void;
}) {
    const driver = {
        disponible:  { label: 'Disponible',  dot: 'bg-emerald-500', cls: 'text-emerald-600 dark:text-emerald-400' },
        'en mission': { label: 'En mission',  dot: 'bg-blue-500 animate-pulse', cls: 'text-blue-600 dark:text-blue-400' },
        en_repos:    { label: 'En repos',    dot: 'bg-gray-400', cls: 'text-gray-500 dark:text-gray-400' },
    }[chauffeur.statut] ?? { label: chauffeur.statut, dot: 'bg-gray-400', cls: 'text-gray-500' };

    const urgentDocs = documents.filter(d => d.statut !== 'valide')
        .sort((a, b) => (a.jours_restants ?? -999) - (b.jours_restants ?? -999)).slice(0, 3);

    return (
        <div className="px-4 pt-6 pb-4 space-y-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{greeting(chauffeur.prenom)}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-2 h-2 rounded-full ${driver.dot}`} />
                        <span className={`text-sm font-medium ${driver.cls}`}>{driver.label}</span>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { value: stats.voyages_total, label: 'Voyages', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { value: stats.docs_valides, label: 'Docs OK', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { value: stats.incidents_ouverts, label: 'Incidents', color: stats.incidents_ouverts > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400', bg: stats.incidents_ouverts > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-white/5' },
                ].map(s => (
                    <div key={s.label} className={`rounded-2xl ${s.bg} border border-gray-100 dark:border-white/[0.05] p-3.5`}>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Active expedition */}
            {activeExpedition ? (
                <button onClick={() => onTabChange('voyage')} className="w-full text-left">
                    <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-blue-50 dark:from-emerald-600/20 dark:to-blue-600/10 border border-emerald-200 dark:border-emerald-500/20 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <Navigation size={12} /> Voyage en cours
                            </span>
                            <StatutExpedition s={activeExpedition.statut} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activeExpedition.origine}</p>
                                <p className="text-[11px] text-gray-500 dark:text-white/40">{fmtDate(activeExpedition.date_depart)}</p>
                            </div>
                            <div className="flex items-center gap-1 px-2">
                                <div className="w-8 h-px bg-gray-300 dark:bg-white/20" />
                                <ArrowRight size={12} className="text-emerald-500" />
                                <div className="w-8 h-px bg-gray-300 dark:bg-white/20" />
                            </div>
                            <div className="flex-1 min-w-0 text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{activeExpedition.destination}</p>
                                {activeExpedition.date_arrivee_prevue && (
                                    <p className="text-[11px] text-gray-500 dark:text-white/40">{fmtDate(activeExpedition.date_arrivee_prevue)}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Voir le voyage <ChevronRight size={13} />
                        </div>
                    </div>
                </button>
            ) : (
                <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <Truck size={18} className="text-gray-300 dark:text-white/20" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-white/60">Aucun voyage actif</p>
                        <p className="text-xs text-gray-400 dark:text-white/30">Votre prochaine mission apparaîtra ici</p>
                    </div>
                </div>
            )}

            {/* Doc alerts */}
            {urgentDocs.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2.5">Alertes documents</p>
                    <div className="space-y-2">
                        {urgentDocs.map(doc => (
                            <div key={doc.id} className={`rounded-xl p-3.5 border flex items-center gap-3 ${doc.statut === 'expire' ? 'bg-red-50 border-red-200 dark:bg-red-500/8 dark:border-red-500/20' : 'bg-amber-50 border-amber-200 dark:bg-amber-500/8 dark:border-amber-500/20'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${doc.statut === 'expire' ? 'bg-red-100 dark:bg-red-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
                                    {doc.statut === 'expire' ? <XCircle size={15} className="text-red-500 dark:text-red-400" /> : <Clock size={15} className="text-amber-500 dark:text-amber-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{DOC_LABELS[doc.type] ?? doc.type}</p>
                                    <p className={`text-xs ${doc.statut === 'expire' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                        {doc.statut === 'expire' ? 'Expiré' : `Expire dans ${doc.jours_restants}j`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={onDeclareIncident}
                className="w-full h-12 rounded-2xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                <AlertTriangle size={16} /> Déclarer un incident
            </button>
        </div>
    );
}

// ─── Tab: Voyage ──────────────────────────────────────────────────────────────

function VoyageTab({ expedition, onDeclareIncident }: { expedition: Expedition | null; onDeclareIncident: () => void }) {
    const [confirmAction, setConfirmAction] = useState<'en cours' | 'livré' | null>(null);
    const [commentaire, setCommentaire]     = useState('');
    const [kmReel, setKmReel]               = useState('');
    const [processing, setProcessing]       = useState(false);

    const doUpdate = (etat: 'en cours' | 'livré') => {
        if (!expedition) { return; }
        setProcessing(true);
        router.patch(`/chauffeur/expeditions/${expedition.id}/statut`, {
            etat,
            commentaire: commentaire || null,
            km_reel: kmReel ? parseInt(kmReel, 10) : null,
        }, {
            preserveScroll: true,
            onSuccess: () => { setConfirmAction(null); setCommentaire(''); setKmReel(''); },
            onFinish:  () => setProcessing(false),
        });
    };

    if (!expedition) return (
        <div className="flex flex-col items-center justify-center h-full px-8 py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                <Truck size={36} className="text-gray-300 dark:text-white/15" />
            </div>
            <p className="text-gray-500 dark:text-white/60 font-medium mb-1">Aucun voyage actif</p>
            <p className="text-sm text-gray-400 dark:text-white/30">Vous n'avez pas de mission en cours.</p>
        </div>
    );

    return (
        <div className="px-4 pt-6 pb-4 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 dark:text-white/40 font-medium">Mission</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{expedition.reference}</p>
                </div>
                <StatutExpedition s={expedition.statut} />
            </div>

            {/* Route */}
            <div className="rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-600/15 dark:to-purple-600/10 border border-blue-200 dark:border-blue-500/15 p-5">
                <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1.5" />
                        <p className="text-xs text-gray-500 dark:text-white/40 mb-0.5">Départ</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white truncate">{expedition.origine}</p>
                        <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{fmtDate(expedition.date_depart)}</p>
                    </div>
                    <ArrowRight size={18} className="text-blue-500 dark:text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0 text-right">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400 mb-1.5 ml-auto" />
                        <p className="text-xs text-gray-500 dark:text-white/40 mb-0.5">Arrivée prévue</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white truncate">{expedition.destination}</p>
                        {expedition.date_arrivee_prevue && <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{fmtDate(expedition.date_arrivee_prevue)}</p>}
                    </div>
                </div>
                {(expedition.distance_km || expedition.camion) && (
                    <div className="mt-4 pt-4 border-t border-blue-100 dark:border-white/10 flex items-center gap-4 text-xs text-gray-500 dark:text-white/40">
                        {expedition.distance_km && <span className="flex items-center gap-1.5"><Navigation size={11} />{expedition.distance_km.toLocaleString('fr-FR')} km</span>}
                        {expedition.camion && <span className="flex items-center gap-1.5"><Truck size={11} />{expedition.camion.immatriculation} — {expedition.camion.marque}</span>}
                    </div>
                )}
            </div>

            {/* Cargo */}
            {expedition.produits && expedition.produits.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] p-4">
                    <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Package size={12} /> Cargaison
                    </p>
                    {expedition.produits.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-sm py-1">
                            <span className="text-gray-700 dark:text-white/70">{p.nom}</span>
                            <span className="text-gray-400 dark:text-white/40 font-mono">{p.pivot.quantite} u.</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Timeline */}
            {expedition.livraisons && expedition.livraisons.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] p-4">
                    <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-3">Historique statuts</p>
                    {expedition.livraisons.map((l, i) => (
                        <div key={l.id} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                                {i < expedition.livraisons!.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-white/10 mt-1 min-h-[16px]" />}
                            </div>
                            <div className="flex-1 min-w-0 pb-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{l.etat}</p>
                                {l.date_statut && <p className="text-xs text-gray-400 dark:text-white/30">{fmtDatetime(l.date_statut)}</p>}
                                {l.km_reel != null && <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5"><Navigation size={10} />{l.km_reel.toLocaleString('fr-FR')} km réels</p>}
                                {l.commentaire && <p className="text-xs text-gray-500 dark:text-white/40 italic mt-0.5">{l.commentaire}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pending admin validation banner */}
            {expedition.statut === 'livraison_soumise' && (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock size={16} className="text-amber-500 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Livraison soumise</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-0.5">
                            Votre déclaration de livraison a été envoyée. Elle sera confirmée par l'administration.
                        </p>
                    </div>
                </div>
            )}

            {/* Actions */}
            {!confirmAction && (expedition.statut === 'en préparation' || expedition.statut === 'en cours') && (
                <div className="space-y-2.5 pt-2">
                    {expedition.statut === 'en préparation' && (
                        <button onClick={() => setConfirmAction('en cours')}
                            className="w-full h-14 rounded-2xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-bold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20">
                            <Play size={18} /> Démarrer le voyage
                        </button>
                    )}
                    {expedition.statut === 'en cours' && (
                        <button onClick={() => setConfirmAction('livré')}
                            className="w-full h-14 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-bold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/20">
                            <Flag size={18} /> Marquer comme livré
                        </button>
                    )}
                    <button onClick={onDeclareIncident}
                        className="w-full h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                        <AlertTriangle size={14} /> Signaler un incident
                    </button>
                </div>
            )}

            {confirmAction && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 border space-y-3 ${confirmAction === 'livré' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20'}`}>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {confirmAction === 'livré' ? 'Confirmer la livraison ?' : 'Confirmer le démarrage ?'}
                    </p>

                    {/* km réels — surtout utile pour la livraison */}
                    {confirmAction === 'livré' && (
                        <div>
                            <p className="text-[11px] font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1.5">
                                Kilométrage réel
                            </p>
                            <div className="relative">
                                <input
                                    type="number" min="0" placeholder="Ex : 450"
                                    value={kmReel}
                                    onChange={e => setKmReel(e.target.value)}
                                    className="w-full h-10 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-3 pr-12 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-white/30 font-medium">km</span>
                            </div>
                        </div>
                    )}

                    <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)}
                        placeholder="Commentaire optionnel…" rows={2}
                        className="w-full rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 resize-none" />
                    <div className="flex gap-2">
                        <button onClick={() => setConfirmAction(null)}
                            className="flex-1 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 text-sm font-medium">
                            Annuler
                        </button>
                        <button onClick={() => doUpdate(confirmAction)} disabled={processing}
                            className={`flex-1 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-1.5 disabled:opacity-60 ${confirmAction === 'livré' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                            <Check size={14} /> Confirmer
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// ─── Tab: Missions + Congés ───────────────────────────────────────────────────

type MissionSection = 'upcoming' | 'history' | 'conges';

function MissionsTab({ agenda, pastExpeditions, conges, onRequestConge }: {
    agenda: Expedition[];
    pastExpeditions: Expedition[];
    conges: Conge[];
    onRequestConge: () => void;
}) {
    const [section, setSection] = useState<MissionSection>('upcoming');

    const sectionTabs = [
        { id: 'upcoming' as MissionSection, label: `À venir (${agenda.length})` },
        { id: 'history'  as MissionSection, label: `Historique (${pastExpeditions.length})` },
        { id: 'conges'   as MissionSection, label: `Congés (${conges.length})` },
    ];

    return (
        <div className="px-4 pt-6 pb-4 space-y-4">
            {/* Toggle */}
            <div className="flex bg-gray-100 dark:bg-white/5 rounded-2xl p-1 gap-1">
                {sectionTabs.map(tab => (
                    <button key={tab.id} onClick={() => setSection(tab.id)}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-semibold transition-all ${section === tab.id ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-white/40'}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {section === 'upcoming' && (
                agenda.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] p-8 text-center">
                        <CalendarDays size={28} className="mx-auto text-gray-300 dark:text-white/15 mb-2" />
                        <p className="text-sm text-gray-400 dark:text-white/40">Aucun voyage planifié</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">{agenda.map(e => <ExpCard key={e.id} exp={e} />)}</div>
                )
            )}

            {section === 'history' && (
                pastExpeditions.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] p-8 text-center">
                        <FileText size={28} className="mx-auto text-gray-300 dark:text-white/15 mb-2" />
                        <p className="text-sm text-gray-400 dark:text-white/40">Aucun voyage terminé</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">{pastExpeditions.map(e => <ExpCard key={e.id} exp={e} />)}</div>
                )
            )}

            {section === 'conges' && (
                <div className="space-y-4">
                    <button onClick={onRequestConge}
                        className="w-full h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
                        <Plus size={15} /> Faire une demande de congé
                    </button>

                    {conges.length === 0 ? (
                        <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] p-8 text-center">
                            <Umbrella size={28} className="mx-auto text-gray-300 dark:text-white/15 mb-2" />
                            <p className="text-sm text-gray-400 dark:text-white/40">Aucune demande de congé</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {conges.map(c => {
                                const type = CONGE_TYPES[c.type] ?? { label: c.type, color: '#6b7280' };
                                return (
                                    <div key={c.id} className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] p-4">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${type.color}15` }}>
                                                    <Umbrella size={14} style={{ color: type.color }} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{type.label}</p>
                                                    <p className="text-xs text-gray-400 dark:text-white/30">
                                                        {fmtDate(c.date_debut)} → {fmtDate(c.date_fin)}
                                                        <span className="ml-1 text-gray-300 dark:text-white/20">({nbJours(c.date_debut, c.date_fin)}j)</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <StatutConge s={c.statut} />
                                        </div>
                                        {c.motif && <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{c.motif}</p>}
                                        {c.commentaire_admin && (
                                            <div className={`mt-2 p-2.5 rounded-xl text-xs ${c.statut === 'approuve' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                                                <span className="font-semibold">Admin : </span>{c.commentaire_admin}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── Tab: Incidents ───────────────────────────────────────────────────────────

function IncidentsTab({ incidents, onDeclare }: { incidents: HseIncident[]; onDeclare: () => void }) {
    return (
        <div className="px-4 pt-6 pb-4 space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider">{incidents.length} incident(s)</p>
                <button onClick={onDeclare}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                    <AlertTriangle size={12} /> Déclarer
                </button>
            </div>

            {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-3">
                        <CheckCircle2 size={28} className="text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <p className="text-gray-500 dark:text-white/60 font-medium">Aucun incident déclaré</p>
                    <p className="text-sm text-gray-400 dark:text-white/30 mt-1">Continuez à conduire en sécurité !</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {incidents.map(inc => {
                        const t = INCIDENT_TYPES.find(x => x.value === inc.type);
                        return (
                            <div key={inc.id} className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] p-4">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t?.color ?? '#999'}15` }}>
                                            <AlertTriangle size={14} style={{ color: t?.color ?? '#999' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t?.label ?? inc.type}</p>
                                            <p className="text-xs text-gray-400 dark:text-white/30">{fmtDate(inc.date_incident)}{inc.lieu ? ` · ${inc.lieu}` : ''}</p>
                                        </div>
                                    </div>
                                    <StatutIncident s={inc.statut} />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed line-clamp-2">{inc.description}</p>
                                {inc.statut !== 'clos' && (
                                    <button onClick={() => router.patch(`/chauffeur/incidents/${inc.id}/statut`, {}, { preserveScroll: true })}
                                        className={`mt-3 w-full h-9 rounded-xl text-xs font-semibold border transition-all ${inc.statut === 'ouvert' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400'}`}>
                                        {inc.statut === 'ouvert' ? 'Prendre en charge' : 'Clôturer'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ─── Tab: Profil ──────────────────────────────────────────────────────────────

function ProfilTab({ chauffeur, documents }: { chauffeur: Chauffeur; documents: HseDoc[] }) {
    const { appearance, updateAppearance } = useAppearance();

    const themeOptions = [
        { value: 'light'  as const, icon: Sun,     label: 'Clair' },
        { value: 'dark'   as const, icon: Moon,    label: 'Sombre' },
        { value: 'system' as const, icon: Monitor, label: 'Système' },
    ];

    const InfoRow = ({ label, value }: { label: string; value: string | null }) =>
        value ? (
            <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-white/[0.06] last:border-0">
                <span className="text-xs text-gray-400 dark:text-white/40">{label}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
            </div>
        ) : null;

    return (
        <div className="px-4 pt-6 pb-6 space-y-5">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {initials(chauffeur.prenom, chauffeur.nom)}
                </div>
                <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{chauffeur.prenom} {chauffeur.nom}</p>
                    <p className="text-sm text-gray-400 dark:text-white/40">{chauffeur.user?.email}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${chauffeur.statut === 'en mission' ? 'bg-blue-500 animate-pulse' : chauffeur.statut === 'disponible' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span className="text-xs text-gray-500 dark:text-white/40 capitalize">{chauffeur.statut}</span>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] px-4 py-1">
                <InfoRow label="Téléphone"  value={chauffeur.telephone} />
                <InfoRow label="Email"       value={chauffeur.email} />
                <InfoRow label="N° permis"   value={chauffeur.permis} />
                {chauffeur.notes && <InfoRow label="Notes" value={chauffeur.notes} />}
            </div>

            {/* Documents */}
            <div>
                <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2.5">Mes documents ({documents.length})</p>
                {documents.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] p-5 text-center">
                        <FileText size={22} className="mx-auto text-gray-300 dark:text-white/15 mb-1.5" />
                        <p className="text-sm text-gray-400 dark:text-white/40">Aucun document enregistré</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {documents.map(doc => (
                            <div key={doc.id} className={`rounded-2xl p-3.5 border flex items-center gap-3 ${doc.statut === 'expire' ? 'bg-red-50 border-red-200 dark:bg-red-500/8 dark:border-red-500/20' : doc.statut === 'expire_bientot' ? 'bg-amber-50 border-amber-200 dark:bg-amber-500/8 dark:border-amber-500/20' : 'bg-white dark:bg-white/[0.04] border-gray-100 dark:border-white/[0.08]'}`}>
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${doc.statut === 'expire' ? 'bg-red-100 dark:bg-red-500/15' : doc.statut === 'expire_bientot' ? 'bg-amber-100 dark:bg-amber-500/15' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                                    {doc.statut === 'expire' ? <XCircle size={16} className="text-red-500 dark:text-red-400" />
                                     : doc.statut === 'expire_bientot' ? <Clock size={16} className="text-amber-500 dark:text-amber-400" />
                                     : <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{DOC_LABELS[doc.type] ?? doc.type}</p>
                                    {doc.organisme && <p className="text-xs text-gray-400 dark:text-white/30">{doc.organisme}</p>}
                                </div>
                                <div className="text-right shrink-0">
                                    {doc.statut === 'expire'         && <p className="text-xs font-bold text-red-600 dark:text-red-400">Expiré</p>}
                                    {doc.statut === 'expire_bientot' && <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{doc.jours_restants}j</p>}
                                    {doc.statut === 'valide'         && <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Valide</p>}
                                    {doc.date_expiration && <p className="text-[10px] text-gray-400 dark:text-white/20 mt-0.5">{fmtDate(doc.date_expiration)}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Paramètres */}
            <div>
                <p className="text-xs font-bold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2.5">Paramètres</p>
                <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.08] overflow-hidden">
                    {/* Theme */}
                    <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
                        <p className="text-xs text-gray-400 dark:text-white/40 mb-2.5">Thème</p>
                        <div className="flex gap-2">
                            {themeOptions.map(opt => {
                                const Icon = opt.icon;
                                const active = appearance === opt.value;
                                return (
                                    <button key={opt.value} onClick={() => updateAppearance(opt.value)}
                                        className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${active ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40'}`}>
                                        <Icon size={15} />
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Change password */}
                    <button onClick={() => router.get('/chauffeur/password')}
                        className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06] active:bg-gray-50 dark:active:bg-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                <Lock size={14} className="text-gray-500 dark:text-white/50" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Changer mon mot de passe</span>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 dark:text-white/20" />
                    </button>

                    {/* Logout */}
                    <button onClick={() => router.post('/logout')}
                        className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-red-50 dark:active:bg-red-500/5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                            <LogOut size={14} className="text-red-500 dark:text-red-400" />
                        </div>
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">Se déconnecter</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'accueil' | 'voyage' | 'missions' | 'incidents' | 'profil';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'accueil',   label: 'Accueil',   icon: Home          },
    { id: 'voyage',    label: 'Voyage',    icon: Truck         },
    { id: 'missions',  label: 'Missions',  icon: CalendarDays  },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'profil',    label: 'Profil',    icon: User          },
];

export default function ChauffeurDashboard({
    chauffeur, activeExpedition, agenda, pastExpeditions, incidents, documents, conges, notifications, stats,
}: Props) {
    const [activeTab, setActiveTab]                   = useState<Tab>('accueil');
    const [showIncidentModal, setShowIncidentModal]   = useState(false);
    const [showCongeModal, setShowCongeModal]         = useState(false);
    const [showNotifModal, setShowNotifModal]         = useState(false);

    const openNotifModal = () => {
        setShowNotifModal(true);
        if (stats.notifications_non_lues > 0) {
            router.patch('/chauffeur/notifications/lues', {}, { preserveScroll: true });
        }
    };

    const incidentsBadge = stats.incidents_ouverts;
    const docsBadge      = stats.docs_expires + stats.docs_expire_bientot;

    return (
        <>
            <Head title="Mon espace" />

            <AnimatePresence>
                {showIncidentModal && (
                    <IncidentModal onClose={() => setShowIncidentModal(false)} expedition={activeExpedition} />
                )}
                {showCongeModal && (
                    <CongeModal onClose={() => setShowCongeModal(false)} />
                )}
                {showNotifModal && (
                    <NotificationsModal notifications={notifications} onClose={() => setShowNotifModal(false)} />
                )}
            </AnimatePresence>

            <div className="flex flex-col bg-gray-50 dark:bg-[#060d1a]"
                style={{ height: '100dvh', maxWidth: 430, margin: '0 auto' }}>

                {/* Top bar */}
                <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-white/[0.05] bg-white/80 dark:bg-[#060d1a]/80 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
                            <Zap size={12} className="text-white" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 dark:text-white/40 tracking-widest uppercase">Logistech</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {(stats.docs_expires > 0 || stats.incidents_ouverts > 0) && (
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                        <button onClick={openNotifModal}
                            className="relative w-8 h-8 rounded-full bg-gray-100 dark:bg-white/8 flex items-center justify-center">
                            <Bell size={15} className="text-gray-500 dark:text-white/50" />
                            {stats.notifications_non_lues > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center">
                                    {stats.notifications_non_lues > 9 ? '9+' : stats.notifications_non_lues}
                                </span>
                            )}
                        </button>
                        <div className="w-7 h-7 rounded-full bg-linear-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {initials(chauffeur.prenom, chauffeur.nom)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab}
                            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }}>
                            {activeTab === 'accueil'   && <AccueilTab chauffeur={chauffeur} activeExpedition={activeExpedition} stats={stats} documents={documents} incidents={incidents} onDeclareIncident={() => setShowIncidentModal(true)} onTabChange={setActiveTab} />}
                            {activeTab === 'voyage'    && <VoyageTab expedition={activeExpedition} onDeclareIncident={() => setShowIncidentModal(true)} />}
                            {activeTab === 'missions'  && <MissionsTab agenda={agenda} pastExpeditions={pastExpeditions} conges={conges} onRequestConge={() => setShowCongeModal(true)} />}
                            {activeTab === 'incidents' && <IncidentsTab incidents={incidents} onDeclare={() => setShowIncidentModal(true)} />}
                            {activeTab === 'profil'    && <ProfilTab chauffeur={chauffeur} documents={documents} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom nav */}
                <nav className="shrink-0 border-t border-gray-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#060d1a]/95 backdrop-blur-xl"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
                    <div className="flex items-stretch">
                        {TABS.map(tab => {
                            const Icon    = tab.icon;
                            const isActive = activeTab === tab.id;
                            const badge   = tab.id === 'incidents' ? incidentsBadge
                                          : tab.id === 'profil'    ? docsBadge
                                          : tab.id === 'missions'  ? stats.conges_en_attente : 0;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 relative transition-colors ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-white/30'}`}>
                                    {isActive && (
                                        <motion.div layoutId="nav-pill"
                                            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-emerald-500"
                                            transition={{ type: 'spring', stiffness: 400, damping: 28 }} />
                                    )}
                                    <div className="relative">
                                        <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                                        {badge > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                                                {badge > 9 ? '9+' : badge}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
