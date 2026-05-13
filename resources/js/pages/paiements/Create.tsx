import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Banknote, CalendarDays, CheckCircle, CreditCard, Package, ShoppingBag, Smartphone, User } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Commande, CommandeItem, Client, Facture } from '@/types/models';

interface Props {
    commande: (Commande & { client: Client; items: CommandeItem[] }) | null;
    facture?: Facture | null;
}

const fmtGnf = (n: number | null | undefined) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n ?? 0);

const modeOptions = [
    { value: 'espece', label: 'Espèces', icon: Banknote, color: 'text-amber-600' },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone, color: 'text-green-600' },
    { value: 'carte_bancaire', label: 'Carte bancaire', icon: CreditCard, color: 'text-blue-600' },
];

const today = new Date().toISOString().split('T')[0];

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.38, delay: i * 0.08, ease: 'easeOut' as const },
    }),
};

export default function PaiementsCreate({ commande, facture }: Props) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const isAchatMode = !commande && facture?.type === 'achat';
    const montantRef = isAchatMode
        ? (facture?.montant_total ?? 0)
        : (commande?.montant_total ?? 0);

    const [montant, setMontant] = useState<number>(Number(montantRef));
    const [modePaiement, setModePaiement] = useState<string>('espece');
    const [datePaiement, setDatePaiement] = useState<string>(today);
    const [processing, setProcessing] = useState(false);

    const backHref = isAchatMode
        ? (facture?.achat ? `/dashboard/achats/${facture.achat.id}` : '/dashboard/achats')
        : `/dashboard/commandes/${commande?.id}`;

    const handleSubmit = (e: { preventDefault(): void }) => {
        e.preventDefault();
        setProcessing(true);

        if (isAchatMode && facture) {
            router.post(
                `/dashboard/factures/${facture.id}/paiement`,
                { montant, mode_paiement: modePaiement, date_paiement: datePaiement },
                { onFinish: () => setProcessing(false) },
            );
        } else if (commande) {
            router.post(
                `/dashboard/commandes/${commande.id}/paiements`,
                { montant, mode_paiement: modePaiement, date_paiement: datePaiement, facture_id: facture?.id ?? null },
                { onFinish: () => setProcessing(false) },
            );
        }
    };

    return (
        <>
            <Head title={isAchatMode ? `Paiement — ${facture?.numero_facture}` : `Paiement — Commande #${commande?.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

                    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                        <Link href={backHref}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group">
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                            {isAchatMode ? "Retour à l'achat" : 'Retour à la commande'}
                        </Link>
                    </motion.div>

                    <motion.div custom={0} variants={itemVariants} initial="hidden" animate="show" className="mb-6">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8962E] to-[#E8B84B] flex items-center justify-center shadow-md">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                                    Enregistrer un paiement
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-zinc-400">
                                    {isAchatMode
                                        ? <>Facture <span className="font-mono font-semibold text-[#C8962E]">{facture?.numero_facture}</span></>
                                        : <>Commande <span className="font-mono font-semibold text-[#C8962E]">#{commande?.id}</span></>
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Summary card */}
                    <motion.div custom={1} variants={itemVariants} initial="hidden" animate="show">
                        <Card className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm mb-6 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-[#C8962E] to-[#E8B84B]" />
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-[#C8962E]" />
                                    {isAchatMode ? 'Détails de la facture fournisseur' : 'Détails de la commande'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                                        <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-[#C8962E]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-0.5">
                                                {isAchatMode ? 'Fournisseur' : 'Client'}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {isAchatMode
                                                    ? (facture?.achat?.fournisseur?.nom ?? '—')
                                                    : `${commande?.client?.nom ?? ''}${commande?.client?.prenom ? ' ' + commande.client.prenom : ''}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                                        <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center shrink-0">
                                            <Package className="w-4 h-4 text-[#C8962E]" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-0.5">
                                                Articles
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {isAchatMode
                                                    ? `${facture?.achat?.items?.length ?? 0} article(s)`
                                                    : `${commande?.items?.length ?? 0} article(s)`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#C8962E]/5 to-[#E8B84B]/5 border border-[#C8962E]/10">
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                                        {isAchatMode ? 'Montant facture' : 'Montant total commande'}
                                    </span>
                                    <span className="text-lg font-black text-[#C8962E]">
                                        {fmtGnf(montantRef)}
                                    </span>
                                </div>

                                {/* Items list */}
                                {isAchatMode
                                    ? (facture?.achat?.items ?? []).length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {(facture?.achat?.items ?? []).map((item) => (
                                                <div key={item.id} className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400 px-2">
                                                    <span className="truncate max-w-[60%]">
                                                        {item.produit?.nom ?? `Produit #${item.produit_id}`}
                                                        <span className="text-gray-400 ml-1">×{item.quantite}</span>
                                                    </span>
                                                    <span className="font-medium text-gray-800 dark:text-zinc-200 shrink-0">{fmtGnf(item.prix_total)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                    : (commande?.items ?? []).length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {(commande?.items ?? []).map((item) => (
                                                <div key={item.id} className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400 px-2">
                                                    <span className="truncate max-w-[60%]">
                                                        {item.produit?.nom ?? `Produit #${item.produit_id}`}
                                                        <span className="text-gray-400 ml-1">×{item.quantite}</span>
                                                    </span>
                                                    <span className="font-medium text-gray-800 dark:text-zinc-200 shrink-0">{fmtGnf(item.prix_total)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Payment form */}
                    <motion.div custom={2} variants={itemVariants} initial="hidden" animate="show">
                        <form onSubmit={handleSubmit}>
                            <Card className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                                <div className="h-1 bg-gradient-to-r from-[#C8962E] to-[#E8B84B]" />
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#C8962E]" />
                                        Informations de paiement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                            Montant <span className="text-[#C8962E]">*</span>
                                        </label>
                                        <div className="relative">
                                            <input type="number" min={0} step={1} value={montant}
                                                onChange={(e) => setMontant(Number(e.target.value))} required
                                                className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 py-3 px-4 pr-16 text-sm font-semibold text-gray-900 dark:text-white focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#C8962E]">GNF</span>
                                        </div>
                                        <p className="mt-1.5 text-xs text-gray-400 dark:text-zinc-500">
                                            Total : {fmtGnf(montantRef)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
                                            Mode de paiement <span className="text-[#C8962E]">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {modeOptions.map((mode) => {
                                                const Icon = mode.icon;
                                                const isSelected = modePaiement === mode.value;
                                                return (
                                                    <button key={mode.value} type="button" onClick={() => setModePaiement(mode.value)}
                                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-[#C8962E] bg-[#C8962E]/5 shadow-sm' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-gray-50 dark:bg-zinc-800/50'}`}>
                                                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#C8962E]' : 'text-gray-400 dark:text-zinc-400'}`} />
                                                        <span className={`text-xs font-semibold text-center leading-tight ${isSelected ? 'text-[#C8962E]' : 'text-gray-600 dark:text-zinc-400'}`}>
                                                            {mode.label}
                                                        </span>
                                                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#C8962E]" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                                            Date de paiement <span className="text-[#C8962E]">*</span>
                                        </label>
                                        <div className="relative">
                                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                                            <input type="date" value={datePaiement} onChange={(e) => setDatePaiement(e.target.value)} required
                                                className="w-full rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="rounded-xl bg-gradient-to-br from-[#C8962E]/5 to-[#E8B84B]/5 border border-[#C8962E]/10 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3">Récapitulatif</p>
                                        <div className="space-y-1.5 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-zinc-400">Montant</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{fmtGnf(montant)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-zinc-400">Mode</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{modeOptions.find((m) => m.value === modePaiement)?.label}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-zinc-400">Date</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {datePaiement ? new Date(datePaiement).toLocaleDateString('fr-FR') : '—'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Link href={backHref}
                                            className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm">
                                            Annuler
                                        </Link>
                                        <motion.button type="submit" disabled={processing || montant <= 0}
                                            whileHover={{ scale: processing ? 1 : 1.01 }} whileTap={{ scale: processing ? 1 : 0.98 }}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                                            <CreditCard className="h-4 w-4" />
                                            {processing ? 'Enregistrement...' : 'Enregistrer le paiement'}
                                        </motion.button>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
