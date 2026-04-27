import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardProps } from '../types';

interface Props {
    data: DashboardProps;
}

type ExportFormat = 'pdf' | 'excel';

export function ExportButton({ data }: Props) {
    const [loading, setLoading] = useState<ExportFormat | null>(null);

    // ── Excel export (CSV via data URI) ────────────────────────────────────
    const exportExcel = async () => {
        setLoading('excel');
        await new Promise((r) => setTimeout(r, 600));

        const rows: string[][] = [];

        // Section: Métriques
        rows.push(['=== MÉTRIQUES GÉNÉRALES ===']);
        rows.push(['Indicateur', 'Valeur']);
        rows.push(['Ventes 30j (GNF)', String(data.metrics.total_sales_30d)]);
        rows.push(['Commandes 30j', String(data.metrics.orders_30d)]);
        rows.push(["Commandes aujourd'hui", String(data.metrics.orders_today)]);
        rows.push(['Produits en rupture', String(data.metrics.low_stock_count)]);
        rows.push([]);

        // Section: Ventes par jour
        rows.push(['=== VENTES PAR JOUR ===']);
        rows.push(['Date', 'Montant (GNF)']);
        data.sales_chart.labels.forEach((label, i) => {
            rows.push([label, String(data.sales_chart.data[i])]);
        });
        rows.push([]);

        // Section: Top produits
        rows.push(['=== TOP PRODUITS ===']);
        rows.push(['Rang', 'Nom', 'SKU', 'Quantité vendue']);
        data.top_products.forEach((p, i) => {
            rows.push([String(i + 1), p.nom ?? '', p.sku ?? '', String(p.qty)]);
        });
        rows.push([]);

        // Section: Stock critique
        rows.push(['=== STOCK CRITIQUE ===']);
        rows.push(['Produit', 'SKU', 'Stock réel', 'Stock minimal', 'Écart']);
        data.low_stock.forEach((item) => {
            rows.push([
                item.nom,
                item.sku,
                String(item.stock_reel),
                String(item.stock_minimal),
                String(item.stock_reel - item.stock_minimal),
            ]);
        });

        const csvContent = rows
            .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        setLoading(null);
    };

    // ── PDF export (print window) ────────────────────────────────────────────
    const exportPDF = async () => {
        setLoading('pdf');
        await new Promise((r) => setTimeout(r, 600));

        const fmt = (n: number) =>
            new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'GNF',
                maximumFractionDigits: 0,
            }).format(n);

        const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Rapport Dashboard — ${new Date().toLocaleDateString('fr-FR')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #fff; color: #111; padding: 40px; }
  h1 { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
  .subtitle { color: #64748b; font-size: 13px; margin-top: 4px; margin-bottom: 32px; }
  .section { margin-bottom: 32px; }
  .section-title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
  .metric-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
  .metric-value { font-size: 22px; font-weight: 900; color: #0f172a; margin-top: 6px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #f1f5f9; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; text-align: left; color: #64748b; }
  td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-orange { background: #ffedd5; color: #ea580c; }
  .badge-amber { background: #fef3c7; color: #d97706; }
  .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>📦 Rapport Stock &amp; Ventes</h1>
<p class="subtitle">Généré le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — Période : 30 derniers jours</p>

<div class="section">
  <div class="section-title">📊 Indicateurs Clés</div>
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Ventes 30j</div>
      <div class="metric-value">${fmt(data.metrics.total_sales_30d)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Commandes 30j</div>
      <div class="metric-value">${data.metrics.orders_30d}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Commandes Aujourd'hui</div>
      <div class="metric-value">${data.metrics.orders_today}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Stock Critique</div>
      <div class="metric-value" style="color:#dc2626">${data.metrics.low_stock_count}</div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">🏆 Top 5 Produits</div>
  <table>
    <thead><tr><th>#</th><th>Produit</th><th>SKU</th><th>Quantité vendue</th></tr></thead>
    <tbody>
      ${data.top_products
          .map(
              (p, i) => `
        <tr>
          <td style="font-weight:900;color:#f59e0b">${i + 1}</td>
          <td style="font-weight:600">${p.nom ?? '—'}</td>
          <td style="font-family:monospace;color:#64748b">${p.sku ?? '—'}</td>
          <td style="font-weight:700">${p.qty} unités</td>
        </tr>
      `,
          )
          .join('')}
    </tbody>
  </table>
</div>

<div class="section">
  <div class="section-title">⚠️ Produits en Stock Critique</div>
  ${
      data.low_stock.length === 0
          ? '<p style="color:#64748b;font-size:13px">Aucun produit en rupture ou sous le seuil minimal.</p>'
          : `<table>
    <thead><tr><th>Produit</th><th>SKU</th><th>Stock Réel</th><th>Minimum</th><th>Statut</th></tr></thead>
    <tbody>
      ${data.low_stock
          .map((item) => {
              let badgeClass = 'badge-amber';
              let label = 'Faible';
              if (item.stock_reel === 0) { badgeClass = 'badge-red'; label = 'Rupture'; }
              else if (item.stock_minimal > 0 && item.stock_reel / item.stock_minimal <= 0.5) { badgeClass = 'badge-orange'; label = 'Critique'; }
              return `
          <tr>
            <td style="font-weight:600">${item.nom}</td>
            <td style="font-family:monospace;color:#64748b">${item.sku}</td>
            <td style="font-weight:900;color:#dc2626">${item.stock_reel}</td>
            <td>${item.stock_minimal}</td>
            <td><span class="badge ${badgeClass}">${label}</span></td>
          </tr>
        `;
          })
          .join('')}
    </tbody>
  </table>`
  }
</div>

<div class="section">
  <div class="section-title">📈 Ventes Journalières</div>
  <table>
    <thead><tr><th>Date</th><th>Montant (GNF)</th></tr></thead>
    <tbody>
      ${data.sales_chart.labels
          .map(
              (label, i) => `
        <tr>
          <td style="font-family:monospace">${label}</td>
          <td style="font-weight:600">${fmt(data.sales_chart.data[i])}</td>
        </tr>
      `,
          )
          .join('')}
    </tbody>
  </table>
</div>

<div class="footer">Rapport généré automatiquement — Stock Manager v1.0</div>
</body>
</html>`;

        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) { setLoading(null); return; }
        win.document.write(html);
        win.document.close();
        win.onload = () => {
            setTimeout(() => { win.print(); setLoading(null); }, 300);
        };
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white gap-2 font-semibold"
                    disabled={loading !== null}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                            <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Export en cours…
                            </motion.span>
                        ) : (
                            <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exporter
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-zinc-900 border-zinc-800 text-zinc-200 w-48"
            >
                <DropdownMenuLabel className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Format
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                    className="gap-2 hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white"
                    onClick={exportPDF}
                >
                    <FileText className="w-4 h-4 text-red-400" />
                    Rapport PDF
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="gap-2 hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white"
                    onClick={exportExcel}
                >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Export Excel (CSV)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}