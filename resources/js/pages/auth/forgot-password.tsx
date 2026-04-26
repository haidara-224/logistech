// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';
import AuthLayout from '@/layouts/auth-layout';
import { ReactNode } from 'react';

import { ShieldCheck } from 'lucide-react';


import PasswordInput from '@/components/password-input';

import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';


const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/20';


export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
          <Head title="Mot de passe oublié" />

            {status && (
                <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl
                    bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm
                    dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {status}
                </div>
            )}

            <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl
                bg-blue-50 border border-blue-200
                dark:bg-blue-500/08 dark:border-blue-500/20">
                <Mail size={18} className="text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-white/60">
                    Entrez votre email — nous vous enverrons un lien de réinitialisation.
                </p>
            </div>

            <Form {...email.form()} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Adresse email
                            </Label>
                            <Input id="email" type="email" name="email" required autoFocus
                                autoComplete="email" placeholder="email@exemple.com"
                                className={inputCls} />
                            <InputError message={errors.email} />
                        </div>

                        <button type="submit" disabled={processing}
                            className="
                                w-full h-11 rounded-xl font-bold text-sm text-black
                                flex items-center justify-center gap-2
                                transition-all duration-200 hover:brightness-110 active:scale-[0.98]
                                disabled:opacity-60 disabled:cursor-not-allowed
                            "
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}>
                            {processing && <Spinner />}
                            <Mail size={15} /> Envoyer le lien
                        </button>

                        <p className="text-center text-sm text-slate-500 dark:text-white/30">
                            <TextLink href={login()}
                                className="text-[#C8962E] hover:text-[#E8B84B] transition-colors font-medium no-underline">
                                ← Retour à la connexion
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

ForgotPassword.layout = (page: ReactNode) => (
    <AuthLayout title="Mot de passe oublié ?" description="Pas de panique, ça arrive à tout le monde.">
        {page}
    </AuthLayout>
);
