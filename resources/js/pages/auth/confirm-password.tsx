import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import AuthLayout from '@/layouts/auth-layout';

const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/20';

export function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmer le mot de passe" />

            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-[#C8962E]/[0.08] dark:border-[#C8962E]/20">
                <ShieldCheck size={18} className="text-[#C8962E] flex-shrink-0" />
                <p className="text-sm text-amber-800 dark:text-white/60">
                    Zone sécurisée — confirmez votre identité pour continuer.
                </p>
            </div>

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Mot de passe actuel
                            </Label>
                            <PasswordInput id="password" name="password" placeholder="••••••••"
                                autoComplete="current-password" autoFocus className={inputCls} />
                            <InputError message={errors.password} />
                        </div>

                        <button type="submit" disabled={processing}
                            className="w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}>
                            {processing && <Spinner />}
                            Confirmer
                        </button>
                    </>
                )}
            </Form>
        </>
    );
}

// ✅ Layout = fonction
ConfirmPassword.layout = (page: ReactNode) => (
    <AuthLayout title="Confirmer votre identité" description="Cette zone est sécurisée. Veuillez confirmer votre mot de passe avant de continuer.">
        {page}
    </AuthLayout>
);

