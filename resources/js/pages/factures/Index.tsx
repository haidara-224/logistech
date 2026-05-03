import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, TrendingUp, Calendar, DollarSign,
    Search, Printer, Eye, ChevronLeft, ChevronRight,
    Download, Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

interface Client { id: number; nom: string; prenom?: string | null }
interface Commande { id: number; client: Client | null }
interface Facture {
    id: number;
    numero_facture: string;
    montant_total: number;
    date_emission: string | null;
    created_at: string;
    commande: Commande | null;
}

const clientName = (facture: Facture): string => {
    const c = facture.commande?.client;
    if (!c) { return 'Client anonyme'; }
    return `${c.nom}${c.prenom ? ' ' + c.prenom : ''}`;
};

interface PaginatedFactures {
    data: Facture[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    total_factures: number;
    montant_total: number;
    ce_mois: number;
    montant_mois: number;
}

interface Props {
    factures: PaginatedFactures;
    stats: Stats;
}

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

function printFacture(facture: Facture) {
    const name = clientName(facture);
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Facture ${facture.numero_facture}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #C8962E; }
  .company { }
  .company h1 { font-size: 28px; font-weight: 800; color: #C8962E; letter-spacing: -0.5px; }
  .company p { font-size: 13px; color: #666; margin-top: 4px; }
  .invoice-meta { text-align: right; }
  .invoice-meta .number { font-size: 22px; font-weight: 700; color: #1a1a1a; }
  .invoice-meta .date { font-size: 13px; color: #666; margin-top: 4px; }
  .badge { display: inline-block; background: #C8962E; color: white; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
  .section { margin-bottom: 32px; }
  .section h3 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 10px; }
  .client-box { background: #f9f9f9; border: 1px solid #e5e5e5; border-radius: 10px; padding: 16px 20px; }
  .client-box .name { font-size: 18px; font-weight: 700; }
  .client-box .ref { font-size: 13px; color: #666; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #f3f4f6; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; padding: 10px 14px; text-align: left; border-bottom: 1px solid #e5e7eb; }
  td { padding: 12px 14px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
  .total-row { background: #fff7ed; }
  .total-row td { font-weight: 700; font-size: 16px; color: #C8962E; border-bottom: none; }
  .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #aaa; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <div class="header">
    <div class="company">
      <h1>LOGISTECH</h1>
      <p>Système de gestion intégré</p>
    </div>
    <div class="invoice-meta">
      <div class="badge">Facture</div>
      <div class="number">${facture.numero_facture}</div>
      <div class="date">Émise le ${fmtDate(facture.date_emission)}</div>
    </div>
  </div>

  <div class="section">
    <h3>Facturé à</h3>
    <div class="client-box">
      <div class="name">${name}</div>
      <div class="ref">${facture.commande ? 'Commande #' + facture.commande.id : ''}</div>
    </div>
  </div>

  <div class="section">
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right">Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${facture.commande ? 'Commande #' + facture.commande.id + ' — Montant total' : 'Montant total'}</td>
          <td style="text-align:right">${fmtGnf(facture.montant_total)}</td>
        </tr>
        <tr class="total-row">
          <td>Total à payer</td>
          <td style="text-align:right">${fmtGnf(facture.montant_total)}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Merci pour votre confiance — LOGISTECH &bull; Facture générée automatiquement</p>
  </div>
</body>
</html>`;

    const win = window.open('', '_blank', 'width=900,height=700,scrollbars=yes');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
}

export default function FacturesIndex({ factures, stats }: Props) {
    const { flash } = usePage().props as any;
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const filtered = factures.data.filter((f) => {
        const q = search.toLowerCase();
        if (!q) { return true; }
        const name = clientName(f).toLowerCase();
        return f.numero_facture.toLowerCase().includes(q) || name.includes(q);
    });

    const handlePage = (page: number) => {
        router.get('/dashboard/factures', { page }, { preserveState: true });
    };

    const statCards = [
        {
            label: 'Total factures',
            value: stats.total_factures,
            icon: Receipt,
            color: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300',
        },
        {
            label: 'Montant total',
            value: fmtGnf(stats.montant_total),
            icon: DollarSign,
            color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
        },
        {
            label: 'Ce mois',
            value: stats.ce_mois,
            icon: Calendar,
            color: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300',
        },
        {
            label: 'CA ce mois',
            value: fmtGnf(stats.montant_mois),
            icon: TrendingUp,
            color: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300',
        },
    ];

    return (
        <>
            <Head title="Factures" />

            <div className="px-6 py-6 space-y-6">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-linear-to-br from-[#C8962E] to-[#E8B84B]">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Factures</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Toutes les factures générées automatiquement</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {statCards.map((s, i) => (
                        <motion.div key={s.label} whileHover={{ y: -2 }} transition={{ delay: i * 0.04 }}
                            className={`rounded-2xl p-5 border ${s.color}`}>
                            <div className="flex items-center justify-between mb-2">
                                <s.icon className="w-5 h-5 opacity-70" />
                            </div>
                            <p className="text-2xl font-black">{s.value}</p>
                            <p className="text-sm font-medium opacity-70 mt-0.5">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par numéro ou client…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:border-[#C8962E] focus:outline-none focus:ring-2 focus:ring-[#C8962E]/20 transition-all"
                        />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{factures.total} facture{factures.total !== 1 ? 's' : ''}</p>
                </motion.div>

                {/* Table */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° Facture</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Commande</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Montant</th>
                                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                <AnimatePresence>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center">
                                                <FileText className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Aucune facture trouvée</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((facture, i) => {
                                            return (
                                                <motion.tr
                                                    key={facture.id}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.03 }}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors group"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-[#C8962E]/10 flex items-center justify-center shrink-0">
                                                                <Receipt className="w-4 h-4 text-[#C8962E]" />
                                                            </div>
                                                            <span className="font-semibold text-gray-900 dark:text-white font-mono text-xs">
                                                                {facture.numero_facture}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{clientName(facture)}</td>
                                                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400">
                                                        {facture.commande ? (
                                                            <Link
                                                                href={`/dashboard/commandes/${facture.commande.id}`}
                                                                className="inline-flex items-center gap-1 text-[#C8962E] hover:underline"
                                                            >
                                                                #{facture.commande.id}
                                                            </Link>
                                                        ) : '—'}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className="font-bold text-gray-900 dark:text-white">
                                                            {fmtGnf(facture.montant_total)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                                        {fmtDate(facture.date_emission)}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                href={`/dashboard/factures/${facture.id}`}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                                Voir
                                                            </Link>
                                                            <button
                                                                onClick={() => printFacture(facture)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C8962E]/10 border border-[#C8962E]/20 text-xs font-medium text-[#C8962E] hover:bg-[#C8962E]/20 transition-colors"
                                                            >
                                                                <Printer className="w-3.5 h-3.5" />
                                                                Imprimer
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {factures.last_page > 1 && (
                        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Page {factures.current_page} sur {factures.last_page} — {factures.total} factures
                            </p>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handlePage(factures.current_page - 1)}
                                    disabled={factures.current_page === 1}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handlePage(factures.current_page + 1)}
                                    disabled={factures.current_page === factures.last_page}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

