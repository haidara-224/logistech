import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck, FileText, Truck, Users, AlertTriangle,
    CheckCircle2, Clock, XCircle, Plus, Trash2, Edit2,
    ChevronDown, ChevronUp, FileUp, ExternalLink, Activity,
    BarChart3, X, Check, Fuel, Siren, Navigation, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Chauffeur { id: number; nom: string; prenom: string }
interface Camion    { id: number; immatriculation: string; marque: string }
interface Expedition { id: number; reference: string; date_depart: string }

interface HseDoc {
    id: number; type: string; numero: string | null;
    date_emission: string | null; date_expiration: string | null;
    organisme: string | null; document_path: string | null;
    notes: string | null; statut: 'valide' | 'expire_bientot' | 'expire';
    jours_restants: number | null;
    chauffeur?: Chauffeur; camion?: Camion;
    chauffeur_id?: number; camion_id?: number;
}

interface HseIncident {
    id: number; type: string; date_incident: string; lieu: string | null;
    description: string; blesses: boolean; nb_blesses: number;
    dommages_vehicule: boolean; cout_estime: number | null;
    pv_numero: string | null; causes: string[] | null;
    actions_correctives: string | null; num_declaration_assurance: string | null;
    statut: 'ouvert' | 'en_investigation' | 'clos';
    chauffeur_id: number | null; camion_id: number | null; expedition_id: number | null;
    chauffeur?: Chauffeur; camion?: Camion; expedition?: Expedition;
}

interface InspectionPredepart {
    id: number; chauffeur_id: number; camion_id: number | null; expedition_id: number | null;
    freins: boolean; pneus: boolean; feux: boolean; cargaison: boolean;
    extincteur: boolean; trousse_secours: boolean; documents_bord: boolean; niveaux_fluides: boolean;
    observations: string | null; created_at: string;
    chauffeur?: Chauffeur; camion?: Camion; expedition?: Expedition;
}

interface RapportCarburant {
    id: number; chauffeur_id: number; camion_id: number | null; expedition_id: number | null;
    litres: string; cout: string | null; station: string | null; km_compteur: number | null;
    created_at: string;
    chauffeur?: Chauffeur; camion?: Camion;
}

interface SosAlert {
    id: number; type: string; message: string;
    data: { chauffeur_id?: number; latitude?: number; longitude?: number; message?: string };
    read_at: string | null; created_at: string;
}

interface Stats {
    docs_expires: number; docs_expire_bientot: number; docs_valides: number;
    incidents_ouverts: number; incidents_total: number; accidents_30j: number;
    inspections_total: number; litres_total: number; co2_total: number; sos_non_lus: number;
}

