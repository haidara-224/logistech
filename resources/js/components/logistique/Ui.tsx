import { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ── DarkInput ────────────────────────────────────────────────────────────────
interface DarkInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}
export function DarkInput({ label, error, className = '', ...props }: DarkInputProps) {
    return (
        <div className="grid gap-1.5">
            {label && (
                <label className="text-[12px] font-medium text-white/40 uppercase tracking-widest">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder:text-white/20
                    outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200 ${className}`}
            />
            {error && <p className="text-[12px] text-red-400 mt-0.5">{error}</p>}
        </div>
    );
}

// ── DarkSelect ───────────────────────────────────────────────────────────────
interface DarkSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
}
export function DarkSelect({ label, children, error, className = '', ...props }: DarkSelectProps) {
    return (
        <div className="grid gap-1.5">
            {label && (
                <label className="text-[12px] font-medium text-white/40 uppercase tracking-widest">
                    {label}
                </label>
            )}
            <select
                {...props}
                className={`w-full bg-[#141416] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[14px] text-white
                    outline-none focus:border-white/20 transition-all duration-200 cursor-pointer ${className}`}
            >
                {children}
            </select>
            {error && <p className="text-[12px] text-red-400 mt-0.5">{error}</p>}
        </div>
    );
}

// ── DarkTextarea ─────────────────────────────────────────────────────────────
interface DarkTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}
export function DarkTextarea({ label, ...props }: DarkTextareaProps) {
    return (
        <div className="grid gap-1.5">
            {label && (
                <label className="text-[12px] font-medium text-white/40 uppercase tracking-widest">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-[14px] text-white placeholder:text-white/20
                    outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all duration-200 resize-none"
            />
        </div>
    );
}

// ── PrimaryButton ────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}
export function PrimaryButton({ children, disabled, variant = 'primary', size = 'md', className = '', ...props }: PrimaryButtonProps) {
    const variants: Record<ButtonVariant, string> = {
        primary:   'bg-white text-black hover:bg-white/90',
        secondary: 'bg-white/[0.06] text-white/80 border border-white/[0.08] hover:bg-white/[0.1] hover:text-white',
        danger:    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        ghost:     'text-white/40 hover:text-white hover:bg-white/[0.05]',
        outline:   'border border-white/[0.08] text-white/60 hover:border-white/20 hover:text-white',
    };
    const sizes: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-[12px] rounded-lg',
        md: 'px-4 py-2.5 text-[13px] rounded-xl',
        lg: 'px-6 py-3 text-[14px] rounded-xl',
    };

    return (
        <button
            {...props}
            disabled={disabled}
            className={`font-semibold tracking-tight transition-all duration-200 flex items-center gap-2 cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]
                ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
type StatusKey =
    | 'disponible' | 'en mission' | 'maintenance' | 'repos'
    | 'en cours' | 'en préparation' | 'livré' | 'annulé';

const STATUS_MAP: Record<StatusKey, { color: string; bg: string; label: string }> = {
    disponible:        { color: '#10B981', bg: 'rgba(16,185,129,0.12)',  label: 'Disponible' },
    'en mission':      { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'En mission' },
    maintenance:       { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  label: 'Maintenance' },
    repos:             { color: '#6B7280', bg: 'rgba(107,114,128,0.12)',label: 'Repos' },
    'en cours':        { color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', label: 'En cours' },
    'en préparation':  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'En préparation' },
    livré:             { color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', label: 'Livré' },
    annulé:            { color: '#EF4444', bg: 'rgba(239,68,68,0.12)',  label: 'Annulé' },
};

export function StatusBadge({ status }: { status: string }) {
    const s = STATUS_MAP[status as StatusKey] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.12)', label: status };
    return (
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap"
            style={{ color: s.color, background: s.bg }}>
            {s.label}
        </span>
    );
}

// ── Panel ────────────────────────────────────────────────────────────────────
interface PanelProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    action?: ReactNode;
}
export function Panel({ title, subtitle, children, action }: PanelProps) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            {(title || action) && (
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-[15px] font-semibold text-white">{title}</h2>
                        {subtitle && <p className="text-[12px] text-white/30 mt-0.5">{subtitle}</p>}
                    </div>
                    {action}
                </div>
            )}
            {children}
        </div>
    );
}

// ── DrawerPanel ──────────────────────────────────────────────────────────────
interface DrawerPanelProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
}
export function DrawerPanel({ open, onClose, title, subtitle, children }: DrawerPanelProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl border border-white/[0.1] bg-[#111113] p-6"
                    style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}
                >
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h3 className="text-[15px] font-semibold text-white">{title}</h3>
                            {subtitle && <p className="text-[12px] text-white/30 mt-0.5">{subtitle}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors cursor-pointer"
                        >
                            <X size={14} className="text-white/60" />
                        </button>
                    </div>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ message = 'Aucune donnée' }: { message?: string }) {
    return (
        <div className="text-center py-12 text-white/20 text-[13px]">{message}</div>
    );
}