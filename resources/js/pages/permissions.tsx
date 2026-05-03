import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
    Users, 
    Shield, 
    Key, 
    Plus, 
    Edit, 
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Crown,
    Mail,
    Lock,
    UserCheck,
    Sparkles
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface Role {
    id: number;
    name: string;
    permissions: Array<{ id: number; name: string }>;
}

interface Permission {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
    permissions: Array<{ id: number; name: string }>;
}

export default function PermissionsPage({ users, roles, permissions }: {
    users: User[];
    roles: Role[];
    permissions: Permission[];
}) {
    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { auth } = usePage().props as any;
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    const cardVariants = {
        hover: { scale: 1.02, transition: { duration: 0.2 } },
        tap: { scale: 0.98 }
    };

    return (
        <>
            <Head title="Permissions & rôles" />

            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
                {/* Notification toast */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, x: '-50%' }}
                            animate={{ opacity: 1, y: 0, x: '-50%' }}
                            exit={{ opacity: 0, y: -50, x: '-50%' }}
                            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
                        >
                            <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg">
                                <CheckCircle size={18} />
                                <span className="text-sm font-medium">{successMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header Section avec effet glassmorphique */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#C8962E]/10 to-[#E8B84B]/10 p-8 backdrop-blur-sm"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8962E]/20 rounded-full filter blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8B84B]/20 rounded-full filter blur-3xl" />
                        
                        <div className="relative flex items-start justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] p-2">
                                        <Shield className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <Heading
                                            title="Gestion des accès & permissions"
                                            description="Administration centralisée des utilisateurs, rôles et permissions"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Crown size={14} className="text-[#C8962E]" />
                                    <span>Connecté en tant que</span>
                                    <strong className="text-foreground">{auth.user?.name}</strong>
                                    <Badge variant="outline" className="border-[#C8962E] text-[#C8962E]">
                                        Super Admin
                                    </Badge>
                                </div>
                            </div>
                            
                            {/* Stats cards */}
                            <div className="hidden md:flex gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-2xl font-bold text-[#C8962E]">{users.length}</div>
                                    <div className="text-xs text-muted-foreground">Utilisateurs</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-2xl font-bold text-[#C8962E]">{roles.length}</div>
                                    <div className="text-xs text-muted-foreground">Rôles</div>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} className="text-center">
                                    <div className="text-2xl font-bold text-[#C8962E]">{permissions.length}</div>
                                    <div className="text-xs text-muted-foreground">Permissions</div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="rounded-2xl border border-border bg-background/50 backdrop-blur-sm shadow-xl"
                    >
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                            <div className="border-b border-border px-6 pt-6">
                                <TabsList className="gap-4 bg-transparent">
                                    <TabsTrigger 
                                        value="users" 
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C8962E]/10 data-[state=active]:to-[#E8B84B]/10 data-[state=active]:text-[#C8962E]"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Utilisateurs
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="roles"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C8962E]/10 data-[state=active]:to-[#E8B84B]/10 data-[state=active]:text-[#C8962E]"
                                    >
                                        <Shield className="mr-2 h-4 w-4" />
                                        Rôles
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="permissions"
                                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#C8962E]/10 data-[state=active]:to-[#E8B84B]/10 data-[state=active]:text-[#C8962E]"
                                    >
                                        <Key className="mr-2 h-4 w-4" />
                                        Permissions
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Users Tab */}
                            <TabsContent value="users" className="p-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    {/* Create User Form - Design moderne */}
                                    <motion.section 
                                        variants={itemVariants}
                                        className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C8962E]/5 to-[#E8B84B]/5 rounded-full filter blur-2xl" />
                                        <div className="relative">
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="rounded-lg bg-gradient-to-r from-[#C8962E] to-[#E8B84B] p-2">
                                                    <Plus className="h-4 w-4 text-white" />
                                                </div>
                                                <h2 className="text-lg font-semibold">Nouvel utilisateur</h2>
                                            </div>
                                            
                                            <Form method="post" action="/dashboard/permissions/users" className="space-y-4">
                                                {({ processing, errors }) => (
                                                    <>
                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2">
                                                                <UserCheck size={14} />
                                                                Nom complet
                                                            </Label>
                                                            <Input 
                                                                id="name" 
                                                                name="name" 
                                                                placeholder="Jean Dupont" 
                                                                className="transition-all focus:ring-2 focus:ring-[#C8962E]/20"
                                                            />
                                                            <InputError message={errors.name} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2">
                                                                <Mail size={14} />
                                                                Email
                                                            </Label>
                                                            <Input 
                                                                id="email" 
                                                                name="email" 
                                                                type="email" 
                                                                placeholder="jean@exemple.com"
                                                                className="transition-all focus:ring-2 focus:ring-[#C8962E]/20"
                                                            />
                                                            <InputError message={errors.email} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="flex items-center gap-2">
                                                                <Lock size={14} />
                                                                Mot de passe
                                                            </Label>
                                                            <Input 
                                                                id="password" 
                                                                name="password" 
                                                                type="password" 
                                                                placeholder="••••••••"
                                                                className="transition-all focus:ring-2 focus:ring-[#C8962E]/20"
                                                            />
                                                            <InputError message={errors.password} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Rôles</Label>
                                                            <select 
                                                                id="roles" 
                                                                name="roles[]" 
                                                                multiple 
                                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20"
                                                            >
                                                                {roles.map((role) => (
                                                                    <option key={role.id} value={role.name}>{role.name}</option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.roles} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Permissions directes</Label>
                                                            <select 
                                                                id="permissions" 
                                                                name="permissions[]" 
                                                                multiple 
                                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20"
                                                            >
                                                                {permissions.map((permission) => (
                                                                    <option key={permission.id} value={permission.name}>{permission.name}</option>
                                                                ))}
                                                            </select>
                                                            <InputError message={errors.permissions} />
                                                        </div>

                                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                            <Button 
                                                                disabled={processing}
                                                                className="w-full bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white hover:shadow-lg transition-all"
                                                            >
                                                                <Sparkles className="mr-2 h-4 w-4" />
                                                                Créer l'utilisateur
                                                            </Button>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </Form>
                                        </div>
                                    </motion.section>

                                    {/* Users List */}
                                    <motion.section 
                                        variants={itemVariants}
                                        className="rounded-2xl border border-border bg-card overflow-hidden"
                                    >
                                        <div className="p-6 border-b border-border">
                                            <h2 className="text-lg font-semibold">Utilisateurs existants</h2>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {users.length} utilisateur(s) actif(s)
                                            </p>
                                        </div>
                                        
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-muted/50">
                                                        <TableHead>Utilisateur</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Rôles & Permissions</TableHead>
                                                        <TableHead className="text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {users.map((user) => (
                                                        <TableRow 
                                                            key={user.id} 
                                                            className="transition-colors hover:bg-muted/50"
                                                            onMouseEnter={() => setHoveredRow(user.id)}
                                                            onMouseLeave={() => setHoveredRow(null)}
                                                        >
                                                            <TableCell className="font-medium">{user.name}</TableCell>
                                                            <TableCell>{user.email}</TableCell>
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    {user.roles.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {user.roles.map((role) => (
                                                                                <Badge key={role.id} className="bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white">
                                                                                    {role.name}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {user.permissions.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {user.permissions.map((permission) => (
                                                                                <Badge key={permission.id} variant="outline">
                                                                                    {permission.name}
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {user.roles.length === 0 && user.permissions.length === 0 && (
                                                                        <span className="text-sm text-muted-foreground">Aucun rôle/permission</span>
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <motion.div
                                                                    initial={false}
                                                                    animate={{ opacity: hoveredRow === user.id ? 1 : 0.6 }}
                                                                >
                                                                    <Form method="put" action={`/dashboard/permissions/users/${user.id}`} className="space-y-3">
                                                                        <div className="space-y-1.5">
                                                                            {roles.map((role) => {
                                                                                const checked = user.roles.some((r) => r.name === role.name);
                                                                                return (
                                                                                    <label
                                                                                        key={role.id}
                                                                                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 border border-border bg-background hover:bg-muted/50 cursor-pointer transition-colors"
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            name="roles[]"
                                                                                            value={role.name}
                                                                                            defaultChecked={checked}
                                                                                            className="w-3.5 h-3.5 accent-[#C8962E] cursor-pointer"
                                                                                        />
                                                                                        <span className="text-xs font-medium text-foreground">{role.name}</span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        <Button size="sm" variant="outline" className="w-full">
                                                                            <Save size={14} className="mr-1" />
                                                                            Mettre à jour
                                                                        </Button>
                                                                    </Form>
                                                                </motion.div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </motion.section>
                                </div>
                            </TabsContent>

                            {/* Roles Tab - Design similaire amélioré */}
                            <TabsContent value="roles" className="p-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <motion.section variants={itemVariants} className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="rounded-lg bg-gradient-to-r from-[#C8962E] to-[#E8B84B] p-2">
                                                <Plus className="h-4 w-4 text-white" />
                                            </div>
                                            <h2 className="text-lg font-semibold">Créer un rôle</h2>
                                        </div>
                                        <Form method="post" action="/dashboard/permissions/roles" className="space-y-4">
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Nom du rôle</Label>
                                                        <Input name="name" placeholder="ex: éditeur, modérateur..." />
                                                        <InputError message={errors.name} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Permissions</Label>
                                                        <select name="permissions[]" multiple className="w-full rounded-lg border border-border bg-background px-3 py-2">
                                                            {permissions.map((permission) => (
                                                                <option key={permission.id} value={permission.name}>{permission.name}</option>
                                                            ))}
                                                        </select>
                                                        <InputError message={errors.permissions} />
                                                    </div>
                                                    <Button disabled={processing} className="w-full bg-gradient-to-r from-[#C8962E] to-[#E8B84B]">
                                                        <Shield className="mr-2 h-4 w-4" />
                                                        Créer le rôle
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </motion.section>

                                    <motion.section variants={itemVariants} className="space-y-3">
                                        <h2 className="text-lg font-semibold mb-4">Rôles existants</h2>
                                        {roles.map((role) => (
                                            <motion.div
                                                key={role.id}
                                                whileHover={{ scale: 1.02 }}
                                                className="rounded-2xl border border-border bg-card p-4 hover:shadow-lg transition-all"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-5 w-5 text-[#C8962E]" />
                                                        <strong className="text-lg">{role.name}</strong>
                                                    </div>
                                                    <Badge variant="secondary">{role.permissions.length} permissions</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.permissions.map((permission) => (
                                                        <Badge key={permission.id} variant="outline" className="border-[#C8962E]/30">
                                                            {permission.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.section>
                                </div>
                            </TabsContent>

                            {/* Permissions Tab */}
                            <TabsContent value="permissions" className="p-6">
                                <div className="grid gap-6 lg:grid-cols-2">
                                    <motion.section variants={itemVariants} className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="rounded-lg bg-gradient-to-r from-[#C8962E] to-[#E8B84B] p-2">
                                                <Key className="h-4 w-4 text-white" />
                                            </div>
                                            <h2 className="text-lg font-semibold">Nouvelle permission</h2>
                                        </div>
                                        <Form method="post" action="/dashboard/permissions/permissions" className="space-y-4">
                                            {({ processing, errors }) => (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Nom de la permission</Label>
                                                        <Input name="name" placeholder="ex: articles.publier" />
                                                        <InputError message={errors.name} />
                                                    </div>
                                                    <Button disabled={processing} className="w-full bg-gradient-to-r from-[#C8962E] to-[#E8B84B]">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Créer la permission
                                                    </Button>
                                                </>
                                            )}
                                        </Form>
                                    </motion.section>

                                    <motion.section variants={itemVariants}>
                                        <h2 className="text-lg font-semibold mb-4">Permissions existantes</h2>
                                        <div className="grid grid-cols-1 gap-2">
                                            {permissions.map((permission) => (
                                                <motion.div
                                                    key={permission.id}
                                                    whileHover={{ x: 5 }}
                                                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Key className="h-4 w-4 text-[#C8962E]" />
                                                        <span className="font-mono text-sm">{permission.name}</span>
                                                    </div>
                                                    <Badge variant="secondary">#{permission.id}</Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.section>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </div>
        </>
    );
}