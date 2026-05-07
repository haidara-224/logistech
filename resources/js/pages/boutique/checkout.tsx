import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ShoppingCart, Package, ChevronLeft, ChevronDown, CreditCard, User, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import type { Produit } from '@/types/models';
import AppLayoutLanding from '@/layouts/LandindLayout';

interface PanierItem {
    produit_id: number;
    nom: string;
    prix: number;
    quantite: number;
}

interface Props {
    panier: Record<string, PanierItem>;
    produits: Produit[];
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-GN', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const inputCls = 'bg-white dark:bg-white/[0.04] border-stone-200 dark:border-white/[0.08] focus:border-[#C8962E] dark:focus:border-[#C8962E]';

export default function CheckoutPage({ panier }: Props) {
    const { t } = useTranslation();
    const items = Object.values(panier);
    const total = items.reduce((s, i) => s + i.prix * i.quantite, 0);
    const [summaryOpen, setSummaryOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        quartier: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/boutique/checkout');
    };

    const summaryLabel = (n: number) => `${t('checkout_summary')} (${n} ${n > 1 ? t('checkout_articles') : t('checkout_article')})`;

    if (items.length === 0) {
        return (
            <>
                <Head title={`${t('checkout_empty_title')} — Logistech Equip+`} />
                <div className="min-h-screen bg-stone-50 dark:bg-[#060D1A] flex flex-col">
                    <div className="flex-1 flex items-center justify-center flex-col gap-4 py-20">
                        <ShoppingCart className="w-20 h-20 text-stone-300 dark:text-white/10" />
                        <p className="text-xl font-bold text-slate-700 dark:text-white/60">{t('checkout_empty_msg')}</p>
                        <Link href="/boutique" className="text-[#C8962E] hover:underline text-sm flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" /> {t('checkout_back_shop')}
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Commander — Logistech Equip+" />

            <div className="min-h-screen bg-stone-50 dark:bg-[#060D1A] flex flex-col">
                <div className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 pt-28 pb-20">
                    <Link href="/boutique" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-white/40 hover:text-[#C8962E] transition-colors mb-8">
                        <ChevronLeft className="w-4 h-4" />
                        {t('checkout_back_shop')}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Formulaire — 3 colonnes */}
                        <div className="lg:col-span-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-white/[0.025] rounded-2xl border border-stone-200 dark:border-white/[0.07] p-6 sm:p-8"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-[#C8962E]" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('checkout_your_info')}</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="nom" className="text-sm font-medium text-slate-700 dark:text-white/70">{t('checkout_last_name')} *</Label>
                                            <Input id="nom" value={data.nom} onChange={(e) => setData('nom', e.target.value)} className={inputCls} placeholder={t('checkout_last_name_ph')} />
                                            {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="prenom" className="text-sm font-medium text-slate-700 dark:text-white/70">{t('checkout_first_name')}</Label>
                                            <Input id="prenom" value={data.prenom} onChange={(e) => setData('prenom', e.target.value)} className={inputCls} placeholder={t('checkout_first_name_ph')} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-white/70">
                                            <Mail className="inline w-3.5 h-3.5 mr-1" />Email *
                                        </Label>
                                        <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputCls} placeholder={t('checkout_email_ph')} />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="telephone" className="text-sm font-medium text-slate-700 dark:text-white/70">
                                            <Phone className="inline w-3.5 h-3.5 mr-1" />{t('checkout_phone')} *
                                        </Label>
                                        <Input id="telephone" value={data.telephone} onChange={(e) => setData('telephone', e.target.value)} className={inputCls} placeholder={t('checkout_phone_ph')} />
                                        {errors.telephone && <p className="text-xs text-red-500">{errors.telephone}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="quartier" className="text-sm font-medium text-slate-700 dark:text-white/70">
                                            <MapPin className="inline w-3.5 h-3.5 mr-1" />{t('checkout_zone')}
                                        </Label>
                                        <Input id="quartier" value={data.quartier} onChange={(e) => setData('quartier', e.target.value)} className={inputCls} placeholder={t('checkout_zone_ph')} />
                                    </div>

                                    <div className="pt-2">
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-5">
                                            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                                            <p className="text-xs text-amber-700 dark:text-amber-300">
                                                {t('checkout_payment_note')}
                                            </p>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-3.5 text-base font-bold rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] hover:opacity-90 border-0 text-white"
                                        >
                                            {processing ? t('checkout_processing') : `${t('checkout_confirm_btn')} — ${fmtGnf(total)}`}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>

                        {/* Résumé commande — 2 colonnes */}
                        <div className="lg:col-span-2">
                            {/* Mobile: toggle collapsible */}
                            <button
                                type="button"
                                onClick={() => setSummaryOpen(!summaryOpen)}
                                className="lg:hidden w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white dark:bg-white/[0.025] border border-stone-200 dark:border-white/[0.07] mb-2"
                            >
                                <span className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                                    <ShoppingCart className="w-4 h-4 text-[#C8962E]" />
                                    {summaryLabel(items.length)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-[#C8962E]">{fmtGnf(total)}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} />
                                </div>
                            </button>

                            <div className={`lg:block ${summaryOpen ? 'block' : 'hidden'}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white dark:bg-white/[0.025] rounded-2xl border border-stone-200 dark:border-white/[0.07] p-6 lg:sticky lg:top-24"
                                >
                                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 hidden lg:flex items-center gap-2">
                                        <ShoppingCart className="w-4 h-4 text-[#C8962E]" />
                                        {summaryLabel(items.length)}
                                    </h3>

                                    <div className="space-y-3 mb-5">
                                        {items.map((item) => (
                                            <div key={item.produit_id} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                                                    <Package className="w-5 h-5 text-stone-400 dark:text-white/20" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{item.nom}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-white/30">x{item.quantite}</p>
                                                </div>
                                                <p className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                    {fmtGnf(item.prix * item.quantite)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-stone-100 dark:border-white/10 pt-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-600 dark:text-white/60">{t('checkout_total')}</span>
                                            <span className="text-xl font-black text-[#C8962E]">{fmtGnf(total)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
CheckoutPage.layout = (page: any) => (
  <AppLayoutLanding {...page.props}>{page}</AppLayoutLanding>
);
