import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import AppLayoutLanding from '@/layouts/LandindLayout';

export default function CommandeConfirmation() {
    const { t } = useTranslation();

    return (
        <>
            <Head title="Commande confirmée — Logistech Equip+" />

            <div className="min-h-screen bg-stone-50 dark:bg-[#060D1A] flex flex-col">
                <div className="flex-1 flex items-center justify-center px-5 py-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-md w-full text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            >
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </motion.div>
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
                            {t('confirm_title')}
                        </h1>
                        <p className="text-slate-500 dark:text-white/50 mb-8">
                            {t('confirm_subtitle')}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.07] text-left">
                                <Phone className="w-5 h-5 text-[#C8962E] mb-2" />
                                <p className="text-xs text-slate-500 dark:text-white/40 mb-1">{t('confirm_call_label')}</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{t('confirm_call_value')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-stone-200 dark:border-white/[0.07] text-left">
                                <ShoppingBag className="w-5 h-5 text-[#C8962E] mb-2" />
                                <p className="text-xs text-slate-500 dark:text-white/40 mb-1">{t('confirm_payment_label')}</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{t('confirm_payment_value')}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href="/boutique"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C8962E] to-[#E8B84B] text-white font-bold hover:opacity-90 transition-opacity"
                            >
                                {t('confirm_continue')}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/"
                                className="text-sm text-slate-500 dark:text-white/40 hover:text-[#C8962E] transition-colors"
                            >
                                {t('confirm_back_home')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
CommandeConfirmation.layout = (page: any) => (
  <AppLayoutLanding {...page.props}>{page}</AppLayoutLanding>
);
