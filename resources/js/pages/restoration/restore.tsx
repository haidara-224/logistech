import { Form, Head, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    RefreshCw,
    Truck,
    Users,
    Package,
    ShoppingCart,
    UserCheck,
    Clock,
    RotateCcw,
    Search,
    Trash2,
} from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Camion {
    id: number;
    immatriculation: string;
    marque: string | null;
    modele: string | null;
    deleted_at: string | null;
}

interface Chauffeur {
    id: number;
    nom: string;
    prenom?: string;
    deleted_at: string | null;
}

interface Expedition {
    id: number;
    reference: string;
    deleted_at: string | null;
}

const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

export default function Restore({ camions, chauffeurs, expeditions, users, produits, commandes }: {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    expeditions: Expedition[];
    users: User[];
    produits: Produit[];
    commandes: Commande[];
}) {
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [restoring, setRestoring] = useState<Record<string, number | null>>({});
    const [confirm, setConfirm] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({
        open: false, title: '', description: '', onConfirm: () => {},
    });

    const openConfirm = (title: string, description: string, onConfirm: () => void) =>
        setConfirm({ open: true, title, description, onConfirm });
    const closeConfirm = () => setConfirm(prev => ({ ...prev, open: false }));

    const sections = [
        {
            id: 'camions',
            title: 'Camions',
            icon: Truck,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            data: camions,
            columns: [
                { key: 'immatriculation', label: 'Immatriculation', render: (item: Camion) => item.immatriculation },
                { key: 'modele', label: 'Modèle', render: (item: Camion) => [item.marque, item.modele].filter(Boolean).join(' ') || '-' },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Camion) => formatDate(item.deleted_at) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/camions/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/camions/${id}`,
        },
        {
            id: 'chauffeurs',
            title: 'Chauffeurs',
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            data: chauffeurs,
            columns: [
                { key: 'nom', label: 'Nom complet', render: (item: Chauffeur) => [item.nom, item.prenom].filter(Boolean).join(' ') },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Chauffeur) => formatDate(item.deleted_at) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/chauffeurs/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/chauffeurs/${id}`,
        },
        {
            id: 'expeditions',
            title: 'Expéditions',
            icon: Package,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            data: expeditions,
            columns: [
                { key: 'reference', label: 'Référence', render: (item: Expedition) => item.reference },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Expedition) => formatDate(item.deleted_at) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/expeditions/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/expeditions/${id}`,
        },
        {
            id: 'utilisateurs',
            title: 'Utilisateurs',
            icon: UserCheck,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            data: users,
            columns: [
                { key: 'name', label: 'Nom', render: (item: User) => item.name },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: User) => formatDate(item.deleted_at) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/users/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/users/${id}`,
        },
        {
            id: 'commandes',
            title: 'Commandes',
            icon: ShoppingCart,
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
            data: commandes,
            columns: [
                { key: 'montant', label: 'Montant', render: (item: Commande) => `${(item.montant_total ?? 0).toLocaleString()} GNF` },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Commande) => formatDate(item.deleted_at ?? null) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/commandes/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/commandes/${id}`,
        },
        {
            id: 'produits',
            title: 'Produits',
            icon: Package,
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/20',
            data: produits,
            columns: [
                { key: 'nom', label: 'Nom', render: (item: Produit) => item.nom },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Produit) => formatDate(item.deleted_at ?? null) },
            ],
            restoreAction:     (id: number) => `/dashboard/restore/produits/${id}`,
            forceDeleteAction: (id: number) => `/dashboard/restore/produits/${id}`,
        },
    ];

    const totalItems = sections.reduce((acc, s) => acc + s.data.length, 0);

    const filterData = (sectionId: string, data: any[]) => {
        const term = searchTerms[sectionId] || '';
        if (!term) return data;
        return data.filter(item =>
            Object.values(item).some(v => String(v).toLowerCase().includes(term.toLowerCase()))
        );
    };

    const handleRestore = (sectionId: string, id: number) => {
        setRestoring(prev => ({ ...prev, [sectionId]: id }));
        setTimeout(() => setRestoring(prev => ({ ...prev, [sectionId]: null })), 1200);
    };

    const containerVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
    const tableVariants    = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const rowVariants      = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } };

    return (
        <>
            <Head title="Restauration - Administration" />

            <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="container mx-auto px-4 py-8 lg:py-12">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl">
                                        <RotateCcw className="w-6 h-6 text-white" />
                                    </div>
                                    <Heading
                                        title="Centre de Restauration"
                                        description="Retrouvez et restaurez les éléments supprimés récemment"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground ml-14">
                                    Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
                                </p>
                            </div>

                            {/* Actions globales */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <Badge variant="outline" className="px-4 py-2 text-sm">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {totalItems} élément{totalItems !== 1 ? 's' : ''} en corbeille
                                </Badge>

                                {totalItems > 0 && (
                                    <>
                                        {/* Restaurer tout */}
                                        <Form method="post" action="/dashboard/restore/all">
                                            <Button type="submit" variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 gap-2">
                                                <RotateCcw className="w-4 h-4" />
                                                Restaurer tout
                                            </Button>
                                        </Form>

                                        {/* Vider la corbeille */}
                                        <Button
                                            variant="destructive"
                                            className="gap-2"
                                            onClick={() => openConfirm(
                                                'Vider toute la corbeille ?',
                                                `Cette action est irréversible. Les ${totalItems} élément${totalItems !== 1 ? 's' : ''} seront supprimés définitivement et ne pourront plus être récupérés.`,
                                                () => router.delete('/dashboard/restore/empty'),
                                            )}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Vider la corbeille
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats rapides */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                    >
                        {sections.map((section) => (
                            <Card key={section.id} className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-4">
                                    <div className={`absolute inset-0 bg-linear-to-r ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <div className="flex items-center justify-between mb-2">
                                        <section.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <Badge variant="secondary" className="text-xs">{section.data.length}</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">{section.title}</p>
                                    <p className="text-2xl font-bold">{section.data.length}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Tabs */}
                    <Tabs defaultValue="camions" className="space-y-6">
                        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 bg-transparent h-auto p-0">
                            {sections.map((section) => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="data-[state=active]:bg-linear-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 data-[state=active]:border-primary"
                                >
                                    <section.icon className="w-4 h-4 mr-2" />
                                    {section.title}
                                    <Badge variant="secondary" className="ml-2 text-xs">{section.data.length}</Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {sections.map((section) => (
                            <TabsContent key={section.id} value={section.id}>
                                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                        <CardHeader className="border-b bg-linear-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-linear-to-r ${section.color}`}>
                                                        <section.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">{section.title} supprimés</CardTitle>
                                                        <CardDescription>
                                                            {section.data.length === 0
                                                                ? 'Aucun élément à restaurer'
                                                                : `${section.data.length} élément${section.data.length > 1 ? 's' : ''} à restaurer`}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {section.data.length > 0 && (
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder={`Rechercher dans ${section.title}...`}
                                                            value={searchTerms[section.id] || ''}
                                                            onChange={(e) => setSearchTerms(prev => ({ ...prev, [section.id]: e.target.value }))}
                                                            className="pl-10 w-full md:w-64"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </CardHeader>

                                        <CardContent className="p-0">
                                            <AnimatePresence mode="wait">
                                                {section.data.length === 0 ? (
                                                    <motion.div
                                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                        className="flex flex-col items-center justify-center py-16 text-center"
                                                    >
                                                        <div className={`p-4 rounded-full ${section.bgColor} mb-4`}>
                                                            <section.icon className="w-12 h-12 text-gray-400" />
                                                        </div>
                                                        <p className="text-lg font-medium text-muted-foreground">
                                                            Aucun {section.title.toLowerCase()} supprimé
                                                        </p>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Les éléments supprimés apparaîtront ici pendant 30 jours
                                                        </p>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div variants={tableVariants} initial="hidden" animate="visible" className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/50">
                                                                    {section.columns.map((col) => (
                                                                        <TableHead key={col.key} className="font-semibold">{col.label}</TableHead>
                                                                    ))}
                                                                    <TableHead className="text-right">Actions</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {filterData(section.id, section.data).map((item, index) => (
                                                                    <motion.tr
                                                                        key={item.id}
                                                                        variants={rowVariants}
                                                                        transition={{ delay: index * 0.03 }}
                                                                        className="group hover:bg-muted/50 transition-colors"
                                                                    >
                                                                        {section.columns.map((col) => (
                                                                            <TableCell key={col.key} className="py-3">
                                                                                {col.render(item)}
                                                                            </TableCell>
                                                                        ))}
                                                                        <TableCell className="text-right">
                                                                            <div className="flex items-center justify-end gap-2">
                                                                                {/* Restaurer */}
                                                                                <Form
                                                                                    method="post"
                                                                                    action={section.restoreAction(item.id)}
                                                                                    onSubmit={() => handleRestore(section.id, item.id)}
                                                                                >
                                                                                    <Button
                                                                                        type="submit"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        disabled={restoring[section.id] === item.id}
                                                                                        className="hover:border-green-500 hover:text-green-600 gap-1.5"
                                                                                    >
                                                                                        {restoring[section.id] === item.id ? (
                                                                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                                                                                                <RefreshCw className="w-3.5 h-3.5" />
                                                                                            </motion.div>
                                                                                        ) : (
                                                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                                                        )}
                                                                                        Restaurer
                                                                                    </Button>
                                                                                </Form>

                                                                                {/* Supprimer définitivement */}
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
                                                                                    onClick={() => openConfirm(
                                                                                        'Supprimer définitivement ?',
                                                                                        'Cet élément sera supprimé définitivement et ne pourra plus être récupéré.',
                                                                                        () => router.delete(section.forceDeleteAction(item.id)),
                                                                                    )}
                                                                                >
                                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                                    Suppr. définitive
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </motion.tr>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 text-center">
                        <p className="text-xs text-muted-foreground">
                            Les éléments supprimés sont conservés pendant 30 jours avant suppression définitive
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Shared confirmation dialog */}
            <Dialog open={confirm.open} onOpenChange={(open) => !open && closeConfirm()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            {confirm.title}
                        </DialogTitle>
                        <DialogDescription>{confirm.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
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
