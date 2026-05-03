import { Form, Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
    BarChart2,
    CreditCard,
    FileText,
    MapPin,
    Package,
    Receipt,
    RefreshCw,
    RotateCcw,
    Search,
    ShoppingCart,
    Tag,
    Trash2,
    Truck,
    User2,
    UserCheck,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Commande, Produit } from '@/types/models';
import { User } from '@/types/auth';

interface Camion     { id: number; immatriculation: string; marque: string | null; modele: string | null; deleted_at: string | null; }
interface Chauffeur  { id: number; nom: string; prenom?: string; deleted_at: string | null; }
interface Expedition { id: number; reference: string; deleted_at: string | null; }
interface Categorie  { id: number; name: string; deleted_at: string | null; }
interface Client     { id: number; nom: string; prenom?: string | null; deleted_at: string | null; }
interface Devis      { id: number; nom: string; service: string; statut: string; deleted_at: string | null; }
interface Livraison  { id: number; etat: string; expedition_id: number; deleted_at: string | null; }
interface Facture    { id: number; numero_facture: string; montant_total: number | null; deleted_at: string | null; }
interface Paiement   { id: number; montant: number | null; mode_paiement: string; status: string; deleted_at: string | null; }
interface Mouvement  { id: number; type: string; quantite: number; source: string | null; deleted_at: string | null; }

const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

type Props = {
    camions: Camion[]; chauffeurs: Chauffeur[]; expeditions: Expedition[]; users: User[];
    produits: Produit[]; commandes: Commande[]; categories: Categorie[]; clients: Client[];
    devis: Devis[]; livraisons: Livraison[]; factures: Facture[]; paiements: Paiement[]; mouvements: Mouvement[];
};

