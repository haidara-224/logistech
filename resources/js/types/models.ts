//models.ts
export type MovementType = 'entree' | 'sortie';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Categorie {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  produits?: Produit[];
}

export interface ImageProduit {
  id: number;
  produit_id: number;
  image_id: number;
  created_at?: string | null;
  updated_at?: string | null;
  produit?: Produit;
  image?: Image;
}

export interface MouvementsStock {
  id: number;
  produit_id: number;
  type: MovementType;
  quantite: number;
  source?: 'commande' | 'vente' | 'ajustement' | 'achat' | 'transfert' | 'bon_sortie' | string | null;
  commande_id?: number | null;
  depot_id?: number | null;
  transfert_id?: number | null;
  achat_id?: number | null;
  bon_sortie_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  produit?: Produit;
  user?: User;
}

export interface Produit {
  id: number;
  nom: string;
  sku?: string | null;
  description?: string | null;
  prix_vente?: number | null;
  prix_achat?: number | null;
  quantite_stock?: number | null;
  stock_minimal?: number | null;
  categorie_id?: number | null;
  stock_reel?: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  categorie?: Categorie | null;
  mouvements?: MouvementsStock[];
  images?: ImageProduit[];
}

export interface Client {
  id: number;
  nom: string;
  prenom?: string | null;
  quartier?: string | null;
  piece?: string | null;
  email?: string | null;
  telephone?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  commandes?: Commande[];
}

export interface CommandeItem {
  id: number;
  commande_id: number;
  produit_id: number;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  created_at?: string | null;
  updated_at?: string | null;
  produit?: Produit;
  commande?: Commande;
}

export interface BonLivraison {
  id: number;
  commande_id: number;
  numero_bl: string;
  statut: 'brouillon' | 'emis' | 'livre';
  date_emission?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  commande?: Commande;
}

export interface Commande {
  id: number;
  client_id: number;
  user_id?: number | null;
  status?: 'en_attente' | 'payer' | 'annulee' | 'livree' | string | null;
  montant_total?: number | null;
  frais_transport?: number | null;
  droits_douane?: number | null;
  montant_total_avec_frais?: number | null;
  notes?: string | null;
  source?: 'online' | 'pos' | string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  client?: Client;
  items?: CommandeItem[];
  factures?: Facture[];
  bon_livraison?: BonLivraison | null;
  paiements?: Paiement[];
}

export interface Paiement {
  id: number;
  commande_id: number;
  facture_id?: number | null;
  montant: number;
  mode_paiement?: 'espece' | 'carte_bancaire' | 'mobile_money' | string | null;
  status?: 'en_attente' | 'effectue' | 'annule' | string | null;
  date_paiement?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  commande?: Commande;
  facture?: Facture;
}

export interface Facture {
  id: number;
  commande_id?: number | null;
  achat_id?: number | null;
  numero_facture?: string | null;
  type?: 'vente' | 'achat' | string | null;
  statut?: 'brouillon' | 'emise' | 'payee' | string | null;
  date_emission?: string | null;
  montant_total?: number | null;
  frais_transport?: number | null;
  droits_douane?: number | null;
  montant_total_avec_frais?: number | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  commande?: Commande;
  achat?: Achat | null;
  paiements?: Paiement[];
}

export interface Fournisseur {
  id: number;
  nom: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AchatItem {
  id: number;
  achat_id: number;
  produit_id: number;
  quantite: number;
  prix_achat_unitaire: number;
  prix_total: number;
  ancien_prix_achat?: number | null;
  nouveau_prix_moyen?: number | null;
  prix_vente_nouveau?: number | null;
  produit?: Produit;
}

export interface BonSortieItem {
  id: number;
  bon_sortie_id: number;
  produit_id: number;
  quantite: number;
  created_at?: string | null;
  updated_at?: string | null;
  produit?: Produit;
}

export interface BonSortie {
  id: number;
  user_id?: number | null;
  depot_id?: number | null;
  numero_bs: string;
  statut?: 'brouillon' | 'valide' | 'annule' | string | null;
  date_emission?: string | null;
  motif?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  user?: User;
  depot?: Depot;
  items?: BonSortieItem[];
}

export interface BonReception {
  id: number;
  achat_id: number;
  numero_br: string;
  statut?: 'emis' | 'recu' | string | null;
  date_emission?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  achat?: Achat;
}

export interface Achat {
  id: number;
  fournisseur_id?: number | null;
  user_id?: number | null;
  numero_achat?: string | null;
  statut?: 'brouillon' | 'valide' | 'annule' | string | null;
  montant_total?: number | null;
  frais_transport?: number | null;
  droits_douane?: number | null;
  notes?: string | null;
  date_achat?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  montant_total_avec_frais?: number | null;
  fournisseur?: Fournisseur;
  items?: AchatItem[];
  facture?: Facture | null;
  bon_reception?: BonReception | null;
}

export interface Depot {
  id: number;
  nom: string;
  adresse?: string | null;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface TransfertItem {
  id: number;
  transfert_id: number;
  produit_id: number;
  quantite: number;
  produit?: Produit;
}

export interface TransfertDepot {
  id: number;
  depot_source_id: number;
  depot_destination_id: number;
  user_id?: number | null;
  numero_transfert?: string | null;
  statut?: 'en_cours' | 'complete' | 'annule' | string | null;
  notes?: string | null;
  date_transfert?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  depot_source?: Depot;
  depot_destination?: Depot;
  items?: TransfertItem[];
}

// Generic Image model
export interface Image {
  id: number;
  image_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProduitFormData {
  nom: string;
  sku?: string;
  description?: string;
  prix_vente?: number;
  prix_achat?: number;
  quantite_stock?: number;
  stock_minimal?: number;
  categorie_id?: number;
}
