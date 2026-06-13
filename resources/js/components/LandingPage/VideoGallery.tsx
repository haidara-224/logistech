import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface Video {
    id: string;
    src: string;
    title: string;
    category: string;
}

const videos: Video[] = [
    {
        id: 'img-5497',
        src: '/Video/IMG_5497.mp4',
        title: 'Opérations Logistiques',
        category: 'Transport',
    },
    {
        id: 'img-5791',
        src: '/Video/IMG_5791.mp4',
        title: 'Infrastructure Frigorifique',
        category: 'Froid Industriel',
    },
    {
        id: 'video-main',
        src: '/Video/video.mp4',
        title: 'Charpente Métallique',
        category: 'Bâtiment',
    },
];

interface VideoCardProps {
    video: Video;
    index: number;
}

function VideoCard({ video, index }: VideoCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(true);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setPlaying(true);
        } else {
            v.pause();
            setPlaying(false);
        }
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !v.muted;
        setMuted(v.muted);
    };

    const handleFullscreen = () => {
        if (videoRef.current?.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="group h-full"
        >
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
                {/* Video */}
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                >
                    <source src={video.src} type="video/mp4" />
                </video>

                {/* Glow on hover */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(200,150,46,0.2) 0%, transparent 70%)',
                    }}
                />

                {/* Overlay */}
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none ${
                        playing ? 'opacity-0 group-hover:opacity-20' : 'opacity-0 group-hover:opacity-30'
                    }`}
                />

                {/* Play button (center) - visible quand pas en lecture */}
                {!playing && (
                    <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Play"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/60 backdrop-blur-sm"
                            style={{ background: 'rgba(200,150,46,0.9)' }}
                        >
                            <Play className="w-6 h-6 text-white ml-1" fill="white" />
                        </motion.div>
                    </button>
                )}

                {/* Controls bottom */}
                <div
                    className={`absolute bottom-0 left-0 right-0 p-3 transition-opacity duration-300 z-20 ${
                        playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
                >
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <button
                                onClick={togglePlay}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                                aria-label={playing ? 'Pause' : 'Play'}
                            >
                                {playing ? (
                                    <Pause className="w-4 h-4 text-white" fill="white" />
                                ) : (
                                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                )}
                            </button>
                            <button
                                onClick={toggleMute}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                                aria-label={muted ? 'Unmute' : 'Mute'}
                            >
                                {muted ? (
                                    <VolumeX className="w-4 h-4 text-white" />
                                ) : (
                                    <Volume2 className="w-4 h-4 text-white" />
                                )}
                            </button>
                            <span className="text-white/60 text-xs font-medium truncate">{video.title}</span>
                        </div>
                        <button
                            onClick={handleFullscreen}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                            aria-label="Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function VideoGallery() {
    return (
        <section className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-[#0a0e27]">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-0 right-1/3 w-200 h-100 rounded-full blur-[120px] opacity-5 dark:opacity-15"
                    style={{ background: 'radial-gradient(circle, #C8962E 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-100 h-100 rounded-full blur-[100px] opacity-5 dark:opacity-10"
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
                        Notre portfolio vidéo
                    </span>
                    <h2
                        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Explorez nos <span className="text-[#C8962E]">réalisations</span>
                    </h2>
                    <p className="text-gray-600 dark:text-white/60 text-sm sm:text-base max-w-xl mx-auto">
                        Découvrez en vidéo nos projets et notre expertise dans tous les domaines.
                    </p>
                </motion.div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {videos.map((video, idx) => (
                        <VideoCard key={video.id} video={video} index={idx} />
                    ))}
                </div>
            </div>

            {/* Ligne décorative basse */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#C8962E]/20 to-transparent" />
        </section>
    );
}
