export interface Produit {
    id: number;
    nom: string;
    sku: string;
    quantite_stock: number;
}

export interface Camion {
    id: number;
    immatriculation: string;
    marque: string | null;
    modele: string | null;
    capacite_poids: number;
    capacite_volume: number;
    statut: 'disponible' | 'en mission' | 'maintenance';
    notes?: string;
}

export interface Chauffeur {
    id: number;
    nom: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    permis?: string;
    statut: 'disponible' | 'en mission' | 'en_repos';
    notes?: string;
}

export interface ChauffeurNotification {
    id: number;
    chauffeur_id: number;
    type: 'conge_approuve' | 'conge_refuse' | 'expedition_assignee' | 'livraison_validee' | 'livraison_annulee';
    message: string;
    data?: Record<string, unknown> | null;
    read_at: string | null;
    created_at: string;
}

export interface ProduitPivot extends Produit {
    pivot: { quantite: number };
}

export interface LivraisonBrief {
    id: number;
    etat: string;
    commentaire?: string;
    date_statut?: string;
}

export interface Expedition {
    id: number;
    reference: string;
    origine: string;
    destination: string;
    details?: string;
    date_depart: string | null;
    date_arrivee_prevue: string | null;
    statut: 'en préparation' | 'en cours' | 'livraison_soumise' | 'livré' | 'annulé';
    camion: Camion;
    chauffeur: Chauffeur;
    produits: ProduitPivot[];
    livraisons?: LivraisonBrief[];
}

export interface Livraison {
    id: number;
    etat: string;
    commentaire?: string;
    km_reel?: number | null;
    date_statut?: string;
    valide_admin: boolean;
    valide_at?: string | null;
    expedition: Expedition;
}

export interface MaintenanceCamion {
    id: number;
    camion_id: number;
    camion?: Camion;
    type: string;
    description?: string;
    cout: number | null;
    kilometrage?: number | null;
    date_maintenance: string;
    prochaine_maintenance?: string | null;
    statut: 'planifiée' | 'en cours' | 'terminée';
}

export interface Stats {
    camions_disponibles: number;
    camions_en_maintenance: number;
    expeditions_en_cours: number;
    expeditions_en_retard: number;
    livraisons_en_preparation: number;
    livraisons_livrees: number;
    chauffeurs_en_mission: number;
    taux_ponctualite: number | null;
    cout_expeditions: number;
    maintenances_planifiees: number;
    cout_maintenance_annuel: number;
}

export interface CongeChauffeur {
    id: number;
    chauffeur_id: number;
    chauffeur?: Chauffeur;
    date_debut: string;
    date_fin: string;
    type: string;
    motif?: string | null;
    statut: 'en_attente' | 'approuve' | 'refuse';
    commentaire_admin?: string | null;
    created_at?: string;
}

export interface LogistiqueProps {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    camionsDisponibles: Camion[];
    chauffeursDisponibles: Chauffeur[];
    expeditions: Expedition[];
    livraisons: Livraison[];
    livraisonsAValider: Livraison[];
    produits: Produit[];
    retards: Expedition[];
    stats: Stats;
    maintenances: MaintenanceCamion[];
    maintenances_prochaines: MaintenanceCamion[];
}
