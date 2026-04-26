import {
  HardHat,
  Truck,
  Snowflake,
  Building2,
  Package,
  type LucideIcon,
} from "lucide-react";

export type ServiceId = "charpente" | "transport" | "froid" | "batiment" | "logistique";

export interface ServiceData {
  id: ServiceId;
  icon: LucideIcon;  
  color: string;
  title: string;
  short: string;
  desc: string;
  img: string;
  features: string[];
}

export const SERVICES_DATA: ServiceData[] = [
  {
    id: "charpente",
    icon: HardHat,  // ← minuscule
    color: "#C8962E",
    title: "Charpente Métallique",
    short: "Structures sur mesure",
    desc: "De la conception à la finition, nous réalisons vos structures métalliques avec précision. Bâtiments industriels, agricoles, commerciaux — chaque charpente est dimensionnée pour durer.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    features: ["Bâtiments industriels", "Structures agricoles", "Commerce & retail", "Charpentes sur mesure"],
  },
  {
    id: "transport",
    icon: Truck,
    color: "#3B82F6",
    title: "Transport Routier",
    short: "Fret & livraison",
    desc: "Transporteur de fret à l'échelle nationale, régionale et internationale depuis Conakry. Nous adaptons nos solutions aux caractéristiques de vos marchandises.",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
    features: ["Transport national", "Fret international", "Livraison express", "Suivi en temps réel"],
  },
  {
    id: "froid",
    icon: Snowflake,
    color: "#06B6D4",
    title: "Froid Industriel",
    short: "Génie climatique",
    desc: "Installation, ingénierie et maintenance de systèmes frigorifiques. Chambres froides, vitrines réfrigérées, centrales frigorifiques — expertise complète de la chaîne du froid.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    features: ["Chambres froides", "Vitrines réfrigérées", "Maintenance préventive", "Dépannage réactif"],
  },
  {
    id: "batiment",
    icon: Building2,
    color: "#10B981",
    title: "Bâtiment & Construction",
    short: "Génie civil",
    desc: "Développement, conception, construction et rénovation d'ouvrages de toutes natures. Logements neufs, développement immobilier, génie civil — des solutions complètes en Afrique.",
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    features: ["Logements neufs", "Développement immobilier", "Génie civil", "Rénovation"],
  },
  {
    id: "logistique",
    icon: Package,
    color: "#8B5CF6",
    title: "Logistique & Stockage",
    short: "Supply chain",
    desc: "Prestataire de services logistiques et solutions de stockage sur mesure. Acteur majeur du secteur en Afrique, nous optimisons vos flux de marchandises au quotidien.",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    features: ["Stockage sur mesure", "Gestion des flux", "Supply chain", "Solutions 360°"],
  },
];