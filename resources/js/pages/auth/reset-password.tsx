import { KeyRound } from 'lucide-react';
import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/password-input';
import { Spinner } from '@/components/ui/spinner';

const inputCls = 'h-11 rounded-xl px-4 text-sm bg-stone-100 border-stone-300 text-slate-900 placeholder:text-slate-400 focus:border-[#C8962E] focus:ring-2 focus:ring-[#C8962E]/20 dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white dark:placeholder:text-white/25 dark:focus:border-[#C8962E] dark:focus:ring-[#C8962E]/20';

type ResetProps = { token: string; email: string };

export default function ResetPassword({ token, email }: ResetProps) {
    return (
        <>
            <Head title="Nouveau mot de passe" />

            <Form 
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Adresse email
                            </Label>
                            <Input 
                                id="email" 
                                type="email" 
                                name="email" 
                                autoComplete="email" 
                                value={email} 
                                readOnly
                                className="h-11 rounded-xl px-4 text-sm cursor-not-allowed bg-stone-200 border-stone-300 text-slate-400 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/30" 
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Nouveau mot de passe
                            </Label>
                            <PasswordInput 
                                id="password" 
                                name="password" 
                                autoComplete="new-password" 
                                autoFocus 
                                placeholder="••••••••" 
                                className={inputCls} 
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs uppercase tracking-widest font-medium text-slate-500 dark:text-white/40">
                                Confirmer le mot de passe
                            </Label>
                            <PasswordInput 
                                id="password_confirmation" 
                                name="password_confirmation" 
                                autoComplete="new-password" 
                                placeholder="••••••••" 
                                className={inputCls} 
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="mt-1 w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)', boxShadow: '0 8px 30px rgba(200,150,46,0.35)' }}
                        >
                            {processing && <Spinner />}
                            <KeyRound size={15} /> Réinitialiser
                        </button>
                    </>
                )}
            </Form>
        </>
    );
}


ResetPassword.layout = {
    title: 'Nouveau mot de passe',
    description: 'Choisissez un nouveau mot de passe sécurisé pour votre compte.',
};