interface Props {
    chauffeurDocs: HseDoc[]; camionDocs: HseDoc[];
    incidents: HseIncident[]; chauffeurs: Chauffeur[];
    camions: Camion[]; expeditions: Expedition[]; stats: Stats;
    inspections: InspectionPredepart[];
    rapportsCarburant: RapportCarburant[];
    sosAlerts: SosAlert[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CHAUFFEUR_DOC_TYPES = [
    { value: 'permis_conduire',      label: 'Permis de conduire' },
    { value: 'certificat_medical',   label: 'Certificat médical' },
    { value: 'carte_professionnelle', label: 'Carte pro. CEDEAO' },
    { value: 'formation_securite',   label: 'Formation sécurité' },
];

const CAMION_DOC_TYPES = [
    { value: 'carte_grise',            label: 'Carte grise' },
    { value: 'assurance',              label: 'Assurance' },
    { value: 'visite_technique',       label: 'Visite technique' },
    { value: 'vignette',               label: 'Vignette' },
    { value: 'carte_brune_cedeao',     label: 'Carte Brune CEDEAO' },
    { value: 'autorisation_transport', label: 'Autorisation transport' },
];

const INCIDENT_TYPES = [
    { value: 'accident',        label: 'Accident',           color: '#EF4444' },
    { value: 'panne',           label: 'Panne',              color: '#F97316' },
    { value: 'vol',             label: 'Vol',                color: '#8B5CF6' },
    { value: 'dommage_cargo',   label: 'Dommage cargo',      color: '#F59E0B' },
    { value: 'presqu_accident', label: 'Presque-accident',   color: '#06B6D4' },
    { value: 'blessure',        label: 'Blessure',           color: '#EC4899' },
];

const CAUSES_OPTIONS = [
    { value: 'vitesse',              label: 'Excès de vitesse' },
    { value: 'fatigue',              label: 'Fatigue conducteur' },
    { value: 'etat_route',           label: 'État de la route' },
    { value: 'defaillance_mecanique', label: 'Défaillance mécanique' },
    { value: 'meteo',                label: 'Conditions météo' },
    { value: 'animaux',              label: 'Animaux sur route' },
    { value: 'autre_conducteur',     label: 'Autre conducteur' },
    { value: 'chargement',           label: 'Problème chargement' },
    { value: 'autre',                label: 'Autre' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statutBadge(statut: HseDoc['statut'], jours: number | null) {
    if (statut === 'expire') {
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 text-[11px] font-semibold"><XCircle size={10} />Expiré</span>;
    }
    if (statut === 'expire_bientot') {
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 text-[11px] font-semibold"><Clock size={10} />{jours !== null ? `${jours}j` : 'Bientôt'}</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 text-[11px] font-semibold"><CheckCircle2 size={10} />Valide</span>;
}

function incidentStatutBadge(statut: HseIncident['statut']) {
    const map = {
        ouvert:           { label: 'Ouvert',           cls: 'bg-red-100 text-red-600 dark:bg-red-500/10' },
        en_investigation: { label: 'En investigation', cls: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10' },
        clos:             { label: 'Clos',             cls: 'bg-gray-100 text-gray-500 dark:bg-white/10' },
    };
    const s = map[statut];
    return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}>{s.label}</span>;
}

const typeLabel = (types: { value: string; label: string }[], v: string) =>
    types.find(t => t.value === v)?.label ?? v;

const CSRF = () => {
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
};

// ─── Document Form ────────────────────────────────────────────────────────────

function DocForm({
    types, onSubmit, onCancel, loading, initial,
}: {
    types: { value: string; label: string }[];
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
    loading: boolean;
    initial?: Partial<HseDoc>;
}) {
    const [form, setForm] = useState({
        type:            initial?.type            ?? types[0].value,
        numero:          initial?.numero          ?? '',
        date_emission:   initial?.date_emission   ?? '',
        date_expiration: initial?.date_expiration ?? '',
        organisme:       initial?.organisme       ?? '',
        notes:           initial?.notes           ?? '',
    });
    const [file, setFile] = useState<File | null>(null);

    const submit = () => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        if (file) fd.append('document', file);
        onSubmit(fd);
    };

    return (
        <div className="space-y-4 p-5 rounded-xl border border-[#C8962E]/20 bg-amber-50/30 dark:bg-amber-500/5">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label className="text-xs">Type *</Label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                        className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                        {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>
                <div>
                    <Label className="text-xs">Numéro</Label>
                    <Input value={form.numero} onChange={e => setForm(p => ({ ...p, numero: e.target.value }))} className="mt-1 h-9 text-sm" placeholder="N° du document" />
                </div>
                <div>
                    <Label className="text-xs">Date d'émission</Label>
                    <Input type="date" value={form.date_emission} onChange={e => setForm(p => ({ ...p, date_emission: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                    <Label className="text-xs">Date d'expiration</Label>
                    <Input type="date" value={form.date_expiration} onChange={e => setForm(p => ({ ...p, date_expiration: e.target.value }))} className="mt-1 h-9 text-sm" />
                </div>
                <div>
                    <Label className="text-xs">Organisme / Émetteur</Label>
                    <Input value={form.organisme} onChange={e => setForm(p => ({ ...p, organisme: e.target.value }))} className="mt-1 h-9 text-sm" placeholder="ex: Ministère des Transports" />
                </div>
                <div>
                    <Label className="text-xs">Document (PDF/image)</Label>
                    <div className="mt-1">
                        {file
                            ? <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 text-xs text-emerald-700">
                                <FileUp size={12} />{file.name}
                                <button onClick={() => setFile(null)} className="ml-auto"><X size={12} /></button>
                              </div>
                            : <label className="flex items-center gap-2 h-9 px-3 rounded-md border border-dashed border-gray-300 dark:border-white/20 bg-white dark:bg-transparent text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5">
                                <FileUp size={12} /> Joindre un fichier
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
                              </label>}
                    </div>
                </div>
            </div>
            <div>
                <Label className="text-xs">Notes</Label>
                <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="mt-1 h-9 text-sm" placeholder="Observations..." />
            </div>
            <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={onCancel}>Annuler</Button>
                <Button size="sm" onClick={submit} disabled={loading}
                    className="bg-[#C8962E] hover:bg-[#b8861e] text-white gap-2">
                    <Check size={13} />{loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
            </div>
        </div>
    );
}

// ─── Entity Documents Panel ───────────────────────────────────────────────────

function EntityDocPanel({
    label, docs, docTypes, storeUrl, entity,
}: {
    label: string;
    docs: HseDoc[];
    docTypes: { value: string; label: string }[];
    storeUrl: string;
    entity: string;
}) {
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const expiredCount  = docs.filter(d => d.statut === 'expire').length;
    const soonCount     = docs.filter(d => d.statut === 'expire_bientot').length;

    const submit = (fd: FormData, url: string, method = 'POST') => {
        setLoading(true);
        fetch(url, { method, body: fd, headers: { 'X-XSRF-TOKEN': CSRF() } })
            .then(() => { router.reload({ only: ['chauffeurDocs', 'camionDocs', 'stats'] }); setShowForm(false); setEditId(null); })
            .finally(() => setLoading(false));
    };

    const destroy = (id: number, url: string) => {
        router.delete(url, { preserveScroll: true });
    };

    return (
        <div className={`rounded-xl border overflow-hidden ${expiredCount > 0 ? 'border-red-200 dark:border-red-500/20' : soonCount > 0 ? 'border-amber-200 dark:border-amber-500/20' : 'border-gray-200 dark:border-white/10'} bg-white dark:bg-white/5`}>
            <button onClick={() => setOpen(v => !v)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{label}</span>
                    <span className="text-xs text-gray-400">{docs.length} doc{docs.length > 1 ? 's' : ''}</span>
                    {expiredCount > 0 && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 text-[10px] font-bold">{expiredCount} expiré{expiredCount > 1 ? 's' : ''}</span>}
                    {soonCount > 0 && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 text-[10px] font-bold">{soonCount} bientôt</span>}
                </div>
                {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-gray-100 dark:border-white/5">
                        <div className="px-5 pt-4 pb-5 space-y-3">

                            {docs.length === 0 && !showForm && (
                                <p className="text-xs text-gray-400 py-2 text-center">Aucun document enregistré.</p>
                            )}

                            {docs.map(doc => (
                                <div key={doc.id} className="rounded-lg border border-gray-100 dark:border-white/10 p-3 space-y-2">
                                    {editId === doc.id
                                        ? <DocForm types={docTypes} loading={loading} initial={doc}
                                            onCancel={() => setEditId(null)}
                                            onSubmit={fd => { fd.append('_method', 'POST'); submit(fd, `/dashboard/hse/${entity}-documents/${doc.id}`); }} />
                                        : <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{typeLabel(docTypes, doc.type)}</span>
                                                    {statutBadge(doc.statut, doc.jours_restants)}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40 flex-wrap">
                                                    {doc.numero && <span>N° {doc.numero}</span>}
                                                    {doc.organisme && <span>{doc.organisme}</span>}
                                                    {doc.date_expiration && <span>Exp. {new Date(doc.date_expiration).toLocaleDateString('fr-FR')}</span>}
                                                </div>
                                                {doc.notes && <p className="text-xs text-gray-400 italic">{doc.notes}</p>}
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {doc.document_path && (
                                                    <a href={doc.document_path} target="_blank" rel="noreferrer"
                                                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10">
                                                        <ExternalLink size={12} className="text-gray-400" />
                                                    </a>
                                                )}
                                                <button onClick={() => setEditId(doc.id)}
                                                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10">
                                                    <Edit2 size={12} className="text-gray-400" />
                                                </button>
                                                <button onClick={() => destroy(doc.id, `/dashboard/hse/${entity}-documents/${doc.id}`)}
                                                    className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10">
                                                    <Trash2 size={12} className="text-red-400" />
                                                </button>
                                            </div>
                                          </div>}
                                </div>
                            ))}

                            {showForm
                                ? <DocForm types={docTypes} loading={loading} onCancel={() => setShowForm(false)}
                                    onSubmit={fd => submit(fd, storeUrl)} />
                                : <button onClick={() => setShowForm(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-xs text-gray-400 hover:text-[#C8962E] hover:border-[#C8962E]/40 transition-all">
                                    <Plus size={12} />Ajouter un document
                                  </button>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Incident Form ────────────────────────────────────────────────────────────

function toDatetimeLocal(v: string | null | undefined): string {
    if (!v) return new Date().toISOString().slice(0, 16);
    return v.slice(0, 16).replace(' ', 'T');
}

function IncidentForm({ chauffeurs, camions, expeditions, incident, onClose }: {
    chauffeurs: Chauffeur[]; camions: Camion[];
    expeditions: Expedition[]; incident?: HseIncident; onClose: () => void;
}) {
    const isEdit = !!incident;

    const form = useForm({
        type:                     incident?.type                               ?? 'accident',
        chauffeur_id:             incident?.chauffeur_id?.toString()           ?? '',
        camion_id:                incident?.camion_id?.toString()              ?? '',
        expedition_id:            incident?.expedition_id?.toString()           ?? '',
        date_incident:            toDatetimeLocal(incident?.date_incident),
        lieu:                     incident?.lieu                               ?? '',
        description:              incident?.description                        ?? '',
        blesses:                  incident?.blesses                            ?? false,
        nb_blesses:               incident?.nb_blesses                        ?? 0,
        dommages_vehicule:        incident?.dommages_vehicule                  ?? false,
        cout_estime:              incident?.cout_estime?.toString()            ?? '',
        pv_numero:                incident?.pv_numero                          ?? '',
        causes:                   (incident?.causes ?? []) as string[],
        actions_correctives:      incident?.actions_correctives                ?? '',
        num_declaration_assurance: incident?.num_declaration_assurance         ?? '',
        statut:                   incident?.statut                             ?? 'ouvert',
    });

    const toggleCause = (v: string) => {
        const arr = form.data.causes.includes(v)
            ? form.data.causes.filter(c => c !== v)
            : [...form.data.causes, v];
        form.setData('causes', arr);
    };

    const submit = () => {
        if (isEdit) {
            form.put(`/dashboard/hse/incidents/${incident!.id}`, {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        } else {
            form.post('/dashboard/hse/incidents', {
                preserveScroll: true,
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0d1828] shadow-2xl border border-gray-200 dark:border-white/10">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-[#0d1828]">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        {isEdit ? 'Modifier l\'incident' : 'Déclarer un incident'}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center">
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">Type d'incident *</Label>
                            <select value={form.data.type} onChange={e => form.setData('type', e.target.value)}
                                className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                                {INCIDENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Statut</Label>
                            <select value={form.data.statut} onChange={e => form.setData('statut', e.target.value as any)}
                                className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                                <option value="ouvert">Ouvert</option>
                                <option value="en_investigation">En investigation</option>
                                <option value="clos">Clos</option>
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Date & heure *</Label>
                            <Input type="datetime-local" value={form.data.date_incident}
                                onChange={e => form.setData('date_incident', e.target.value)} className="mt-1 h-9 text-sm" />
                        </div>
                        <div>
                            <Label className="text-xs">Lieu</Label>
                            <Input value={form.data.lieu} onChange={e => form.setData('lieu', e.target.value)}
                                className="mt-1 h-9 text-sm" placeholder="Route Conakry-Coyah, km 45" />
                        </div>
                        <div>
                            <Label className="text-xs">Chauffeur</Label>
                            <select value={form.data.chauffeur_id} onChange={e => form.setData('chauffeur_id', e.target.value)}
                                className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                                <option value="">— Aucun —</option>
                                {chauffeurs.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label className="text-xs">Véhicule</Label>
                            <select value={form.data.camion_id} onChange={e => form.setData('camion_id', e.target.value)}
                                className="mt-1 w-full h-9 rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent px-3 text-sm text-gray-900 dark:text-white">
                                <option value="">— Aucun —</option>
                                {camions.map(c => <option key={c.id} value={c.id}>{c.immatriculation} — {c.marque}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs">Description *</Label>
                        <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white min-h-[80px] resize-y" placeholder="Décrivez les circonstances de l'incident..." />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="blesses" checked={form.data.blesses}
                                onChange={e => form.setData('blesses', e.target.checked)} className="w-4 h-4 accent-[#C8962E]" />
                            <Label htmlFor="blesses" className="text-sm cursor-pointer">Blessés</Label>
                            {form.data.blesses && (
                                <Input type="number" min={0} max={99} value={form.data.nb_blesses}
                                    onChange={e => form.setData('nb_blesses', parseInt(e.target.value) || 0)}
                                    className="w-16 h-8 text-sm" />
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="dommages" checked={form.data.dommages_vehicule}
                                onChange={e => form.setData('dommages_vehicule', e.target.checked)} className="w-4 h-4 accent-[#C8962E]" />
                            <Label htmlFor="dommages" className="text-sm cursor-pointer">Dommages véhicule</Label>
                        </div>
                        <div>
                            <Label className="text-xs">Coût estimé (GNF)</Label>
                            <Input type="number" value={form.data.cout_estime} onChange={e => form.setData('cout_estime', e.target.value)}
                                className="mt-1 h-8 text-sm" placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs mb-2 block">Causes identifiées</Label>
                        <div className="flex flex-wrap gap-2">
                            {CAUSES_OPTIONS.map(c => {
                                const active = form.data.causes.includes(c.value);
                                return (
                                    <button key={c.value} onClick={() => toggleCause(c.value)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${active ? 'bg-[#C8962E] border-[#C8962E] text-white' : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:border-[#C8962E]/40'}`}>
                                        {c.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs">N° PV gendarmerie/police</Label>
                            <Input value={form.data.pv_numero} onChange={e => form.setData('pv_numero', e.target.value)}
                                className="mt-1 h-9 text-sm" placeholder="PV-2026-XXXX" />
                        </div>
                        <div>
                            <Label className="text-xs">N° déclaration assurance</Label>
                            <Input value={form.data.num_declaration_assurance} onChange={e => form.setData('num_declaration_assurance', e.target.value)}
                                className="mt-1 h-9 text-sm" placeholder="ASS-XXXX" />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs">Actions correctives</Label>
                        <textarea value={form.data.actions_correctives} onChange={e => form.setData('actions_correctives', e.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-200 dark:border-white/10 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white min-h-[60px] resize-y" placeholder="Mesures prises pour éviter la récurrence..." />
                    </div>
                </div>

                <div className="sticky bottom-0 flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#0d1828]">
                    <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
                    <Button size="sm" onClick={submit} disabled={form.processing}
                        className={`${isEdit ? 'bg-[#C8962E] hover:bg-[#b8861e]' : 'bg-red-500 hover:bg-red-600'} text-white gap-2`}>
                        {isEdit ? <Check size={13} /> : <AlertTriangle size={13} />}
                        {form.processing ? 'Enregistrement...' : isEdit ? 'Enregistrer les modifications' : 'Déclarer l\'incident'}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'dashboard',   label: 'Vue globale',         icon: BarChart3,    badge: null as null | number },
    { id: 'chauffeurs',  label: 'Documents chauffeurs', icon: Users,        badge: null },
    { id: 'camions',     label: 'Documents véhicules',  icon: Truck,        badge: null },
    { id: 'incidents',   label: 'Incidents',            icon: AlertTriangle,badge: null },
    { id: 'inspections', label: 'Inspections',          icon: CheckCircle2, badge: null },
    { id: 'carburant',   label: 'Carburant',            icon: Fuel,         badge: null },
    { id: 'sos',         label: 'SOS',                  icon: Siren,        badge: null },
];

export default function HseIndex({ chauffeurDocs, camionDocs, incidents, chauffeurs, camions, expeditions, stats, inspections, rapportsCarburant, sosAlerts }: Props) {
    const initialTab = new URLSearchParams(window.location.search).get('tab') ?? 'dashboard';
    const [activeTab, setActiveTab]             = useState(initialTab);
    const [showIncidentForm, setShowIncidentForm] = useState(false);
    const [editIncident, setEditIncident]       = useState<HseIncident | null>(null);

    const chauffeurGroups = chauffeurs.map(c => ({
        ...c,
        docs: chauffeurDocs.filter(d => d.chauffeur_id === c.id),
    }));

    const camionGroups = camions.map(c => ({
        ...c,
        docs: camionDocs.filter(d => d.camion_id === c.id),
    }));

    return (
        <>
            <Head title="HSE" />
            {showIncidentForm && (
                <IncidentForm chauffeurs={chauffeurs} camions={camions} expeditions={expeditions} onClose={() => setShowIncidentForm(false)} />
            )}
            {editIncident && (
                <IncidentForm chauffeurs={chauffeurs} camions={camions} expeditions={expeditions} incident={editIncident} onClose={() => setEditIncident(null)} />
            )}

            <div className="min-h-screen bg-background text-foreground">

                {/* Header */}
                <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-400 mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-lg">
                                <ShieldCheck size={16} className="text-white" />
                            </div>
                            <span className="text-sm font-semibold tracking-tight">HSE — Hygiène, Sécurité & Environnement</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Activity size={14} className="text-emerald-500" />
                            <span className={stats.docs_expires > 0 ? 'text-red-500 font-semibold' : ''}>
                                {stats.docs_expires > 0 ? `${stats.docs_expires} document(s) expiré(s)` : 'Système opérationnel'}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="max-w-400 mx-auto px-6 py-8">

                    {/* Title */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                            Gestion <span className="text-muted-foreground/50">HSE</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">Conformité documentaire, suivi véhicules & déclaration d'incidents.</p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex flex-wrap items-center gap-1 mb-8 p-1 bg-muted/40 rounded-2xl w-fit border border-border">
                        {TABS.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const badge = tab.id === 'incidents' ? (stats.incidents_ouverts > 0 ? stats.incidents_ouverts : 0)
                                        : tab.id === 'sos'       ? (stats.sos_non_lus > 0 ? stats.sos_non_lus : 0)
                                        : 0;
                            const isSos = tab.id === 'sos';
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer"
                                    style={{ color: isActive ? (isSos ? '#dc2626' : 'var(--foreground)') : (isSos ? '#ef4444' : 'var(--muted-foreground)') }}>
                                    {isActive && (
                                        <motion.div layoutId="hse-tab-pill"
                                            className={`absolute inset-0 rounded-xl ${isSos ? 'bg-red-50 dark:bg-red-500/10' : 'bg-secondary'}`}
                                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />
                                    )}
                                    <Icon size={14} />
                                    <span className="relative">{tab.label}</span>
                                    {badge > 0 && (
                                        <span className="relative flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold">{badge}</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Dashboard ── */}
                    {activeTab === 'dashboard' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { label: 'Documents valides',     value: stats.docs_valides,        icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                    { label: 'Expirent dans 30j',     value: stats.docs_expire_bientot, icon: Clock,        color: 'text-amber-500',   bg: 'bg-amber-500/10'  },
                                    { label: 'Documents expirés',      value: stats.docs_expires,        icon: XCircle,      color: 'text-red-500',     bg: 'bg-red-500/10'    },
                                    { label: 'Incidents ouverts',      value: stats.incidents_ouverts,   icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-500/10'    },
                                    { label: 'Total incidents',        value: stats.incidents_total,     icon: FileText,     color: 'text-blue-500',    bg: 'bg-blue-500/10'   },
                                    { label: 'Accidents (30 derniers j)', value: stats.accidents_30j,   icon: ShieldCheck,  color: 'text-purple-500',  bg: 'bg-purple-500/10' },
                                    { label: 'Inspections réalisées',  value: stats.inspections_total,  icon: CheckCircle2, color: 'text-blue-500',    bg: 'bg-blue-500/10'   },
                                    { label: 'Litres consommés',       value: `${stats.litres_total.toLocaleString('fr-FR')} L`, icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                    { label: 'CO₂ émis (estimé)',      value: `${stats.co2_total.toLocaleString('fr-FR')} kg`, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                                            <s.icon size={18} className={s.color} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Alertes */}
                            {(stats.docs_expires > 0 || stats.docs_expire_bientot > 0) && (
                                <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-5">
                                    <h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm mb-3 flex items-center gap-2">
                                        <AlertTriangle size={15} /> Alertes de conformité
                                    </h3>
                                    <div className="space-y-2">
                                        {[...chauffeurDocs, ...camionDocs]
                                            .filter(d => d.statut !== 'valide')
                                            .sort((a, b) => (a.jours_restants ?? -999) - (b.jours_restants ?? -999))
                                            .slice(0, 8)
                                            .map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-700 dark:text-white/70">
                                                        {doc.chauffeur ? `${doc.chauffeur.prenom} ${doc.chauffeur.nom}` : doc.camion?.immatriculation}
                                                        {' — '}
                                                        {typeLabel([...CHAUFFEUR_DOC_TYPES, ...CAMION_DOC_TYPES], doc.type)}
                                                    </span>
                                                    {statutBadge(doc.statut, doc.jours_restants)}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Incidents récents */}
                            {incidents.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-sm text-foreground mb-3">Incidents récents</h3>
                                    <div className="space-y-2">
                                        {incidents.slice(0, 5).map(inc => {
                                            const t = INCIDENT_TYPES.find(x => x.value === inc.type);
                                            return (
                                                <div key={inc.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t?.color ?? '#999' }} />
                                                        <span className="font-medium text-foreground">{t?.label ?? inc.type}</span>
                                                        {inc.lieu && <span className="text-muted-foreground text-xs">{inc.lieu}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">{new Date(inc.date_incident).toLocaleDateString('fr-FR')}</span>
                                                        {incidentStatutBadge(inc.statut)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Documents Chauffeurs ── */}
                    {activeTab === 'chauffeurs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {chauffeurGroups.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-12">Aucun chauffeur enregistré.</p>
                            )}
                            {chauffeurGroups.map(c => (
                                <EntityDocPanel key={c.id}
                                    label={`${c.prenom} ${c.nom}`}
                                    docs={c.docs}
                                    docTypes={CHAUFFEUR_DOC_TYPES}
                                    storeUrl={`/dashboard/hse/chauffeurs/${c.id}/documents`}
                                    entity="chauffeur"
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* ── Documents Véhicules ── */}
                    {activeTab === 'camions' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {camionGroups.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-12">Aucun véhicule enregistré.</p>
                            )}
                            {camionGroups.map(c => (
                                <EntityDocPanel key={c.id}
                                    label={`${c.immatriculation} — ${c.marque}`}
                                    docs={c.docs}
                                    docTypes={CAMION_DOC_TYPES}
                                    storeUrl={`/dashboard/hse/camions/${c.id}/documents`}
                                    entity="camion"
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* ── Incidents ── */}
                    {activeTab === 'incidents' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{incidents.length} incident(s) enregistré(s)</p>
                                <Button size="sm" onClick={() => setShowIncidentForm(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white gap-2">
                                    <Plus size={13} />Déclarer un incident
                                </Button>
                            </div>

                            {incidents.length === 0 && (
                                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                                    <ShieldCheck size={40} className="mx-auto text-emerald-400 mb-3" />
                                    <p className="text-muted-foreground">Aucun incident déclaré. Bonne route !</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                {incidents.map(inc => {
                                    const t = INCIDENT_TYPES.find(x => x.value === inc.type);
                                    return (
                                        <div key={inc.id} className="rounded-xl border border-border bg-card p-5">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                        style={{ background: `${t?.color ?? '#999'}18` }}>
                                                        <AlertTriangle size={14} style={{ color: t?.color ?? '#999' }} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-foreground">{t?.label ?? inc.type}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(inc.date_incident).toLocaleString('fr-FR')}
                                                            {inc.lieu && ` — ${inc.lieu}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {incidentStatutBadge(inc.statut)}
                                                    {inc.statut !== 'clos' && (
                                                        <button
                                                            onClick={() => router.patch(`/dashboard/hse/incidents/${inc.id}/statut`, {}, { preserveScroll: true })}
                                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${inc.statut === 'ouvert' ? 'border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/30 dark:hover:bg-amber-500/20' : 'border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20'}`}>
                                                            <Check size={10} />
                                                            {inc.statut === 'ouvert' ? 'Prendre en charge' : 'Clôturer'}
                                                        </button>
                                                    )}
                                                    <button onClick={() => setEditIncident(inc)}
                                                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10">
                                                        <Edit2 size={12} className="text-gray-400" />
                                                    </button>
                                                    <button onClick={() => router.delete(`/dashboard/hse/incidents/${inc.id}`, { preserveScroll: true })}
                                                        className="w-7 h-7 rounded flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10">
                                                        <Trash2 size={12} className="text-red-400" />
                                                    </button>
                                                </div>
                                            </div>

                                            <p className="text-sm text-foreground/80 mb-3">{inc.description}</p>

                                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                {inc.chauffeur && <Badge variant="secondary">{inc.chauffeur.prenom} {inc.chauffeur.nom}</Badge>}
                                                {inc.camion && <Badge variant="secondary">{inc.camion.immatriculation}</Badge>}
                                                {inc.blesses && <Badge className="bg-red-100 text-red-600 dark:bg-red-500/10">{inc.nb_blesses} blessé(s)</Badge>}
                                                {inc.dommages_vehicule && <Badge className="bg-orange-100 text-orange-600 dark:bg-orange-500/10">Dommages véhicule</Badge>}
                                                {inc.cout_estime && <span>Coût estimé : {Number(inc.cout_estime).toLocaleString('fr-FR')} GNF</span>}
                                                {inc.causes && inc.causes.length > 0 && (
                                                    <span>Causes : {inc.causes.map(c => CAUSES_OPTIONS.find(o => o.value === c)?.label ?? c).join(', ')}</span>
                                                )}
                                            </div>

                                            {inc.actions_correctives && (
                                                <div className="mt-3 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                                                    <span className="font-semibold text-foreground">Actions correctives : </span>
                                                    {inc.actions_correctives}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Inspections pré-départ ── */}
                    {activeTab === 'inspections' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{inspections.length} inspection(s) enregistrée(s)</p>
                                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-500/20">
                                    {stats.inspections_total} total
                                </span>
                            </div>

                            {inspections.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                                    <CheckCircle2 size={40} className="mx-auto text-emerald-400 mb-3" />
                                    <p className="text-muted-foreground">Aucune inspection enregistrée.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {inspections.map(insp => {
                                        const items = [
                                            { key: 'freins', label: 'Freins', ok: insp.freins },
                                            { key: 'pneus', label: 'Pneus', ok: insp.pneus },
                                            { key: 'feux', label: 'Feux', ok: insp.feux },
                                            { key: 'cargaison', label: 'Cargaison', ok: insp.cargaison },
                                            { key: 'extincteur', label: 'Extincteur', ok: insp.extincteur },
                                            { key: 'trousse_secours', label: 'Trousse', ok: insp.trousse_secours },
                                            { key: 'documents_bord', label: 'Documents', ok: insp.documents_bord },
                                            { key: 'niveaux_fluides', label: 'Fluides', ok: insp.niveaux_fluides },
                                        ];
                                        const okCount = items.filter(i => i.ok).length;
                                        const allOk = okCount === items.length;
                                        return (
                                            <div key={insp.id} className="rounded-xl border border-border bg-card p-5">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div>
                                                        <p className="font-semibold text-sm text-foreground">
                                                            {insp.chauffeur ? `${insp.chauffeur.prenom} ${insp.chauffeur.nom}` : 'Chauffeur inconnu'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(insp.created_at).toLocaleString('fr-FR')}
                                                            {insp.camion && ` — ${insp.camion.immatriculation}`}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${allOk ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/10'}`}>
                                                        {okCount}/{items.length} OK
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {items.map(item => (
                                                        <span key={item.key} className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${item.ok ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-red-50 text-red-500 dark:bg-red-500/10'}`}>
                                                            {item.ok ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                                                            {item.label}
                                                        </span>
                                                    ))}
                                                </div>
                                                {insp.observations && (
                                                    <div className="mt-3 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
                                                        <span className="font-semibold text-foreground">Observations : </span>{insp.observations}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Rapports carburant ── */}
                    {activeTab === 'carburant' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {/* Summary cards */}
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Rapports', value: rapportsCarburant.length, icon: Fuel, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                    { label: 'Litres total', value: `${stats.litres_total.toLocaleString('fr-FR')} L`, icon: Fuel, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                    { label: 'CO₂ émis', value: `${stats.co2_total.toLocaleString('fr-FR')} kg`, icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                ].map(s => (
                                    <div key={s.label} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                                            <s.icon size={16} className={s.color} />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-foreground">{s.value}</p>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {rapportsCarburant.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                                    <Fuel size={40} className="mx-auto text-amber-400 mb-3" />
                                    <p className="text-muted-foreground">Aucun rapport carburant.</p>
                                </div>
                            ) : (
                                <div className="rounded-xl border border-border bg-card overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/30">
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Chauffeur</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Véhicule</th>
                                                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Station</th>
                                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Litres</th>
                                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Coût</th>
                                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">CO₂</th>
                                                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rapportsCarburant.map(r => (
                                                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                                                    <td className="px-4 py-3 font-medium text-foreground">
                                                        {r.chauffeur ? `${r.chauffeur.prenom} ${r.chauffeur.nom}` : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground">{r.camion?.immatriculation ?? '—'}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{r.station ?? '—'}</td>
                                                    <td className="px-4 py-3 text-right font-semibold text-amber-600">{parseFloat(r.litres).toLocaleString('fr-FR')} L</td>
                                                    <td className="px-4 py-3 text-right text-muted-foreground">{r.cout ? parseInt(r.cout).toLocaleString('fr-FR') : '—'}</td>
                                                    <td className="px-4 py-3 text-right text-emerald-600 text-xs">{(parseFloat(r.litres) * 2.67).toFixed(1)} kg</td>
                                                    <td className="px-4 py-3 text-right text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── SOS Alerts ── */}
                    {activeTab === 'sos' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{sosAlerts.length} alerte(s) SOS</p>
                                {stats.sos_non_lus > 0 && (
                                    <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-500/20">
                                        {stats.sos_non_lus} non lu(s)
                                    </span>
                                )}
                            </div>

                            {sosAlerts.length === 0 ? (
                                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                                    <Siren size={40} className="mx-auto text-gray-300 mb-3" />
                                    <p className="text-muted-foreground">Aucune alerte SOS reçue.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sosAlerts.map(sos => (
                                        <div key={sos.id} className={`rounded-xl border p-5 ${sos.read_at ? 'border-border bg-card' : 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5'}`}>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sos.read_at ? 'bg-gray-100 dark:bg-white/5' : 'bg-red-100 dark:bg-red-500/20 animate-pulse'}`}>
                                                        <Siren size={18} className={sos.read_at ? 'text-gray-400' : 'text-red-500'} />
                                                    </div>
                                                    <div>
                                                        <p className={`font-semibold text-sm ${sos.read_at ? 'text-foreground' : 'text-red-700 dark:text-red-400'}`}>
                                                            {sos.message}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {new Date(sos.created_at).toLocaleString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!sos.read_at && (
                                                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0">NOUVEAU</span>
                                                )}
                                            </div>
                                            {(sos.data?.latitude && sos.data?.longitude) && (
                                                <a href={`https://www.google.com/maps?q=${sos.data.latitude},${sos.data.longitude}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                                    <Navigation size={12} />
                                                    Voir la position GPS ({Number(sos.data.latitude).toFixed(5)}, {Number(sos.data.longitude).toFixed(5)})
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}
