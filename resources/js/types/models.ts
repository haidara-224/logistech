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
  source?: 'commande' | 'vente' | 'ajustement' | null;
  commande_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  produit?: Produit;
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
  stock_reel?: number; // appended attribute from Eloquent accessor
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

export interface Commande {
  id: number;
  client_id: number;
  user_id?: number | null;
  status?: 'en_attente' | 'payer' | 'annulee' | 'livree' | string | null;
  montant_total?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  client?: Client;
  items?: CommandeItem[];
}

export interface Paiement {
  id: number;
  commande_id: number;
  montant: number;
  mode_paiement?: 'espece' | 'carte_bancaire' | 'mobile_money' | string | null;
  status?: 'en_attente' | 'effectue' | 'annule' | string | null;
  date_paiement?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  commande?: Commande;
}

export interface Facture {
  id: number;
  commande_id: number;
  numero_facture?: string | null;
  date_emission?: string | null;
  montant_total?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  commande?: Commande;
}

// Generic Image model (empty server model); keep minimal shape if used
export interface Image {
  id: number;
  image_path?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
