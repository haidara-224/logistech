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
  images?: string[];
  features: string[];
}

export const SERVICES_DATA: ServiceData[] = [
  {
    id: "charpente",
    icon: HardHat,
    color: "#C8962E",
    title: "Charpente Métallique",
    short: "Structures sur mesure",
    desc: "De la conception à la finition, nous réalisons vos structures métalliques avec précision. Bâtiments industriels, agricoles, commerciaux — chaque charpente est dimensionnée pour durer.",
    img: '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (1).jpeg',
    images: [
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (2).jpeg',
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.34.02 PM (3).jpeg',
      '/LOgistech FRoid/WhatsApp Image 2026-04-28 at 7.34.05 PM.jpeg',
    ],
    features: ["Bâtiments industriels", "Structures agricoles", "Commerce & retail", "Charpentes sur mesure"],
  },
  {
    id: "transport",
    icon: Truck,
    color: "#3B82F6",
    title: "Transport Routier",
    short: "Fret & livraison",
    desc: "Transporteur de fret à l'échelle nationale, régionale et internationale depuis Conakry. Nous adaptons nos solutions aux caractéristiques de vos marchandises.",
    img: '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.37 PM (1).jpeg',
    images: [
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.37 PM.jpeg',
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.34 PM.jpeg',
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.25 PM.jpeg',
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.39 PM (1).jpeg',
    ],
    features: ["Transport national", "Fret international", "Livraison express", "Suivi en temps réel"],
  },
  {
    id: "froid",
    icon: Snowflake,
    color: "#06B6D4",
    title: "Froid Industriel",
    short: "Génie climatique",
    desc: "Installation, ingénierie et maintenance de systèmes frigorifiques. Chambres froides, vitrines réfrigérées, centrales frigorifiques — expertise complète de la chaîne du froid.",
    img: '/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.18 PM.jpeg',
    images: [
      '/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.19 PM.jpeg',
      '/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.20 PM.jpeg',
      '/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.17 PM (1).jpeg',
      '/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.00.49 PM.jpeg',
    ],
    features: ["Chambres froides", "Vitrines réfrigérées", "Maintenance préventive", "Dépannage réactif"],
  },
  {
    id: "batiment",
    icon: Building2,
    color: "#10B981",
    title: "Bâtiment & Construction",
    short: "Génie civil",
    desc: "Développement, conception, construction et rénovation d'ouvrages de toutes natures. Logements neufs, développement immobilier, génie civil — des solutions complètes en Afrique.",
    img: '/LOgistech FRoid/WhatsApp Image 2026-04-28 at 7.34.08 PM (2).jpeg',
    images: [
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.23 PM.jpeg',
      '/Logistech Transport/WhatsApp Image 2026-04-28 at 7.20.24 PM (1).jpeg',
    ],
    features: ["Logements neufs", "Développement immobilier", "Génie civil", "Rénovation"],
  },
  {
    id: "logistique",
    icon: Package,
    color: "#8B5CF6",
    title: "Logistique & Stockage",
    short: "Supply chain",
    desc: "Prestataire de services logistiques et solutions de stockage sur mesure. Acteur majeur du secteur en Afrique, nous optimisons vos flux de marchandises au quotidien.",
    img: "/LOgistech FRoid/WhatsApp Image 2026-04-29 at 12.15.18 PM (1).jpeg",
    features: ["Stockage sur mesure", "Gestion des flux", "Supply chain", "Solutions 360°"],
  },
];

export interface DynamicServiceData {
  images: string[];
  title_fr: string; title_en: string;
  short_fr: string; short_en: string;
  desc_fr: string;  desc_en: string;
  features_fr: string[]; features_en: string[];
}

export function getServicesData(
  t: (key: string, fallback?: string) => string,
  locale?: string,
  dynamicServices?: Record<string, DynamicServiceData>,
): ServiceData[] {
  const lang = locale === 'en' ? 'en' : 'fr';
  return SERVICES_DATA.map(svc => {
    const dyn       = dynamicServices?.[svc.id];
    const dynTitle  = dyn ? (lang === 'fr' ? dyn.title_fr : dyn.title_en) : '';
    const dynShort  = dyn ? (lang === 'fr' ? dyn.short_fr : dyn.short_en) : '';
    const dynDesc   = dyn ? (lang === 'fr' ? dyn.desc_fr  : dyn.desc_en)  : '';
    const dynFeats  = dyn ? (lang === 'fr' ? dyn.features_fr : dyn.features_en).filter(Boolean) : [];
    const dynImages = dyn?.images?.length ? dyn.images : undefined;
    return {
      ...svc,
      title:    dynTitle || t(`svc_${svc.id}_title`, svc.title),
      short:    dynShort || t(`svc_${svc.id}_short`, svc.short),
      desc:     dynDesc  || t(`svc_${svc.id}_desc`,  svc.desc),
      features: dynFeats.length > 0 ? dynFeats : svc.features.map((f, i) => t(`svc_${svc.id}_f${i + 1}`, f)),
      ...(dynImages ? { images: dynImages } : {}),
    };
  });
}
