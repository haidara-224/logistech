import { Form, Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Produit } from '@/types/models';
import users from '@/routes/settings/permissions/users';
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

export default function Restore({ camions, chauffeurs, expeditions , users, produits}: {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    expeditions: Expedition[];
    users: User[]; 
    produits: Produit[];
}) {
    return (
        <>
            <Head title="Restauration" />

            <div className="space-y-6 p-5">
                <Heading
                    variant="small"
                    title="Restauration"
                    description="Restaurer les camions, chauffeurs et expéditions supprimés récemment."
                />

                <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Camions supprimés</h2>
                    {camions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun camion supprimé à restaurer.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Immatriculation</TableHead>
                                    <TableHead>Modèle</TableHead>
                                    <TableHead>Supprimé le</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {camions.map((camion) => (
                                    <TableRow key={camion.id} className="hover:bg-muted/50">
                                        <TableCell>{camion.immatriculation}</TableCell>
                                        <TableCell>{[camion.marque, camion.modele].filter(Boolean).join(' ')}</TableCell>
                                        <TableCell>{camion.deleted_at || '-'}</TableCell>
                                        <TableCell>
                                            <Form method="post" action={`/restore/camions/${camion.id}`}>
                                                <Button type="submit" variant="secondary" size="sm">
                                                    Restaurer
                                                </Button>
                                            </Form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Chauffeurs supprimés</h2>
                    {chauffeurs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun chauffeur supprimé à restaurer.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Supprimé le</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chauffeurs.map((chauffeur) => (
                                    <TableRow key={chauffeur.id} className="hover:bg-muted/50">
                                        <TableCell>{[chauffeur.nom, chauffeur.prenom].filter(Boolean).join(' ')}</TableCell>
                                        <TableCell>{chauffeur.deleted_at || '-'}</TableCell>
                                        <TableCell>
                                            <Form method="post" action={`/restore/chauffeurs/${chauffeur.id}`}>
                                                <Button type="submit" variant="secondary" size="sm">
                                                    Restaurer
                                                </Button>
                                            </Form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Expéditions supprimées</h2>
                    {expeditions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune expédition supprimée à restaurer.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Supprimé le</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expeditions.map((expedition) => (
                                    <TableRow key={expedition.id} className="hover:bg-muted/50">
                                        <TableCell>{expedition.reference}</TableCell>
                                        <TableCell>{expedition.deleted_at || '-'}</TableCell>
                                        <TableCell>
                                            <Form method="post" action={`/restore/expeditions/${expedition.id}`}>
                                                <Button type="submit" variant="secondary" size="sm">
                                                    Restaurer
                                                </Button>
                                            </Form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>

                <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Utilisateurs supprimés</h2>
                    {users.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun utilisateur supprimé à restaurer.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Supprimé le</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/50">
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.deleted_at || '-'}</TableCell>
                                        <TableCell>
                                            <Form method="post" action={`/restore/users/${user.id}`}>
                                                <Button type="submit" variant="secondary" size="sm">
                                                    Restaurer
                                                </Button>
                                            </Form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>


                    <section className="rounded-2xl border border-border bg-card p-6">
                    <h2 className="mb-4 text-lg font-semibold">Produits supprimés</h2>
                    {produits.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucun produit supprimé à restaurer.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Référence</TableHead>
                                    <TableHead>Supprimé le</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {produits.map((produit) => (
                                    <TableRow key={produit.id} className="hover:bg-muted/50">
                                        <TableCell>{produit.nom}</TableCell>
                                        <TableCell>{produit.deleted_at || '-'}</TableCell>
                                        <TableCell>
                                            <Form method="post" action={`/restore/produits/${produit.id}`}>
                                                <Button type="submit" variant="secondary" size="sm">
                                                    Restaurer
                                                </Button>
                                            </Form>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>
            </div>
        </>
    );
}
