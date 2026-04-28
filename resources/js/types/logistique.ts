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
}

export interface Chauffeur {
    id: number;
    nom: string;
    prenom?: string;
    telephone?: string;
    email?: string;
    permis?: string;
    statut: 'disponible' | 'en mission' | 'repos';
}

export interface ProduitPivot extends Produit {
    pivot: { quantite: number };
}

export interface Expedition {
    id: number;
    reference: string;
    origine: string;
    destination: string;
    date_depart: string | null;
    date_arrivee_prevue: string | null;
    statut: 'en préparation' | 'en cours' | 'livré' | 'annulé';
    camion: Camion;
    chauffeur: Chauffeur;
    produits: ProduitPivot[];
}

export interface Livraison {
    id: number;
    etat: string;
    commentaire?: string;
    date_statut?: string;
    expedition: Expedition;
}

export interface Stats {
    camions_disponibles: number;
    expeditions_en_cours: number;
    livraisons_en_preparation: number;
    livraisons_livrees: number;
    chauffeurs_en_mission: number;
}

export interface LogistiqueProps {
    camions: Camion[];
    chauffeurs: Chauffeur[];
    camionsDisponibles: Camion[];
    chauffeursDisponibles: Chauffeur[];
    expeditions: Expedition[];
    livraisons: Livraison[];
    produits: Produit[];
    stats: Stats;
}