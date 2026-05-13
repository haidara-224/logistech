import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Format a number as GNF (no currency symbol, space-separated thousands). */
export const fmtGnf = (n: number | null | undefined): string =>
    new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n ?? 0);

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}
