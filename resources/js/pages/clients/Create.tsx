import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, User, Phone, Mail, MapPin, CreditCard } from 'lucide-react';

export default function ClientsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        quartier: '',
        piece: '',
        email: '',
        telephone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/clients');
    };

    return (
        <>
            <Head title="Nouveau client" />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <Link href="/dashboard/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux clients
                </Link>

                <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Nouveau client</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Remplissez les informations du client</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Nom / Prénom */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nom *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) => setData('nom', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                        placeholder="Nom de famille"
                                        required
                                    />
                                </div>
                                {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Prénom</label>
                                <input
                                    type="text"
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                    placeholder="Prénom"
                                />
                                {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
                            </div>
                        </div>

                        {/* Téléphone / Email */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Téléphone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={data.telephone}
                                        onChange={(e) => setData('telephone', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                        placeholder="+224 6XX XXX XXX"
                                    />
                                </div>
                                {errors.telephone && <p className="mt-1 text-xs text-red-600">{errors.telephone}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                        placeholder="email@exemple.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Quartier / Pièce */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quartier</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.quartier}
                                        onChange={(e) => setData('quartier', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                        placeholder="Ex: Kaloum, Matam..."
                                    />
                                </div>
                                {errors.quartier && <p className="mt-1 text-xs text-red-600">{errors.quartier}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pièce d'identité</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={data.piece}
                                        onChange={(e) => setData('piece', e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-4 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                        placeholder="N° CNI, Passeport..."
                                    />
                                </div>
                                {errors.piece && <p className="mt-1 text-xs text-red-600">{errors.piece}</p>}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                            <Link href="/dashboard/clients" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center text-sm">
                                Annuler
                            </Link>
                            <button type="submit" disabled={processing} className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                                {processing ? 'Enregistrement...' : 'Créer le client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ClientsCreate.layout = {
    breadcrumbs: [
        { title: 'Clients', href: '/dashboard/clients' },
        { title: 'Nouveau', href: '/dashboard/clients/creer' },
    ],
};