export default function Restore({ camions, chauffeurs, expeditions, users, produits, commandes, categories, clients, devis, livraisons, factures, paiements, mouvements }: Props) {
    const [active, setActive]       = useState('camions');
    const [searchTerms, setSearch]  = useState<Record<string, string>>({});
    const [restoring, setRestoring] = useState<Record<string, number | null>>({});
    const [confirm, setConfirm]     = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({
        open: false, title: '', description: '', onConfirm: () => {},
    });

    const openConfirm = (title: string, description: string, onConfirm: () => void) =>
        setConfirm({ open: true, title, description, onConfirm });
    const closeConfirm = () => setConfirm(prev => ({ ...prev, open: false }));

    const sections = [
        { id: 'camions',     label: 'Camions',          icon: Truck,       accent: 'bg-blue-500',    light: 'bg-blue-50 dark:bg-blue-950/30',    data: camions,
          columns: [
              { key: 'immatriculation', label: 'Immatriculation', render: (i: Camion) => <span className="font-mono font-medium">{i.immatriculation}</span> },
              { key: 'modele', label: 'Modèle', render: (i: Camion) => <span className="text-muted-foreground">{[i.marque, i.modele].filter(Boolean).join(' ') || '—'}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Camion) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/camions/${id}`,
          force:   (id: number) => `/dashboard/restore/camions/${id}`,
        },
        { id: 'chauffeurs',  label: 'Chauffeurs',       icon: Users,       accent: 'bg-purple-500',  light: 'bg-purple-50 dark:bg-purple-950/30', data: chauffeurs,
          columns: [
              { key: 'nom', label: 'Nom complet', render: (i: Chauffeur) => <span className="font-medium">{[i.nom, i.prenom].filter(Boolean).join(' ')}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Chauffeur) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/chauffeurs/${id}`,
          force:   (id: number) => `/dashboard/restore/chauffeurs/${id}`,
        },
        { id: 'expeditions', label: 'Expéditions',      icon: Package,     accent: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-950/30', data: expeditions,
          columns: [
              { key: 'reference', label: 'Référence', render: (i: Expedition) => <span className="font-mono font-medium">{i.reference}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Expedition) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/expeditions/${id}`,
          force:   (id: number) => `/dashboard/restore/expeditions/${id}`,
        },
        { id: 'utilisateurs', label: 'Utilisateurs',   icon: UserCheck,   accent: 'bg-orange-500',  light: 'bg-orange-50 dark:bg-orange-950/30', data: users,
          columns: [
              { key: 'name', label: 'Nom', render: (i: User) => <span className="font-medium">{i.name}</span> },
              { key: 'email', label: 'Email', render: (i: User) => <span className="text-muted-foreground">{i.email}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: User) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/users/${id}`,
          force:   (id: number) => `/dashboard/restore/users/${id}`,
        },
        { id: 'commandes',   label: 'Commandes',        icon: ShoppingCart, accent: 'bg-amber-500',  light: 'bg-amber-50 dark:bg-amber-950/30',  data: commandes,
          columns: [
              { key: 'montant', label: 'Montant', render: (i: Commande) => <span className="font-medium tabular-nums">{(i.montant_total ?? 0).toLocaleString()} GNF</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Commande) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at ?? null)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/commandes/${id}`,
          force:   (id: number) => `/dashboard/restore/commandes/${id}`,
        },
        { id: 'produits',    label: 'Produits',         icon: Package,     accent: 'bg-indigo-500',  light: 'bg-indigo-50 dark:bg-indigo-950/30', data: produits,
          columns: [
              { key: 'nom', label: 'Nom', render: (i: Produit) => <span className="font-medium">{i.nom}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Produit) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at ?? null)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/produits/${id}`,
          force:   (id: number) => `/dashboard/restore/produits/${id}`,
        },
        { id: 'categories',  label: 'Catégories',       icon: Tag,         accent: 'bg-teal-500',    light: 'bg-teal-50 dark:bg-teal-950/30',    data: categories,
          columns: [
              { key: 'name', label: 'Nom', render: (i: Categorie) => <span className="font-medium">{i.name}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Categorie) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/categories/${id}`,
          force:   (id: number) => `/dashboard/restore/categories/${id}`,
        },
        { id: 'clients',     label: 'Clients',          icon: User2,       accent: 'bg-rose-500',    light: 'bg-rose-50 dark:bg-rose-950/30',    data: clients,
          columns: [
              { key: 'nom', label: 'Nom', render: (i: Client) => <span className="font-medium">{[i.nom, i.prenom].filter(Boolean).join(' ')}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Client) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/clients/${id}`,
          force:   (id: number) => `/dashboard/restore/clients/${id}`,
        },
        { id: 'devis',       label: 'Devis',            icon: FileText,    accent: 'bg-sky-500',     light: 'bg-sky-50 dark:bg-sky-950/30',      data: devis,
          columns: [
              { key: 'nom', label: 'Contact', render: (i: Devis) => <span className="font-medium">{i.nom}</span> },
              { key: 'service', label: 'Service', render: (i: Devis) => <span className="text-muted-foreground">{i.service}</span> },
              { key: 'statut', label: 'Statut', render: (i: Devis) => <Badge variant="secondary" className="text-xs">{i.statut}</Badge> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Devis) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/devis/${id}`,
          force:   (id: number) => `/dashboard/restore/devis/${id}`,
        },
        { id: 'livraisons',  label: 'Livraisons',       icon: MapPin,      accent: 'bg-lime-600',    light: 'bg-lime-50 dark:bg-lime-950/30',    data: livraisons,
          columns: [
              { key: 'etat', label: 'État', render: (i: Livraison) => <Badge variant="outline" className="text-xs">{i.etat}</Badge> },
              { key: 'expedition_id', label: 'Expédition', render: (i: Livraison) => <span className="font-mono text-xs text-muted-foreground">#{i.expedition_id}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Livraison) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/livraisons/${id}`,
          force:   (id: number) => `/dashboard/restore/livraisons/${id}`,
        },
        { id: 'factures',    label: 'Factures',         icon: Receipt,     accent: 'bg-yellow-500',  light: 'bg-yellow-50 dark:bg-yellow-950/30', data: factures,
          columns: [
              { key: 'numero_facture', label: 'Numéro', render: (i: Facture) => <span className="font-mono font-medium">{i.numero_facture}</span> },
              { key: 'montant_total', label: 'Montant', render: (i: Facture) => <span className="tabular-nums font-medium">{(i.montant_total ?? 0).toLocaleString()} GNF</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Facture) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/factures/${id}`,
          force:   (id: number) => `/dashboard/restore/factures/${id}`,
        },
        { id: 'paiements',   label: 'Paiements',        icon: CreditCard,  accent: 'bg-violet-500',  light: 'bg-violet-50 dark:bg-violet-950/30', data: paiements,
          columns: [
              { key: 'mode_paiement', label: 'Mode', render: (i: Paiement) => <Badge variant="secondary" className="text-xs">{i.mode_paiement}</Badge> },
              { key: 'montant', label: 'Montant', render: (i: Paiement) => <span className="tabular-nums font-medium">{(i.montant ?? 0).toLocaleString()} GNF</span> },
              { key: 'status', label: 'Statut', render: (i: Paiement) => <span className="text-xs text-muted-foreground">{i.status}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Paiement) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/paiements/${id}`,
          force:   (id: number) => `/dashboard/restore/paiements/${id}`,
        },
        { id: 'mouvements',  label: 'Mouvements stock', icon: BarChart2,   accent: 'bg-fuchsia-500', light: 'bg-fuchsia-50 dark:bg-fuchsia-950/30', data: mouvements,
          columns: [
              { key: 'type', label: 'Type', render: (i: Mouvement) => <Badge variant="outline" className="text-xs">{i.type}</Badge> },
              { key: 'quantite', label: 'Quantité', render: (i: Mouvement) => <span className="tabular-nums font-medium">{i.quantite}</span> },
              { key: 'source', label: 'Source', render: (i: Mouvement) => <span className="text-muted-foreground text-xs">{i.source ?? '—'}</span> },
              { key: 'deleted_at', label: 'Supprimé le', render: (i: Mouvement) => <span className="text-xs text-muted-foreground">{formatDate(i.deleted_at)}</span> },
          ],
          restore: (id: number) => `/dashboard/restore/mouvements/${id}`,
          force:   (id: number) => `/dashboard/restore/mouvements/${id}`,
        },
    ];

    const totalItems   = sections.reduce((acc, s) => acc + s.data.length, 0);
    const activeSection = sections.find(s => s.id === active)!;

    const filtered = (id: string, data: any[]) => {
        const t = (searchTerms[id] || '').toLowerCase();
        if (!t) return data;
        return data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(t)));
    };

    const handleRestore = (sectionId: string, id: number) => {
        setRestoring(prev => ({ ...prev, [sectionId]: id }));
        setTimeout(() => setRestoring(prev => ({ ...prev, [sectionId]: null })), 1200);
    };

    return (
        <>
            <Head title="Corbeille" />

            {/* ── Page shell ── */}
            <div className="flex flex-col gap-6 p-4 md:p-6">

                {/* ── Top bar ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Trash2 className="w-6 h-6 text-muted-foreground" />
                            Corbeille
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {totalItems === 0
                                ? 'Aucun élément supprimé'
                                : `${totalItems} élément${totalItems > 1 ? 's' : ''} en attente de restauration`}
                        </p>
                    </div>

                    {totalItems > 0 && (
                        <div className="flex items-center gap-2">
                            <Form method="post" action="/dashboard/restore/all">
                                <Button type="submit" variant="outline" size="sm" className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 dark:hover:bg-emerald-950/20">
                                    <RotateCcw className="w-4 h-4" />
                                    Tout restaurer
                                </Button>
                            </Form>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="gap-2"
                                onClick={() => openConfirm(
                                    'Vider toute la corbeille ?',
                                    `Les ${totalItems} élément${totalItems > 1 ? 's' : ''} seront supprimés définitivement. Cette action est irréversible.`,
                                    () => router.delete('/dashboard/restore/empty'),
                                )}
                            >
                                <Trash2 className="w-4 h-4" />
                                Vider la corbeille
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Main layout ── */}
                <div className="flex flex-col lg:flex-row gap-4 min-h-150">

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-60 shrink-0">
                        <div className="rounded-xl border bg-card p-2 space-y-0.5 lg:sticky lg:top-20">
                            {sections.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setActive(s.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left group
                                        ${active === s.id
                                            ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                >
                                    <span className="flex items-center gap-2.5">
                                        <s.icon className="w-4 h-4 shrink-0" />
                                        <span className="truncate">{s.label}</span>
                                    </span>
                                    {s.data.length > 0 && (
                                        <span className={`text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded-full min-w-5 text-center
                                            ${active === s.id ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted-foreground/15 text-muted-foreground'}`}>
                                            {s.data.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* ── Content panel ── */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                                className="rounded-xl border bg-card overflow-hidden h-full"
                            >
                                {/* Panel header */}
                                <div className={`flex items-center justify-between gap-4 px-5 py-4 border-b ${activeSection.light}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${activeSection.accent}`}>
                                            <activeSection.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{activeSection.label} supprimés</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activeSection.data.length === 0
                                                    ? 'Aucun élément'
                                                    : `${activeSection.data.length} élément${activeSection.data.length > 1 ? 's' : ''}`}
                                            </p>
                                        </div>
                                    </div>

                                    {activeSection.data.length > 0 && (
                                        <div className="relative shrink-0">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                                            <Input
                                                placeholder="Rechercher…"
                                                value={searchTerms[active] || ''}
                                                onChange={e => setSearch(prev => ({ ...prev, [active]: e.target.value }))}
                                                className="pl-9 h-8 w-48 text-sm bg-background"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Panel body */}
                                {activeSection.data.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-6">
                                        <div className={`p-5 rounded-2xl ${activeSection.light}`}>
                                            <activeSection.icon className="w-10 h-10 text-muted-foreground/50" />
                                        </div>
                                        <p className="font-medium text-muted-foreground">Aucun {activeSection.label.toLowerCase()} supprimé</p>
                                        <p className="text-xs text-muted-foreground/70 max-w-xs">
                                            Les éléments supprimés apparaîtront ici et pourront être restaurés
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted/30">
                                                    {activeSection.columns.map(col => (
                                                        <th key={col.key} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                            {col.label}
                                                        </th>
                                                    ))}
                                                    <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/50">
                                                <AnimatePresence>
                                                    {filtered(active, activeSection.data).map((item, idx) => (
                                                        <motion.tr
                                                            key={item.id}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: idx * 0.03 }}
                                                            className="group hover:bg-muted/30 transition-colors"
                                                        >
                                                            {activeSection.columns.map(col => (
                                                                <td key={col.key} className="px-5 py-3.5">
                                                                    {col.render(item)}
                                                                </td>
                                                            ))}
                                                            <td className="px-5 py-3.5">
                                                                <div className="flex items-center justify-end gap-1.5">
                                                                    <Form
                                                                        method="post"
                                                                        action={activeSection.restore(item.id)}
                                                                        onSubmit={() => handleRestore(active, item.id)}
                                                                    >
                                                                        <Button
                                                                            type="submit"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            disabled={restoring[active] === item.id}
                                                                            className="h-8 gap-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-xs font-medium"
                                                                        >
                                                                            {restoring[active] === item.id ? (
                                                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="inline-block">
                                                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                                                </motion.span>
                                                                            ) : (
                                                                                <RotateCcw className="w-3.5 h-3.5" />
                                                                            )}
                                                                            Restaurer
                                                                        </Button>
                                                                    </Form>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-8 w-8 p-0 text-muted-foreground/50 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={() => openConfirm(
                                                                            'Supprimer définitivement ?',
                                                                            'Cet élément sera supprimé de façon permanente et ne pourra plus être récupéré.',
                                                                            () => router.delete(activeSection.force(item.id)),
                                                                        )}
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </AnimatePresence>
                                            </tbody>
                                        </table>

                                        {filtered(active, activeSection.data).length === 0 && (
                                            <div className="py-12 text-center text-sm text-muted-foreground">
                                                Aucun résultat pour « {searchTerms[active]} »
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <p className="text-xs text-center text-muted-foreground/60">
                    Les éléments supprimés sont conservés 30 jours puis supprimés définitivement
                </p>
            </div>

            {/* Confirmation dialog */}
            <Dialog open={confirm.open} onOpenChange={open => !open && closeConfirm()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <span className="p-1.5 bg-red-100 dark:bg-red-950/40 rounded-lg">
                                <Trash2 className="w-4 h-4 text-red-600" />
                            </span>
                            {confirm.title}
                        </DialogTitle>
                        <DialogDescription className="text-sm leading-relaxed">
                            {confirm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" size="sm">Annuler</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => { confirm.onConfirm(); closeConfirm(); }}
                        >
                            Supprimer définitivement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
