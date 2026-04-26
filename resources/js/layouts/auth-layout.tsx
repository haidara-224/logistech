import { HardHat } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children:     ReactNode;
    title:        string;
    description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex bg-stone-50 dark:bg-[#060D1A]">

         
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#060D1A]/95 via-[#0B1628]/80 to-[#060D1A]/70" />
                <div className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 30% 70%,rgba(200,150,46,0.12) 0%,transparent 60%)' }} />
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(rgba(200,150,46,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(200,150,46,0.6) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
                {/* Ligne or droite */}
                <div className="absolute top-0 right-0 w-px h-full opacity-20"
                    style={{ background: 'linear-gradient(180deg,transparent,#C8962E 30%,#C8962E 70%,transparent)' }} />

                {/* Logo haut */}
                <div className="relative z-10 p-12">
                    <a href="/" className="inline-flex items-center gap-3 group">
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}>
                                 <img 
                                    src="/logo.jpeg" 
                                    alt="LOGISTECH EQUIP+" 
                                    className="w-full h-full object-cover rounded-xl"
                                />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm tracking-wider leading-none">LOGISTECH</p>
                            <p className="text-[#C8962E] text-xs tracking-[0.3em] font-light">EQUIP+</p>
                        </div>
                    </a>
                </div>

                {/* Contenu bas */}
                <div className="relative z-10 p-12">
                    <div className="w-10 h-1 rounded-full mb-6"
                        style={{ background: 'linear-gradient(90deg,#C8962E,#E8B84B)' }} />
                    <p style={{ fontFamily: "'Cormorant Garamond',serif" }}
                        className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                        L'excellence industrielle<br />
                        <span className="text-[#C8962E]">à votre service.</span>
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-8">
                        Charpentes métalliques, transport, froid industriel et construction — depuis Conakry.
                    </p>
                    <div className="flex gap-8 pt-6 border-t border-white/10">
                        {[['5+','Années'],['200+','Projets'],['50+','Clients']].map(([val, label]) => (
                            <div key={label}>
                                <p className="text-[#C8962E] text-2xl font-bold"
                                    style={{ fontFamily: "'Cormorant Garamond',serif" }}>{val}</p>
                                <p className="text-white/30 text-xs uppercase tracking-widest mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                Panneau droit — formulaire
            ══════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
                {/* Logo mobile */}
                <div className="lg:hidden mb-10">
                    <a href="/" className="inline-flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#C8962E,#E8B84B)' }}>
                            <HardHat size={20} className="text-black" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-wider leading-none text-slate-900 dark:text-white">LOGISTECH</p>
                            <p className="text-[#C8962E] text-xs tracking-[0.3em] font-light">EQUIP+</p>
                        </div>
                    </a>
                </div>

                <div className="w-full max-w-md">
                    {/* En-tête page */}
                    <div className="mb-8">
                        <div className="w-8 h-0.5 mb-4 rounded-full"
                            style={{ background: 'linear-gradient(90deg,#C8962E,#E8B84B)' }} />
                        <h1 style={{ fontFamily: "'Cormorant Garamond',serif" }}
                            className="text-3xl xl:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>

                <p className="mt-10 text-xs text-slate-400 dark:text-white/20">
                    © {new Date().getFullYear()} LOGISTECH EQUIP+ · Conakry, Guinée
                </p>
            </div>
        </div>
    );
}