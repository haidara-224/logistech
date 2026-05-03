import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Phone, Mail, MapPin, CreditCard, Pencil, ShoppingCart, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Client, Commande } from '@/types/models';

interface Props {
    client: Client & { commandes: Commande[] };
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    en_attente: { label: 'En attente', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300', icon: Clock },
    payer: { label: 'Payée', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: CheckCircle },
    livree: { label: 'Livrée', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: CheckCircle },
    annulee: { label: 'Annulée', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', icon: XCircle },
};

export default function ClientsShow({ client }: Props) {
    const commandes = client.commandes ?? [];

    return (
        <>
            <Head title={`${client.nom} ${client.prenom ?? ''}`} />
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <Link href="/dashboard/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux clients
                </Link>

                {/* Client Card */}
                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C8962E] to-[#E8B84B] flex items-center justify-center text-white font-bold text-2xl">
                                {client.nom.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {client.nom} {client.prenom}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    {commandes.length} commande{commandes.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <Link
                            href={`/dashboard/clients/${client.id}/modifier`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-950 transition-colors"
                        >
                            <Pencil className="h-4 w-4" />
                            Modifier
                        </Link>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {client.telephone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Phone className="h-4 w-4 text-[#C8962E]" />
                                {client.telephone}
                            </div>
                        )}
                        {client.email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Mail className="h-4 w-4 text-[#C8962E]" />
                                {client.email}
                            </div>
                        )}
                        {client.quartier && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <MapPin className="h-4 w-4 text-[#C8962E]" />
                                {client.quartier}
                            </div>
                        )}
                        {client.piece && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <CreditCard className="h-4 w-4 text-[#C8962E]" />
                                {client.piece}
                            </div>
                        )}
                    </div>
                </div>

                {/* Commandes */}
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-[#C8962E]" />
                            Historique des commandes
                        </h2>
                        <Link
                            href="/dashboard/commandes/creer"
                            className="text-sm text-[#C8962E] hover:text-[#E8B84B] font-medium transition-colors"
                        >
                            + Nouvelle commande
                        </Link>
                    </div>

                    {commandes.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                            Aucune commande pour ce client
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                            {commandes.map((cmd) => {
                                const cfg = statusConfig[cmd.status ?? 'en_attente'] ?? statusConfig.en_attente;
                                const Icon = cfg.icon;
                                return (
                                    <li key={cmd.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <ShoppingCart className="h-4 w-4 text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Commande #{cmd.id}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="h-3 w-3" />
                                                    {cmd.created_at ? new Date(cmd.created_at).toLocaleDateString('fr-FR') : '—'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                                                <Icon className="h-3 w-3" />
                                                {cfg.label}
                                            </span>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {cmd.montant_total?.toLocaleString() ?? '—'} GNF
                                            </p>
                                            <Link href={`/commandes/${cmd.id}`} className="text-sm text-[#C8962E] hover:text-[#E8B84B] font-medium transition-colors">
                                                Voir
                                            </Link>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

ClientsShow.layout = {
    breadcrumbs: [
        { title: 'Clients', href: '/dashboard/clients' },
        { title: 'Détails', href: '#' },
    ],
};
