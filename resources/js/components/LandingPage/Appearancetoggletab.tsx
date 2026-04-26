import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun, ChevronDown, Check } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useState, useRef, useEffect } from 'react';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppearanceToggleTab({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun,     label: 'Clair'   },
        { value: 'dark',  icon: Moon,    label: 'Sombre'  },
        { value: 'system',icon: Monitor, label: 'Système' },
    ];

    const current = tabs.find(t => t.value === appearance) ?? tabs[2];

    /* fermer en cliquant dehors */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className={cn('relative inline-block', className)} {...props}>
            {/* ── Trigger ─────────────────────────────────────────────── */}
            <button
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium',
                    'border transition-all duration-200 select-none',
                    /* light */
                    'bg-white border-neutral-200 text-neutral-700',
                    'hover:bg-neutral-50 hover:border-neutral-300',
                    /* dark */
                    'dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200',
                    'dark:hover:bg-neutral-700 dark:hover:border-neutral-600',
                    /* focus ring */
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    'focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500',
                    'dark:focus-visible:ring-offset-neutral-900',
                )}
            >
                <current.icon className="h-4 w-4 shrink-0" />
                <span>{current.label}</span>
                <ChevronDown
                    className={cn(
                        'h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500',
                        'transition-transform duration-200',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {/* ── Dropdown ─────────────────────────────────────────────── */}
            {open && (
                <div
                    role="listbox"
                    aria-label="Apparence"
                    className={cn(
                        'absolute right-0 z-50 mt-1.5 w-36 rounded-xl py-1',
                        'border shadow-lg',
                        /* light */
                        'bg-white border-neutral-200 shadow-neutral-200/60',
                        /* dark */
                        'dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-black/40',
                        /* animation — Tailwind JIT classes */
                        'animate-in fade-in-0 zoom-in-95 duration-150',
                    )}
                >
                    {tabs.map(({ value, icon: Icon, label }) => {
                        const selected = appearance === value;
                        return (
                            <button
                                key={value}
                                role="option"
                                aria-selected={selected}
                                onClick={() => { updateAppearance(value); setOpen(false); }}
                                className={cn(
                                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                                    /* light — idle */
                                    'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                                    /* dark — idle */
                                    'dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100',
                                    /* selected */
                                    selected && [
                                        'font-medium',
                                        'text-neutral-900 bg-neutral-100',
                                        'dark:text-white dark:bg-neutral-700/60',
                                    ],
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">{label}</span>
                                {selected && (
                                    <Check className="h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}