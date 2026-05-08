import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function ChangePassword() {
    const form = useForm({ password: '', password_confirmation: '' });
    const [showPwd, setShowPwd]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/chauffeur/password');
    };

    const strength = (() => {
        const p = form.data.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6)            s++;
        if (p.length >= 10)           s++;
        if (/[0-9]/.test(p))          s++;
        if (/[^a-zA-Z0-9]/.test(p))  s++;
        return s;
    })();

    const strengthLabel = ['', 'Faible', 'Correct', 'Bon', 'Fort'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][strength];

    return (
        <>
            <Head title="Changer mon mot de passe" />

            <div
                className="min-h-dvh bg-gray-50 dark:bg-[#060d1a] flex flex-col items-center justify-center px-5"
                style={{ maxWidth: 430, margin: '0 auto' }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full space-y-7"
                >
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto">
                            <ShieldCheck size={26} className="text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bienvenue !</h1>
                            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
                                Choisissez un nouveau mot de passe<br />pour sécuriser votre compte.
                            </p>
                        </div>
                    </div>

                    {/* Alert */}
                    <div className="flex items-start gap-3 rounded-2xl bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20 p-4">
                        <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed">
                            Votre mot de passe provisoire est{' '}
                            <strong className="text-amber-800 dark:text-amber-300">0000</strong>.
                            Veuillez en choisir un nouveau d'au moins 6 caractères avant de continuer.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* New password */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">
                                Nouveau mot de passe
                            </p>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                    <Lock size={15} className="text-gray-400 dark:text-white/25" />
                                </div>
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={form.data.password}
                                    onChange={e => form.setData('password', e.target.value)}
                                    placeholder="Minimum 6 caractères"
                                    className="w-full h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-10 pr-12 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/50"
                                >
                                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            {/* Strength bar */}
                            {form.data.password.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200 dark:bg-white/10'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className={`text-[11px] font-medium ${['', 'text-red-500', 'text-amber-500', 'text-blue-500', 'text-emerald-500'][strength]}`}>
                                        {strengthLabel}
                                    </p>
                                </div>
                            )}
                            {form.errors.password && (
                                <p className="text-red-500 text-xs mt-1.5">{form.errors.password}</p>
                            )}
                        </div>

                        {/* Confirm */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2">
                                Confirmer le mot de passe
                            </p>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                                    <Lock size={15} className="text-gray-400 dark:text-white/25" />
                                </div>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.data.password_confirmation}
                                    onChange={e => form.setData('password_confirmation', e.target.value)}
                                    placeholder="Répétez le mot de passe"
                                    className="w-full h-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 pl-10 pr-12 text-base md:text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/50"
                                >
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            {/* Match indicator */}
                            {form.data.password_confirmation.length > 0 && (
                                <p className={`text-[11px] font-medium mt-1.5 ${form.data.password === form.data.password_confirmation ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {form.data.password === form.data.password_confirmation
                                        ? '✓ Les mots de passe correspondent'
                                        : '✗ Les mots de passe ne correspondent pas'}
                                </p>
                            )}
                            {form.errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1.5">{form.errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full h-13 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 mt-2"
                        >
                            <ShieldCheck size={17} />
                            {form.processing ? 'Enregistrement...' : 'Définir mon mot de passe'}
                        </button>
                    </form>

                    {/* Branding */}
                    <div className="flex items-center justify-center gap-1.5 pt-2">
                        <Zap size={11} className="text-emerald-500" />
                        <span className="text-[11px] text-gray-400 dark:text-white/20 font-medium tracking-widest uppercase">Logistech</span>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
