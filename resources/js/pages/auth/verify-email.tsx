import { MailCheck, ShieldCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { send } from '@/routes/verification';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import AuthLayout from '@/layouts/auth-layout';

const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/20';

// Composant ConfirmPassword
export function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmer le mot de passe" />
            
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg,rgba(200,150,46,0.12),rgba(232,184,75,0.12))', border: '1px solid rgba(200,150,46,0.25)' }}>
                    <ShieldCheck size={28} className="text-[#C8962E]" />
                </div>
                <p className="text-sm text-slate-500 dark:text-white/40 max-w-xs leading-relaxed">
                    Veuillez confirmer votre mot de passe avant de continuer.
                </p>
            </div>

            <Form {...store.form()} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Mot de passe
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                className={inputCls}
                            />
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

ConfirmPassword.layout = (page: ReactNode) => (
    <AuthLayout title="Confirmation requise" description="Pour des raisons de sécurité, veuillez confirmer votre mot de passe.">
        {page}
    </AuthLayout>
);

// Composant VerifyEmail
export function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Vérification email" />

            <div className="mb-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg,rgba(200,150,46,0.12),rgba(232,184,75,0.12))', border: '1px solid rgba(200,150,46,0.25)' }}>
                    <MailCheck size={28} className="text-[#C8962E]" />
                </div>
                <p className="text-sm text-slate-500 dark:text-white/40 max-w-xs leading-relaxed">
                    Vérifiez votre boîte de réception et cliquez sur le lien d'activation que nous venons de vous envoyer.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    Un nouveau lien de vérification a été envoyé à votre adresse email.
                </div>
            )}

            <Form {...send.form()} className="flex flex-col gap-4">
                {({ processing }) => (
                    <>
                        <button type="submit" disabled={processing}
                            className="w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}>
                            {processing && <Spinner />}
                            Renvoyer l'email de vérification
                        </button>

                        <TextLink href={logout()} className="block text-center text-sm text-slate-400 hover:text-slate-600 dark:text-white/25 dark:hover:text-white/50 transition-colors no-underline">
                            Se déconnecter
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = (page: ReactNode) => (
    <AuthLayout title="Vérifiez votre email" description="Un lien de vérification vous a été envoyé.">
        {page}
    </AuthLayout>
);