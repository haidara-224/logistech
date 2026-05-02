import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const PHONE = '224614604444';
const WA_URL = `https://wa.me/${PHONE}?text=Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20vos%20services.`;

export function WhatsAppButton() {
    const [tooltip, setTooltip] = useState(true);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip bubble */}
            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-medium px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 max-w-[200px] leading-snug"
                    >
                        <button
                            onClick={() => setTooltip(false)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <X className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        </button>
                        💬 Discutez avec nous sur WhatsApp !
                        {/* Arrow */}
                        <div className="absolute -bottom-2 right-7 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-800" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main button */}
            <motion.a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTooltip(false)}
                className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
                style={{ background: '#25D366' }}
                aria-label="Contacter via WhatsApp"
            >
                {/* WhatsApp SVG icon */}
                <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.613 4.56 1.693 6.48L2.667 29.333l7.013-1.667A13.267 13.267 0 0 0 16.004 29.333c7.36 0 13.333-5.973 13.333-13.333S23.364 2.667 16.004 2.667Zm7.44 18.72c-.32.88-1.573 1.613-2.56 1.827-.68.147-1.573.267-4.573-1.013-3.84-1.6-6.32-5.507-6.507-5.76-.173-.253-1.453-1.933-1.453-3.68s.92-2.587 1.28-2.96c.32-.333.68-.413.907-.413h.64c.293 0 .547.013.787.587.293.693.933 2.4.987 2.573.067.173.12.4 0 .64-.107.24-.173.387-.347.587-.173.213-.36.467-.52.627-.173.173-.36.36-.16.707.2.347.88 1.453 1.893 2.347 1.307 1.16 2.387 1.52 2.733 1.68.36.173.56.147.773-.08.213-.227.88-1.027 1.12-1.373.227-.347.453-.293.773-.173.32.12 2.027.96 2.373 1.133.347.173.573.267.653.413.08.147.08.84-.24 1.72Z" />
                </svg>

                {/* Pulse ring */}
                <span className="absolute w-14 h-14 rounded-full animate-ping opacity-30" style={{ background: '#25D366' }} />
            </motion.a>
        </div>
    );
}
