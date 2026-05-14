import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export function VideoShowcase() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { amount: 0.4, once: false });

    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);
    const [started, setStarted] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        if (isInView && !started) {
            v.muted = true;
            v.play().then(() => { setPlaying(true); setStarted(true); }).catch(() => {});
        }
        if (!isInView && playing) {
            v.pause();
            setPlaying(false);
        }
    }, [isInView]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) { v.play(); setPlaying(true); }
        else { v.pause(); setPlaying(false); }
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
    };

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || !v.duration) return;
        setProgress((v.currentTime / v.duration) * 100);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const v = videoRef.current;
        if (!v) return;
        const rect = e.currentTarget.getBoundingClientRect();
        v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
    };

    const handleFullscreen = () => {
        if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
    };

    return (
        <section
            ref={sectionRef}
            className="relative py-20 sm:py-28 overflow-hidden bg-[#F9F7F3] dark:bg-[#07101F]"
        >
            {/* Ambient glow — visible surtout en dark */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 rounded-full blur-[120px] opacity-10 dark:opacity-20"
                    style={{ background: 'radial-gradient(circle, #C8962E 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 right-0 w-100 h-100 rounded-full blur-[100px] opacity-5 dark:opacity-10"
                    style={{ background: 'radial-gradient(circle, #C8962E 0%, transparent 70%)' }}
                />
            </div>

            {/* Ligne décorative haute */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C8962E]/20 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8962E]/10 border border-[#C8962E]/30 text-[#C8962E] text-xs font-semibold uppercase tracking-widest mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8962E] animate-pulse" />
                        Notre activité en images
                    </span>
                    <h2
                        className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Découvrez{' '}
                        <span className="text-[#C8962E]">Logistech Équip+</span>
                        <br className="hidden sm:block" /> en action
                    </h2>
                    <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base max-w-xl mx-auto">
                        Transport, logistique frigorifique, charpente métallique et bien plus — tout ce que nous faisons, dans une seule vidéo.
                    </p>
                </motion.div>

                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                    className="relative group max-w-sm mx-auto"
                >
                    {/* Glow border */}
                    <div
                        className="absolute -inset-px rounded-2xl sm:rounded-3xl pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, #C8962E40, transparent 40%, #C8962E20 80%)' }}
                    />

                    <div
                        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-xl dark:shadow-2xl"
                        style={{ boxShadow: '0 20px 60px rgba(200,150,46,0.12)' }}
                    >
                        {/* Video */}
                        <video
                            ref={videoRef}
                            className="w-full aspect-9/16 object-cover"
                            loop
                            playsInline
                            muted
                            onTimeUpdate={handleTimeUpdate}
                        >
                            <source src="/Video/video.mp4" type="video/mp4" />
                            <source src="/Video/video.MOV" type="video/quicktime" />
                        </video>

                        {/* Overlay */}
                        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`} />

                        {/* Bouton play central */}
                        <button
                            onClick={togglePlay}
                            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                            aria-label={playing ? 'Pause' : 'Lecture'}
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-white/40 backdrop-blur-md"
                                style={{ background: 'rgba(200,150,46,0.85)' }}
                            >
                                {playing
                                    ? <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="white" />
                                    : <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="white" />
                                }
                            </motion.div>
                        </button>

                        {/* Contrôles bas */}
                        <div
                            className={`absolute bottom-0 left-0 right-0 p-4 sm:p-5 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                        >
                            <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={handleSeek}>
                                <div
                                    className="h-full rounded-full transition-all duration-100"
                                    style={{ width: `${progress}%`, background: '#C8962E' }}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        {playing
                                            ? <Pause className="w-3.5 h-3.5 text-white" fill="white" />
                                            : <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                                        }
                                    </button>
                                    <button onClick={toggleMute} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        {muted
                                            ? <VolumeX className="w-3.5 h-3.5 text-white" />
                                            : <Volume2 className="w-3.5 h-3.5 text-white" />
                                        }
                                    </button>
                                    <span className="text-white/60 text-xs hidden sm:inline">
                                        {muted ? 'Son désactivé — cliquez pour activer' : 'Son activé'}
                                    </span>
                                </div>
                                <button onClick={handleFullscreen} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-3 mt-10"
                >
                    {['Transport & Logistique', 'Froid Industriel', 'Charpente Métallique', 'Bâtiment & Génie Civil'].map((label) => (
                        <span
                            key={label}
                            className="px-4 py-1.5 rounded-full bg-gray-900/5 dark:bg-white/5 border border-gray-900/10 dark:border-white/10 text-gray-500 dark:text-white/50 text-xs font-medium"
                        >
                            {label}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Ligne décorative basse */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C8962E]/20 to-transparent" />
        </section>
    );
}
