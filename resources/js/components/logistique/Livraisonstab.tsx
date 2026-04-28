import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Clock, Loader, XCircle } from 'lucide-react';
import { DarkInput, DarkSelect, DarkTextarea, PrimaryButton, Panel, EmptyState } from './Ui';

const stateConfig = {
    'livré': { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Livré' },
    'en cours': { icon: Loader, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'En cours' },
    'en préparation': { icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'En préparation' },
    'annulé': { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Annulé' },
};

type Etat = keyof typeof stateConfig;

interface Livraison {
    id: number;
    etat: Etat;
    expedition?: { reference?: string };
    date_statut?: string;
    commentaire?: string;
}

function LivraisonEntry({ livraison, index }: { livraison: Livraison; index: number }) {
    const cfg = stateConfig[livraison.etat] ?? stateConfig['en préparation'];
    const Icon = cfg.icon;
    const isLast = false;

    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4"
        >
            {/* Timeline line */}
            <div className="flex flex-col items-center flex-shrink-0">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border"
                    style={{ background: cfg.bg, borderColor: cfg.color + '33' }}
                >
                    <Icon size={14} style={{ color: cfg.color }} />
                </div>
                <div className="w-px flex-1 mt-2 bg-white/[0.06] min-h-[1rem]" />
            </div>

            {/* Content */}
            <div className="pb-5 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                        <span className="text-[14px] font-semibold text-white">
                            {livraison.expedition?.reference ?? 'Réf. inconnue'}
                        </span>
                        <span
                            className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ color: cfg.color, background: cfg.bg }}
                        >
                            {cfg.label}
                        </span>
                    </div>
                    <span className="text-[11px] text-white/25 flex-shrink-0">
                        {livraison.date_statut
                            ? new Date(livraison.date_statut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                            : '—'}
                    </span>
                </div>
                {livraison.commentaire && (
                    <p className="text-[13px] text-white/40 leading-relaxed">{livraison.commentaire}</p>
                )}
            </div>
        </motion.div>
    );
}

interface Expedition {
    id: number;
    reference?: string;
}

interface LivraisonsTabProps {
    livraisons: Livraison[];
    expeditions: Expedition[];
}

export default function LivraisonsTab({ livraisons, expeditions }: LivraisonsTabProps) {
    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
            {/* Timeline history */}
            <Panel title="Historique des livraisons" subtitle="Journal chronologique des états">
                {livraisons.length === 0 ? (
                    <EmptyState message="Aucune livraison enregistrée" />
                ) : (
                    <div className="mt-2">
                        {livraisons.map((l, i) => (
                            <LivraisonEntry key={l.id} livraison={l} index={i} />
                        ))}
                    </div>
                )}
            </Panel>

            {/* New delivery state form */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="rounded-2xl border border-white/[0.1] bg-[#111113] p-6"
                style={{ boxShadow: '0 0 40px rgba(0,0,0,0.3)' }}
            >
                <div className="mb-5">
                    <h3 className="text-[15px] font-semibold text-white">Nouvel état de livraison</h3>
                    <p className="text-[12px] text-white/30 mt-0.5">Enregistrez une mise à jour pour une expédition</p>
                </div>

                <Form method="post" action="/logistique/livraisons" className="space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <DarkSelect name="expedition_id" label="Expédition" error={errors.expedition_id}>
                                {expeditions.length === 0
                                    ? <option value="">Aucune expédition disponible</option>
                                    : expeditions.map(e => <option key={e.id} value={e.id}>{e.reference}</option>)
                                }
                            </DarkSelect>

                            <DarkSelect name="etat" label="État" error={errors.etat}>
                                <option value="en préparation">En préparation</option>
                                <option value="en cours">En cours</option>
                                <option value="livré">Livré</option>
                            </DarkSelect>

                            <DarkInput name="date_statut" label="Date & heure" type="datetime-local" error={errors.date_statut} />

                            <DarkTextarea
                                name="commentaire"
                                label="Commentaire"
                                rows={4}
                                placeholder="Retard, problème de livraison, consigne particulière…"
                            />

                            <PrimaryButton type="submit" disabled={processing} className="w-full justify-center">
                                <Package size={14} />
                                Enregistrer l'état
                            </PrimaryButton>
                        </>
                    )}
                </Form>
            </motion.div>
        </div>
    );
}