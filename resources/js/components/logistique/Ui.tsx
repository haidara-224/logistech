import { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Search } from 'lucide-react';

// ── ThemedInput ────────────────────────────────────────────────────────────────
interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}
export function ThemedInput({ label, error, className = '', ...props }: ThemedInputProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 ${className}`}
            />
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
        </div>
    );
}

// ── ThemedSelect ───────────────────────────────────────────────────────────────
interface ThemedSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    children: ReactNode;
}
export function ThemedSelect({ label, children, error, className = '', ...props }: ThemedSelectProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                </label>
            )}
            <select
                {...props}
                className={`w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 cursor-pointer ${className}`}
            >
                {children}
            </select>
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
        </div>
    );
}

// ── ThemedTextarea ─────────────────────────────────────────────────────────────
interface ThemedTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}
export function ThemedTextarea({ label, ...props }: ThemedTextareaProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {label}
                </label>
            )}
            <textarea
                {...props}
                className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 resize-none"
            />
        </div>
    );
}

// ── Button ─────────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}
export function Button({ children, disabled, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
    const variants: Record<ButtonVariant, string> = {
        primary:   'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
        danger:    'bg-destructive text-destructive-foreground border border-destructive/20 hover:bg-destructive/90',
        ghost:     'text-muted-foreground hover:text-foreground hover:bg-muted',
        outline:   'border border-border text-foreground/60 hover:border-ring hover:text-foreground bg-transparent',
    };
    const sizes: Record<ButtonSize, string> = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
        lg: 'px-6 py-3 text-base rounded-xl gap-2',
    };

    return (
        <button
            {...props}
            disabled={disabled}
            className={`font-semibold tracking-tight transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}

// ── StatusBadge ──────────────────────────────────────────────────────────────
type StatusKey =
    | 'disponible' | 'en mission' | 'maintenance' | 'repos' | 'en_repos'
    | 'en cours' | 'en préparation' | 'livré' | 'annulé';

const STATUS_CONFIG: Record<StatusKey, { color: string; bg: string; label: string }> = {
    disponible:        { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', label: 'Disponible' },
    'en mission':      { color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10',   label: 'En mission' },
    maintenance:       { color: 'text-red-600 dark:text-red-400',        bg: 'bg-red-50 dark:bg-red-500/10',       label: 'Maintenance' },
    repos:             { color: 'text-slate-600 dark:text-slate-400',    bg: 'bg-slate-100 dark:bg-slate-500/10',  label: 'En repos' },
    en_repos:          { color: 'text-slate-600 dark:text-slate-400',    bg: 'bg-slate-100 dark:bg-slate-500/10',  label: 'En repos' },
    'en cours':        { color: 'text-blue-600 dark:text-blue-400',      bg: 'bg-blue-50 dark:bg-blue-500/10',     label: 'En cours' },
    'en préparation':  { color: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-500/10',   label: 'En préparation' },
    livré:             { color: 'text-violet-600 dark:text-violet-400',   bg: 'bg-violet-50 dark:bg-violet-500/10', label: 'Livré' },
    annulé:            { color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-500/10',       label: 'Annulé' },
};

export function StatusBadge({ status }: { status: string }) {
    const config = STATUS_CONFIG[status as StatusKey];
    if (!config) {
        return (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap bg-muted text-muted-foreground border border-border">
                {status}
            </span>
        );
    }
    return (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap border border-current/20 ${config.color} ${config.bg}`}>
            {config.label}
        </span>
    );
}

// ── Panel ────────────────────────────────────────────────────────────────────
interface PanelProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}
export function Panel({ title, subtitle, children, action, className = '' }: PanelProps) {
    return (
        <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}>
            {(title || action) && (
                <div className="flex items-start justify-between mb-5">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">{title}</h2>
                        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
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
                    className="rounded-2xl border border-border bg-card p-6 shadow-xl"
                >
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h3 className="text-base font-semibold text-foreground">{title}</h3>
                            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer"
                        >
                            <X size={14} className="text-muted-foreground" />
                        </button>
                    </div>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ message = 'Aucune donnée', icon }: { message?: string; icon?: ReactNode }) {
    return (
        <div className="text-center py-12">
            {icon && <div className="text-muted-foreground/40 mb-3">{icon}</div>}
            <p className="text-sm text-muted-foreground/50">{message}</p>
        </div>
    );
}

// ── FilterBar ────────────────────────────────────────────────────────────────
interface FilterOption {
    value: string;
    label: string;
}
interface FilterBarProps {
    search: string;
    onSearch: (v: string) => void;
    filterValue: string;
    onFilter: (v: string) => void;
    filterOptions: FilterOption[];
    placeholder?: string;
    filterLabel?: string;
}
export function FilterBar({ 
    search, 
    onSearch, 
    filterValue, 
    onFilter, 
    filterOptions, 
    placeholder = 'Rechercher…', 
    filterLabel = 'Statut' 
}: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                    type="text"
                    value={search}
                    onChange={e => onSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200"
                />
            </div>
            <select
                value={filterValue}
                onChange={e => onFilter(e.target.value)}
                className="px-3.5 py-2 text-sm bg-card border border-border rounded-xl text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all duration-200 cursor-pointer min-w-[140px]"
                aria-label={filterLabel}
            >
                {filterOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    );
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
    page: number;
    totalPages: number;
    onPage: (p: number) => void;
    total: number;
    perPage: number;
}
export function Pagination({ page, totalPages, onPage, total, perPage }: PaginationProps) {
    if (totalPages <= 1) return null;
    
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (page >= totalPages - 3) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
                {from}–{to} sur {total}
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                >
                    <ChevronLeft size={14} />
                </button>

                {getPageNumbers().map((p, idx) => (
                    p === '...' ? (
                        <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPage(p as number)}
                            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer
                                ${p === page
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            {p}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}

// Export des anciens noms pour compatibilité
export const DarkInput = ThemedInput;
export const DarkSelect = ThemedSelect;
export const DarkTextarea = ThemedTextarea;
export const PrimaryButton = Button;