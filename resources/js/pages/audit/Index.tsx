import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShieldAlert, Search, ChevronLeft, ChevronRight,
    Trash2, User, Clock, X, Plus, Pencil, RotateCcw,
    Filter, AlertTriangle, Package, FileDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditUser { id: number; name: string; email: string }
interface AuditLog {
    id: number;
    action: string;
    model_type: string;
    model_id: number | null;
    description: string;
    ip_address: string | null;
    created_at: string;
    user: AuditUser | null;
}

interface Props {
    logs: {
        data: AuditLog[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: { search: string; action: string; model: string };
    actions: string[];
    models: string[];
}

const ACTION_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    created:            { label: 'Création',              color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400', icon: Plus },
    updated:            { label: 'Modification',          color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',             icon: Pencil },
    deleted:            { label: 'Suppression',           color: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400',                 icon: Trash2 },
    restored:           { label: 'Restauration',          color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',         icon: RotateCcw },
    bulk_deleted:       { label: 'Suppression masse',     color: 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300',                 icon: AlertTriangle },
    force_deleted:      { label: 'Suppression définitive',color: 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300',                 icon: Trash2 },
    bulk_force_deleted: { label: 'Purge totale',          color: 'bg-red-300 dark:bg-red-900/60 text-red-900 dark:text-red-200',                 icon: AlertTriangle },
};

const MODEL_LABELS: Record<string, string> = {
    Produit:                'Produit',
    Commande:               'Commande',
    Client:                 'Client',
    Categorie:              'Catégorie',
    Facture:                'Facture',
    Paiement:               'Paiement',
    Devis:                  'Devis',
    Expedition:             'Expédition',
    Livraison:              'Livraison',
    Camion:                 'Camion',
    Chauffeur:              'Chauffeur',
    Mouvements_stock:       'Mouvement stock',
    Contact:                'Contact',
    NewsletterSubscription: 'Newsletter',
    User:                   'Utilisateur',
    Commande_item:          'Article commande',
    ImageProduit:           'Image produit',
};

const fmtDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const getModelShortName = (modelType: string) =>
    modelType.split('\\').pop() ?? modelType;

export default function AuditIndex({ logs, filters, actions, models }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState(filters.search ?? '');
    const [action, setAction] = useState(filters.action ?? '');
    const [model, setModel] = useState(filters.model ?? '');

    useEffect(() => {
        if (flash?.success) { toast.success(flash.success); }
        if (flash?.error) { toast.error(flash.error); }
    }, [flash]);

    const applyFilters = (overrides: Partial<{ search: string; action: string; model: string }>) => {
        const params = { search, action, model, ...overrides };
        router.get('/dashboard/audit', params, { preserveState: true, replace: true });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        applyFilters({ search: value });
    };

    const handleAction = (value: string) => {
        setAction(value);
        applyFilters({ action: value });
    };

    const handleModel = (value: string) => {
        setModel(value);
        applyFilters({ model: value });
    };

    const clearFilters = () => {
        setSearch(''); setAction(''); setModel('');
        router.get('/dashboard/audit', {}, { preserveState: true, replace: true });
    };

    const hasFilters = search || action || model;

    const openExport = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (action) params.set('action', action);
        if (model) params.set('model', model);
        const qs = params.toString();
        window.open(`/dashboard/audit/export${qs ? `?${qs}` : ''}`, '_blank');
    };

    const handlePage = (page: number) => {
        router.get('/dashboard/audit', { page, search, action, model }, { preserveState: true });
    };

    return (
        <>
            <Head title="Journal d'audit" />

            <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Journal d'audit</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Toutes les actions sur tous les modèles — visible super admin uniquement
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            {hasFilters && (
                                <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors">
                                    <X className="w-3.5 h-3.5" /> Réinitialiser
                                </button>
                            )}
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {logs.total} entrée{logs.total !== 1 ? 's' : ''}
                            </span>
                            <button
                                onClick={openExport}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8962E] text-white text-xs font-semibold hover:bg-[#b8841e] transition-colors shadow-sm"
                            >
                                <FileDown className="w-3.5 h-3.5" />
                                Rapport PDF
                            </button>
                        </div>
                    </motion.div>

                    {/* Filtres */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="flex flex-col sm:flex-row gap-3">
                        {/* Recherche */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher…"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 transition-all"
                            />
                            {search && (
                                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Filtre action */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={action}
                                onChange={(e) => handleAction(e.target.value)}
                                className="pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:border-red-400 focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="">Toutes les actions</option>
                                {actions.map((a) => (
                                    <option key={a} value={a}>{ACTION_CONFIG[a]?.label ?? a}</option>
                                ))}
                            </select>
                        </div>

                        {/* Filtre modèle */}
                        <div className="relative">
                            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            <select
                                value={model}
                                onChange={(e) => handleModel(e.target.value)}
                                className="pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:border-red-400 focus:outline-none appearance-none cursor-pointer min-w-[160px]"
                            >
                                <option value="">Tous les modèles</option>
                                {models.map((m) => (
                                    <option key={m} value={m}>{MODEL_LABELS[m] ?? m}</option>
                                ))}
                            </select>
                        </div>
                    </motion.div>

                    {/* Table */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">

                        {logs.data.length === 0 ? (
                            <div className="text-center py-20">
                                <ShieldAlert className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                                <p className="text-sm text-gray-400">Aucune entrée dans le journal</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Modèle</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {logs.data.map((log, i) => {
                                            const cfg = ACTION_CONFIG[log.action] ?? {
                                                label: log.action,
                                                color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                                                icon: ShieldAlert,
                                            };
                                            const Icon = cfg.icon;
                                            const shortModel = getModelShortName(log.model_type);
                                            const modelLabel = MODEL_LABELS[shortModel] ?? shortModel;
                                            return (
                                                <motion.tr key={log.id}
                                                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.015 }}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">

                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <Clock className="w-3.5 h-3.5 shrink-0" />
                                                            {fmtDate(log.created_at)}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-3.5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                                                <User className="w-3.5 h-3.5 text-gray-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-900 dark:text-white">{log.user?.name ?? 'Système'}</p>
                                                                <p className="text-[10px] text-gray-400">{log.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-3.5">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                                                            <Icon className="w-3 h-3" />
                                                            {cfg.label}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-3.5">
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {modelLabel}
                                                            {log.model_id && <span className="text-gray-400 font-mono ml-1">#{log.model_id}</span>}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-3.5 max-w-xs">
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={log.description}>
                                                            {log.description}
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-3.5">
                                                        <span className="text-xs font-mono text-gray-400">{log.ip_address ?? '—'}</span>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {logs.last_page > 1 && (
                            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <p className="text-xs text-gray-500">Page {logs.current_page} / {logs.last_page} — {logs.total} entrées</p>
                                <div className="flex gap-1">
                                    <button onClick={() => handlePage(logs.current_page - 1)} disabled={logs.current_page === 1}
                                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handlePage(logs.current_page + 1)} disabled={logs.current_page === logs.last_page}
                                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}

AuditIndex.layout = {
    breadcrumbs: [{ title: "Journal d'audit", href: '/dashboard/audit' }],
};
