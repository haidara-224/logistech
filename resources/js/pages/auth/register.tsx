import { Form, Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import AuthLayout from '@/layouts/auth-layout';
const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25';
const labelCls = 'text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40';

export default function Register() {
    return (
        <>
            <Head title="Créer un compte" />

            {/* Google */}
            <a href='/auth/google/redirect'  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-white border border-stone-200 text-slate-700 hover:border-stone-300 hover:shadow-md dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white/80 dark:hover:bg-white/[0.07] dark:hover:border-white/[0.15] active:scale-[0.98]">
                <svg width="18" height="18" viewBox="0 0 18 18">
                    <g fill="none">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.048 17.64 11.74 17.64 9z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </g>
                </svg>
                Continuer avec Google
            </a>

            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-stone-200 dark:bg-white/[0.08]" />
                <span className="text-xs text-slate-400 dark:text-white/25 uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-stone-200 dark:bg-white/[0.08]" />
            </div>

            <Form {...store.form()} resetOnSuccess={['password','password_confirmation']} disableWhileProcessing className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="name" className={labelCls}>Nom complet</Label>
                            <Input id="name" type="text" name="name" required autoFocus tabIndex={1} autoComplete="name" placeholder="Mamadou Diallo" className={inputCls} />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className={labelCls}>Adresse email</Label>
                            <Input id="email" type="email" name="email" required tabIndex={2} autoComplete="email" placeholder="email@exemple.com" className={inputCls} />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className={labelCls}>Mot de passe</Label>
                            <PasswordInput id="password" name="password" required tabIndex={3} autoComplete="new-password" placeholder="••••••••" className={inputCls} />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation" className={labelCls}>Confirmer le mot de passe</Label>
                            <PasswordInput id="password_confirmation" name="password_confirmation" required tabIndex={4} autoComplete="new-password" placeholder="••••••••" className={inputCls} />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <button type="submit" tabIndex={5} disabled={processing}
                            className="mt-1 w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}>
                            {processing && <Spinner />}
                            Créer mon compte
                        </button>

                        <p className="text-center text-sm text-slate-500 dark:text-white/30">
                            Déjà inscrit ?{' '}
                            <TextLink href={login()} tabIndex={6} className="text-[#C8962E] hover:text-[#E8B84B] transition-colors font-medium no-underline">
                                Se connecter
                            </TextLink>
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

// ✅ Layout Inertia = fonction
Register.layout = (page: ReactNode) => (
    <AuthLayout title="Créer un compte" description="Rejoignez LOGISTECH EQUIP+ et accédez à votre espace client.">
        {page}
    </AuthLayout>
);