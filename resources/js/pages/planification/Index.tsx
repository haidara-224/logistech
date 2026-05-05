import { Head } from '@inertiajs/react';
import VisualisationTab from '@/components/logistique/Visualisationtab';
import { Camion, Chauffeur, Expedition } from '@/types/logistique';

interface Props {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    expeditions: Expedition[];
}

export default function PlanificationIndex({ camions, chauffeurs, expeditions }: Props) {
    return (
        <>
            <Head title="Planification" />
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Planification</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gantt des expéditions et arbre de flotte
                        </p>
                    </div>
                    <VisualisationTab
                        camions={camions}
                        chauffeurs={chauffeurs}
                        expeditions={expeditions}
                    />
                </div>
            </div>
        </>
    );
}

PlanificationIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Planification', href: '/dashboard/planification' },
    ],
};
