import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';

export default function DepotsCreate() {
    const [form, setForm] = useState({ nom: '', adresse: '', description: '' });
    const [processing, setProcessing] = useState(false);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [field]: e.target.value });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post('/dashboard/depots', form, { onFinish: () => setProcessing(false) });
    };

    return (
        <>
            <Head title="Nouveau dépôt" />

            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center gap-4">
                <Link href="/dashboard/depots"
                    className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nouveau dépôt</h1>
            </div>

            <div className="max-w-xl mx-auto px-6 py-8">
                <form onSubmit={handleSubmit} className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Nom *</label>
                        <input type="text" required value={form.nom} onChange={set('nom')}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Adresse</label>
                        <input type="text" value={form.adresse} onChange={set('adresse')}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Description</label>
                        <textarea rows={3} value={form.description} onChange={set('description')}
                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 py-2.5 px-3 text-sm resize-none focus:outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:opacity-50">
                            <Save className="w-4 h-4" />
                            {processing ? 'Création…' : 'Créer le dépôt'}
                        </button>
                        <Link href="/dashboard/depots"
                            className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

DepotsCreate.layout = {
    breadcrumbs: [
        { title: 'Dépôts', href: '/dashboard/depots' },
        { title: 'Nouveau', href: '/dashboard/depots/creer' },
    ],
};
