import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import { ArrowLeft, Printer, Receipt } from 'lucide-react';

interface Produit { id: number; nom: string; sku: string; prix_vente: number }
interface CommandeItem { id: number; produit: Produit; quantite: number; prix_unitaire: number; prix_total: number }
interface Client { id: number; nom: string; prenom?: string | null; email?: string | null; telephone?: string | null; adresse?: string | null }
interface Commande { id: number; client: Client | null; items: CommandeItem[]; created_at: string }
interface Facture {
    id: number;
    numero_facture: string;
    montant_total: number;
    date_emission: string | null;
    created_at: string;
    commande: Commande;
}

interface Props { facture: Facture }

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

export default function FactureShow({ facture }: Props) {
    const isPrint = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('print') === '1';

    useEffect(() => {
        if (isPrint) {
            setTimeout(() => window.print(), 600);
        }
    }, []);

    const client = facture.commande?.client;
    const clientName = client ? `${client.nom}${client.prenom ? ' ' + client.prenom : ''}` : 'Client anonyme';

    return (
        <>
            <Head title={`Facture ${facture.numero_facture}`} />

            {/* Screen-only toolbar */}
            <div className="print:hidden px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <Link
                    href="/dashboard/factures"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour aux factures
                </Link>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8962E] text-white text-sm font-semibold hover:bg-[#b07a20] transition-colors"
                >
                    <Printer className="w-4 h-4" />
                    Imprimer / PDF
                </button>
            </div>

            {/* Invoice */}
            <div className="max-w-3xl mx-auto px-6 py-10 print:py-0 print:px-0">
                {/* Header */}
                <div className="flex items-start justify-between mb-10 pb-8 border-b-2 border-[#C8962E]">
                    <div>
                        <h1 className="text-3xl font-black text-[#C8962E] tracking-tight">LOGISTECH</h1>
                        <p className="text-sm text-gray-500 mt-1">Système de gestion intégré</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-[#C8962E] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            Facture
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono">{facture.numero_facture}</p>
                        <p className="text-sm text-gray-500 mt-1">Émise le {fmtDate(facture.date_emission)}</p>
                    </div>
                </div>

                {/* Client */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Facturé à</p>
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{clientName}</p>
                        {client?.email && (
                            <p className="text-sm text-gray-500 mt-1">{client.email}</p>
                        )}
                        {client?.telephone && (
                            <p className="text-sm text-gray-500">{client.telephone}</p>
                        )}
                        {client?.adresse && (
                            <p className="text-sm text-gray-500">{client.adresse}</p>
                        )}
                        {facture.commande && (
                            <p className="text-xs text-gray-400 mt-2">Commande #{facture.commande.id}</p>
                        )}
                    </div>
                </div>

                {/* Items */}
                <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Détail de la commande</p>
                    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produit</th>
                                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Qté</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prix unit.</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {(facture.commande?.items ?? []).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <p className="font-medium text-gray-900 dark:text-white">{item.produit.nom}</p>
                                            <p className="text-xs text-gray-400 font-mono">{item.produit.sku}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-center text-gray-600 dark:text-gray-400">{item.quantite}</td>
                                        <td className="px-5 py-3.5 text-right text-gray-600 dark:text-gray-400">{fmtGnf(item.prix_unitaire)}</td>
                                        <td className="px-5 py-3.5 text-right font-semibold text-gray-900 dark:text-white">{fmtGnf(item.prix_total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-amber-50 dark:bg-[#C8962E]/10">
                                    <td colSpan={3} className="px-5 py-4 text-right font-bold text-gray-900 dark:text-white">Total à payer</td>
                                    <td className="px-5 py-4 text-right font-black text-xl text-[#C8962E]">{fmtGnf(facture.montant_total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Receipt className="w-4 h-4 text-[#C8962E]" />
                        <span className="font-semibold text-gray-500 dark:text-gray-400">LOGISTECH</span>
                    </div>
                    <p>Merci pour votre confiance — Facture générée automatiquement</p>
                </div>
            </div>
        </>
    );
}
