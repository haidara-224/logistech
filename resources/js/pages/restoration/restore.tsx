import { Form, Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  RefreshCw, 
  Truck, 
  Users, 
  Package, 
  ShoppingCart, 
  UserCheck,
  Calendar,
  Clock,
  RotateCcw,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
                { 
                    key: 'modele', 
                    label: 'Modèle', 
                    render: (item: Camion) => [item.marque, item.modele].filter(Boolean).join(' ') || '-' 
                },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Camion) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/camions/${id}`
        },
        {
            id: 'chauffeurs',
            title: 'Chauffeurs',
            icon: Users,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            data: chauffeurs,
            columns: [
                { 
                    key: 'nom', 
                    label: 'Nom complet', 
                    render: (item: Chauffeur) => [item.nom, item.prenom].filter(Boolean).join(' ') 
                },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Chauffeur) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/chauffeurs/${id}`
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
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Expedition) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/expeditions/${id}`
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
                { key: 'deleted_at', label: 'Supprimé le', render: (item: User) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/users/${id}`
        },
        {
            id: 'commandes',
            title: 'Commandes',
            icon: ShoppingCart,
            color: 'from-yellow-500 to-amber-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
            data: commandes,
            columns: [
                { 
                    key: 'montant', 
                    label: 'Montant', 
                    render: (item: Commande) => `${item.montant_total.toLocaleString()} GNF` 
                },
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Commande) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/commandes/${id}`
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
                { key: 'deleted_at', label: 'Supprimé le', render: (item: Produit) => formatDate(item.deleted_at) }
            ],
            action: (id: number) => `/restore/produits/${id}`
        }
    ];

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filterData = (sectionId: string, data: any[]) => {
        const searchTerm = searchTerms[sectionId] || '';
        if (!searchTerm) return data;
        
        return data.filter(item => {
            return Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    };

    const handleRestore = (sectionId: string, id: number) => {
        setRestoring(prev => ({ ...prev, [sectionId]: id }));
        setTimeout(() => {
            setRestoring(prev => ({ ...prev, [sectionId]: null }));
        }, 1000);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <>
            <Head title="Restauration - Administration" />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="container mx-auto px-4 py-8 lg:py-12">
                    {/* Header avec animation */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                        <RotateCcw className="w-6 h-6 text-white" />
                                    </div>
                                    <Heading
                                        variant="large"
                                        title="Centre de Restauration"
                                        description="Retrouvez et restaurez les éléments supprimés récemment"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground ml-14">
                                    Dernière mise à jour : {new Date().toLocaleString('fr-FR')}
                                </p>
                            </div>
                            <Badge variant="outline" className="px-4 py-2 text-sm">
                                <Clock className="w-4 h-4 mr-2" />
                                {sections.reduce((acc, section) => acc + section.data.length, 0)} élément(s) à restaurer
                            </Badge>
                        </div>
                    </motion.div>

                    {/* Statistiques rapides */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
                    >
                        {sections.map((section) => (
                            <Card key={section.id} className="relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-4">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <div className="flex items-center justify-between mb-2">
                                        <section.icon className={`w-5 h-5 text-gray-600 dark:text-gray-400`} />
                                        <Badge variant="secondary" className="text-xs">
                                            {section.data.length}
                                        </Badge>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">{section.title}</p>
                                    <p className="text-2xl font-bold">{section.data.length}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>

                    {/* Sections avec Tabs pour une meilleure organisation */}
                    <Tabs defaultValue="camions" className="space-y-6">
                        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 bg-transparent h-auto p-0">
                            {sections.map((section) => (
                                <TabsTrigger
                                    key={section.id}
                                    value={section.id}
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 data-[state=active]:border-primary"
                                >
                                    <section.icon className="w-4 h-4 mr-2" />
                                    {section.title}
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                        {section.data.length}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {sections.map((section) => (
                            <TabsContent key={section.id} value={section.id}>
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                                                        <section.icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">{section.title} supprimés</CardTitle>
                                                        <CardDescription>
                                                            {section.data.length === 0 
                                                                ? "Aucun élément à restaurer" 
                                                                : `${section.data.length} élément(s) à restaurer`}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                                {section.data.length > 0 && (
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
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
                                                    <motion.div
                                                        variants={tableVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        className="overflow-x-auto"
                                                    >
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="bg-muted/50">
                                                                    {section.columns.map((col) => (
                                                                        <TableHead key={col.key} className="font-semibold">
                                                                            {col.label}
                                                                        </TableHead>
                                                                    ))}
                                                                    <TableHead className="text-right">Action</TableHead>
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
                                                                            <Form 
                                                                                method="post" 
                                                                                action={section.action(item.id)}
                                                                                onSubmit={() => handleRestore(section.id, item.id)}
                                                                            >
                                                                                <motion.div
                                                                                    whileHover={{ scale: 1.05 }}
                                                                                    whileTap={{ scale: 0.95 }}
                                                                                >
                                                                                    <Button
                                                                                        type="submit"
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        className="group relative overflow-hidden transition-all duration-300 hover:border-green-500 hover:text-green-600"
                                                                                        disabled={restoring[section.id] === item.id}
                                                                                    >
                                                                                        {restoring[section.id] === item.id ? (
                                                                                            <motion.div
                                                                                                animate={{ rotate: 360 }}
                                                                                                transition={{ duration: 1, repeat: Infinity }}
                                                                                            >
                                                                                                <RefreshCw className="w-4 h-4" />
                                                                                            </motion.div>
                                                                                        ) : (
                                                                                            <>
                                                                                                <RotateCcw className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                                                                                Restaurer
                                                                                            </>
                                                                                        )}
                                                                                    </Button>
                                                                                </motion.div>
                                                                            </Form>
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

                    {/* Footer informatif */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-xs text-muted-foreground">
                            Les éléments supprimés sont conservés pendant 30 jours avant suppression définitive
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}