import { usePage } from '@inertiajs/react';

type Translations = Record<string, string>;

export function useTranslation() {
    const { translations, locale } = usePage().props as {
        translations: Translations;
        locale: string;
        [key: string]: unknown;
    };

    function t(key: string, fallback?: string): string {
        return translations?.[key] ?? fallback ?? key;
    }

    return { t, locale };
}
