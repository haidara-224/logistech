import { Form, Head, router } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import AuthLayout from '@/layouts/auth-layout';

type Props = { status?: string; canResetPassword: boolean; canRegister: boolean };

const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25';

function GoogleButton() {
    return (
        <a href='/auth/google/redirect'  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border border-stone-200 text-slate-700 hover:border-stone-300 hover:shadow-md hover:shadow-stone-100/80 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white/80 dark:hover:bg-white/[0.07] dark:hover:border-white/[0.15] active:scale-[0.98]">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </g>
            </svg>
            Continuer avec Google
        </a>
    );
}

function Divider() {
    return (
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/[0.08]" />
            <span className="text-xs text-slate-400 dark:text-white/25 uppercase tracking-widest font-medium">ou</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-white/[0.08]" />
        </div>
    );
}

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Connexion" />

            {status && (
                <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {status}
                </div>
            )}

            <GoogleButton />
            <Divider />

            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">Adresse email</Label>
                            <Input id="email" type="email" name="email" required autoFocus tabIndex={1} autoComplete="email" placeholder="email@exemple.com" className={inputCls} />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">Mot de passe</Label>
                                {canResetPassword && (
                                    <TextLink href={request()} tabIndex={5} className="text-xs text-[#C8962E] hover:text-[#E8B84B] transition-colors no-underline">
                                        Mot de passe oublié ?
                                    </TextLink>
                                )}
                            </div>
                            <PasswordInput id="password" name="password" required tabIndex={2} autoComplete="current-password" placeholder="••••••••" className={inputCls} />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Checkbox id="remember" name="remember" tabIndex={3}
                                className="border-stone-300 dark:border-white/20 data-[state=checked]:bg-[#C8962E] data-[state=checked]:border-[#C8962E]" />
                            <Label htmlFor="remember" className="text-sm text-slate-600 dark:text-white/50 cursor-pointer">Se souvenir de moi</Label>
                        </div>

                        <button type="submit" tabIndex={4} disabled={processing}
                            className="mt-1 w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}>
                            {processing && <Spinner />}
                            Se connecter
                        </button>

                        {canRegister && (
                            <p className="text-center text-sm text-slate-500 dark:text-white/30">
                                Pas encore de compte ?{' '}
                                <TextLink href={register()} tabIndex={5} className="text-[#C8962E] hover:text-[#E8B84B] transition-colors font-medium no-underline">
                                    Créer un compte
                                </TextLink>
                            </p>
                        )}
                    </>
                )}
            </Form>
        </>
    );
}

// ✅ Layout Inertia = fonction qui reçoit la page et la wrape dans AuthLayout
Login.layout = (page: ReactNode) => (
    <AuthLayout title="Bon retour parmi nous" description="Connectez-vous à votre espace LOGISTECH EQUIP+.">
        {page}
    </AuthLayout>
);