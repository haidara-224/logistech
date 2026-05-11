import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Bell, FileText, Mail, Package, Rss, ShoppingCart, Siren, Truck, Umbrella, X, CheckCheck, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

interface ActivityNotification {
    id: string;
    type: 'devis' | 'contact' | 'newsletter' | 'commande_online' | 'incident' | 'conge' | 'livraison' | 'expedition_demarre' | 'sos';
    message: string;
    data: Record<string, unknown>;
    receivedAt: string;
    read: boolean;
}

const TYPE_CONFIG = {
    devis:              { icon: FileText,      color: 'text-[#C8962E]',  bg: 'bg-[#C8962E]/10',  label: 'Devis',       href: '/dashboard/devis' },
    contact:            { icon: Mail,          color: 'text-blue-500',   bg: 'bg-blue-500/10',   label: 'Contact',     href: '/dashboard/contact' },
    newsletter:         { icon: Rss,           color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Newsletter',  href: '/dashboard/newsletter' },
    commande_online:    { icon: ShoppingCart,  color: 'text-emerald-500',bg: 'bg-emerald-500/10',label: 'Commande',    href: '/dashboard/commandes' },
    incident:           { icon: AlertTriangle, color: 'text-red-500',    bg: 'bg-red-500/10',    label: 'Incident',    href: '/dashboard/hse?tab=incidents' },
    conge:              { icon: Umbrella,      color: 'text-blue-500',   bg: 'bg-blue-500/10',   label: 'Congé',       href: '/dashboard/conges' },
    livraison:          { icon: Package,       color: 'text-amber-500',  bg: 'bg-amber-500/10',  label: 'Livraison',   href: '/dashboard/logistique' },
    expedition_demarre: { icon: Truck,         color: 'text-emerald-500',bg: 'bg-emerald-500/10',label: 'Expédition',  href: '/dashboard/logistique' },
    sos:                { icon: Siren,         color: 'text-red-600',    bg: 'bg-red-600/10',    label: 'SOS',         href: '/dashboard/hse?tab=sos' },
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
    const [open, setOpen] = useState(false);
    const [connected, setConnected] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Load persisted notifications from DB on mount
    useEffect(() => {
        fetch('/dashboard/admin/notifications', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then((r) => r.json())
            .then((rows: Array<{ id: number; type: string; message: string; data: Record<string, unknown>; read_at: string | null; created_at: string }>) => {
                const mapped: ActivityNotification[] = rows.map((row) => ({
                    id: String(row.id),
                    type: row.type as ActivityNotification['type'],
                    message: row.message,
                    data: row.data ?? {},
                    receivedAt: row.created_at,
                    read: row.read_at !== null,
                }));
                setNotifications(mapped);
            })
            .catch(() => {});
    }, []);

    // Subscribe to Reverb for real-time notifications
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.channel('admin-activities');

        channel.listen('.activity', (event: { type: string; message: string; data: Record<string, unknown> }) => {
            const notif: ActivityNotification = {
                id: event.data.notif_id ? String(event.data.notif_id) : crypto.randomUUID(),
                type: event.type as ActivityNotification['type'],
                message: event.message,
                data: event.data,
                receivedAt: new Date().toISOString(),
                read: false,
            };
            setNotifications((prev) => {
                // Avoid duplicate if we already loaded from DB
                if (prev.some((n) => n.id === notif.id)) return prev;
                return [notif, ...prev].slice(0, 50);
            });
        });

        // Detect connection status
        window.Echo.connector?.pusher?.connection?.bind('connected', () => setConnected(true));
        window.Echo.connector?.pusher?.connection?.bind('disconnected', () => setConnected(false));
        window.Echo.connector?.pusher?.connection?.bind('unavailable', () => setConnected(false));

        setConnected(true);

        return () => {
            window.Echo.leaveChannel('admin-activities');
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        fetch('/dashboard/admin/notifications/read-all', {
            method: 'PATCH',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
            },
        }).catch(() => {});
    };

    const dismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const formatTime = (iso: string) => {
        const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
        if (diff < 60) return `${diff}s`;
        if (diff < 3600) return `${Math.floor(diff / 60)}min`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}j`;
    };

    return (
        <div ref={ref} className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setOpen((o) => !o);
                    if (!open && unreadCount > 0) markAllRead();
                }}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
            >
                <Bell className="w-4 h-4" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-11 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-[#C8962E]" />
                                <span className="font-bold text-sm">Activités</span>
                                {notifications.length > 0 && (
                                    <span className="text-[10px] text-muted-foreground">({notifications.length})</span>
                                )}
                            </div>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-[#C8962E] transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
                                    Tout lire
                                </button>
                            )}
                        </div>

                        {/* Notifications list */}
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                    <p className="text-xs text-muted-foreground">Aucune activité récente</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                                        Les nouvelles demandes apparaîtront ici
                                    </p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {notifications.map((notif) => {
                                        const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.contact;
                                        const Icon = config.icon;
                                        const href = notif.type === 'commande_online' && notif.data?.id
                                            ? `/dashboard/commandes/${notif.data.id}`
                                            : config.href;

                                        return (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 group/item ${!notif.read ? 'bg-[#C8962E]/5' : ''}`}
                                            >
                                                <button
                                                    onClick={() => { router.visit(href); setOpen(false); }}
                                                    className="flex items-start gap-3 flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}>
                                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold leading-snug">{notif.message}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className={`text-[10px] font-bold ${config.color}`}>{config.label}</span>
                                                            <span className="text-[10px] text-muted-foreground">{formatTime(notif.receivedAt)}</span>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 mt-1" />
                                                </button>
                                                <button
                                                    onClick={() => dismiss(notif.id)}
                                                    className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2.5 bg-muted/30 border-t border-border">
                            <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                                <span className="text-[10px] text-muted-foreground font-medium">
                                    {connected ? 'Connecté en temps réel' : 'Hors ligne'}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
