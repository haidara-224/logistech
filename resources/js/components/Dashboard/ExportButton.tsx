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
import { DashboardProps } from '@/types';

interface Props {
    data: DashboardProps;
}

type ExportFormat = 'pdf' | 'excel';

const fmtGnf = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', maximumFractionDigits: 0 }).format(n);

const STATUS_LABELS: Record<string, string> = {
    en_attente: 'En attente',
    payer:      'Payé',
    livree:     'Livré',
    annulee:    'Annulé',
};

export function ExportButton({ data }: Props) {
    const [loading, setLoading] = useState<ExportFormat | null>(null);

    // ── Excel / CSV ──────────────────────────────────────────────────────────
    const exportExcel = async () => {
        setLoading('excel');
        await new Promise((r) => setTimeout(r, 600));

        const rows: string[][] = [];

        // ── Métriques générales
        rows.push(['=== MÉTRIQUES GÉNÉRALES ===']);
        rows.push(['Indicateur', 'Valeur']);
        rows.push(['Ventes 30j (GNF)',       String(data.metrics.total_sales_30d)]);
        rows.push(["Ventes Aujourd'hui (GNF)", String(data.metrics.sales_today)]);
        rows.push(['Ventes Ce Mois (GNF)',    String(data.metrics.sales_month)]);
        rows.push(['Panier Moyen (GNF)',      String(data.metrics.avg_basket ?? 0)]);
        rows.push(['Commandes 30j',           String(data.metrics.orders_30d)]);
        rows.push(["Commandes Aujourd'hui",   String(data.metrics.orders_today)]);
        rows.push(['Produits en rupture',     String(data.metrics.low_stock_count)]);
        rows.push([]);

        // ── Statuts des commandes
        if (data.status_counts && Object.keys(data.status_counts).length > 0) {
            rows.push(['=== STATUTS DES COMMANDES ===']);
            rows.push(['Statut', 'Nombre']);
            Object.entries(data.status_counts).forEach(([key, val]) => {
                rows.push([STATUS_LABELS[key] ?? key, String(val)]);
            });
            rows.push([]);
        }

        // ── Répartition par source
        if (data.source_breakdown && Object.keys(data.source_breakdown).length > 0) {
            rows.push(['=== RÉPARTITION PAR SOURCE ===']);
            rows.push(['Source', 'Montant (GNF)', 'Nombre de commandes']);
            Object.entries(data.source_breakdown).forEach(([src, v]) => {
                rows.push([
                    src === 'online' ? 'En ligne' : src === 'pos' ? 'Point de vente' : src,
                    String(v.total),
                    String(v.count),
                ]);
            });
            rows.push([]);
        }

        // ── Ventes journalières (total + online + pos)
        rows.push(['=== VENTES JOURNALIÈRES ===']);
        const hasOnline = data.sales_chart.data_online?.length > 0;
        const hasPos    = data.sales_chart.data_pos?.length > 0;
        const header = ['Date', 'Total (GNF)'];
        if (hasOnline) header.push('En ligne (GNF)');
        if (hasPos)    header.push('POS (GNF)');
        if (data.sales_chart.order_counts?.length) header.push('Nb Commandes');
        rows.push(header);

        data.sales_chart.labels.forEach((label, i) => {
            const row = [label, String(data.sales_chart.data[i])];
            if (hasOnline) row.push(String(data.sales_chart.data_online[i] ?? 0));
            if (hasPos)    row.push(String(data.sales_chart.data_pos[i] ?? 0));
            if (data.sales_chart.order_counts?.length) row.push(String(data.sales_chart.order_counts[i] ?? 0));
            rows.push(row);
        });
        rows.push([]);

        // ── Top produits
        rows.push(['=== TOP 5 PRODUITS ===']);
        rows.push(['Rang', 'Nom', 'SKU', 'Quantité vendue', 'CA (GNF)']);
        data.top_products.forEach((p, i) => {
            rows.push([
                String(i + 1),
                p.nom ?? '',
                p.sku ?? '',
                String(p.qty),
                String(p.revenue ?? 0),
            ]);
        });
        rows.push([]);

        // ── Stock critique
        rows.push(['=== STOCK CRITIQUE ===']);
        rows.push(['Produit', 'SKU', 'Stock réel', 'Stock minimal', 'Écart', 'Statut']);
        data.low_stock.forEach((item) => {
            const ecart = item.stock_reel - item.stock_minimal;
            let statut = 'Faible';
            if (item.stock_reel === 0) statut = 'Rupture';
            else if (item.stock_minimal > 0 && item.stock_reel / item.stock_minimal <= 0.5) statut = 'Critique';
            rows.push([
                item.nom, item.sku,
                String(item.stock_reel), String(item.stock_minimal),
                String(ecart), statut,
            ]);
        });
        rows.push([]);

        // ── Commandes récentes (page courante)
        if (data.recent_orders?.data?.length) {
            rows.push(['=== COMMANDES RÉCENTES ===']);
            rows.push(['#', 'Client', 'Statut', 'Source', 'Montant (GNF)', 'Date']);
            data.recent_orders.data.forEach((o) => {
                rows.push([
                    String(o.id),
                    o.client,
                    STATUS_LABELS[o.status] ?? o.status,
                    o.source === 'online' ? 'En ligne' : o.source === 'pos' ? 'POS' : o.source ?? '—',
                    String(o.montant),
                    o.created_at,
                ]);
            });
        }

        const csvContent = rows
            .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setLoading(null);
    };

    // ── PDF ──────────────────────────────────────────────────────────────────
    const exportPDF = async () => {
        setLoading('pdf');
        await new Promise((r) => setTimeout(r, 600));

        const today = new Date().toLocaleDateString('fr-FR', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        });

        // Build status pills HTML
        const statusPillsHtml = data.status_counts
            ? Object.entries(data.status_counts).map(([key, val]) => {
                const colors: Record<string, string> = {
                    en_attente: '#f59e0b', payer: '#10b981', livree: '#38bdf8', annulee: '#f87171',
                };
                const c = colors[key] ?? '#94a3b8';
                return `<div class="pill" style="border-color:${c}20;background:${c}12">
                  <span class="dot" style="background:${c}"></span>
                  <div>
                    <div class="pill-label">${STATUS_LABELS[key] ?? key}</div>
                    <div class="pill-val" style="color:${c}">${val}</div>
                  </div>
                </div>`;
              }).join('')
            : '';

        // Build source breakdown HTML
        const sourceHtml = data.source_breakdown
            ? Object.entries(data.source_breakdown).map(([src, v]) => {
                const color = src === 'online' ? '#38bdf8' : '#a78bfa';
                const label = src === 'online' ? 'En ligne' : src === 'pos' ? 'POS' : src;
                const grand = Object.values(data.source_breakdown!).reduce((a, b) => a + b.total, 0) || 1;
                const pct   = Math.round((v.total / grand) * 100);
                return `<div class="source-card">
                  <div class="source-label" style="color:${color}">${label}</div>
                  <div class="source-pct" style="color:${color}">${pct}%</div>
                  <div class="source-bar-bg"><div class="source-bar" style="width:${pct}%;background:${color}"></div></div>
                  <div class="source-sub">${fmtGnf(v.total)} — ${v.count} commandes</div>
                </div>`;
              }).join('')
            : '';

        // Build daily sales rows
        const dailyRows = data.sales_chart.labels.map((label, i) => {
            const online = data.sales_chart.data_online?.[i] ?? 0;
            const pos    = data.sales_chart.data_pos?.[i] ?? 0;
            const orders = data.sales_chart.order_counts?.[i] ?? 0;
            return `<tr>
              <td style="font-family:monospace;color:#64748b">${label}</td>
              <td style="font-weight:700">${fmtGnf(data.sales_chart.data[i])}</td>
              <td style="color:#38bdf8">${fmtGnf(online)}</td>
              <td style="color:#a78bfa">${fmtGnf(pos)}</td>
              <td style="text-align:center">${orders}</td>
            </tr>`;
        }).join('');

        // Build recent orders rows
        const recentOrdersHtml = data.recent_orders?.data?.length
            ? `<div class="section">
                <div class="section-title">🕐 Commandes Récentes</div>
                <table>
                  <thead><tr><th>#</th><th>Client</th><th>Statut</th><th>Source</th><th style="text-align:right">Montant</th><th>Date</th></tr></thead>
                  <tbody>
                    ${data.recent_orders.data.map((o) => {
                        const sc: Record<string, string> = {
                            en_attente: '#f59e0b', payer: '#10b981', livree: '#38bdf8', annulee: '#f87171',
                        };
                        const c = sc[o.status] ?? '#94a3b8';
                        return `<tr>
                          <td style="font-family:monospace;color:#64748b">#${o.id}</td>
                          <td style="font-weight:600">${o.client || '—'}</td>
                          <td><span class="badge" style="background:${c}18;color:${c};border:1px solid ${c}30">${STATUS_LABELS[o.status] ?? o.status}</span></td>
                          <td style="color:#64748b">${o.source === 'online' ? '🌐 En ligne' : o.source === 'pos' ? '🖥 POS' : '—'}</td>
                          <td style="text-align:right;font-weight:700">${fmtGnf(o.montant)}</td>
                          <td style="font-family:monospace;font-size:11px;color:#94a3b8">${o.created_at}</td>
                        </tr>`;
                    }).join('')}
                  </tbody>
                </table>
               </div>`
            : '';

        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<title>Rapport Dashboard — ${new Date().toLocaleDateString('fr-FR')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #fff; color: #111; padding: 40px; font-size: 13px; }
  h1  { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; }
  .subtitle { color: #64748b; font-size: 12px; margin-top: 4px; margin-bottom: 32px; }
  .section  { margin-bottom: 28px; }
  .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 7px; margin-bottom: 14px; }

  /* Metrics grid */
  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .metric-card  { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
  .metric-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; }
  .metric-value { font-size: 19px; font-weight: 900; color: #0f172a; margin-top: 5px; }

  /* Status pills */
  .pills { display: flex; flex-wrap: wrap; gap: 10px; }
  .pill  { display: flex; align-items: center; gap: 8px; border: 1px solid; border-radius: 10px; padding: 10px 14px; }
  .dot   { width: 8px; height: 8px; border-radius: 50%; shrink: 0; }
  .pill-label { font-size: 10px; color: #64748b; text-transform: capitalize; }
  .pill-val   { font-size: 18px; font-weight: 900; }

  /* Source breakdown */
  .sources { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .source-card  { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
  .source-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .source-pct   { font-size: 24px; font-weight: 900; margin: 4px 0; }
  .source-bar-bg{ height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-bottom: 6px; }
  .source-bar   { height: 100%; border-radius: 99px; }
  .source-sub   { font-size: 11px; color: #64748b; }

  /* Table */
  table { width: 100%; border-collapse: collapse; }
  th { background: #f1f5f9; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; padding: 9px 11px; text-align: left; color: #64748b; }
  td { padding: 9px 11px; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tr:last-child td { border-bottom: none; }

  /* Badge */
  .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }

  .footer { margin-top: 36px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; }
  @media print { body { padding: 20px; } @page { margin: 15mm; } }
</style>
</head>
<body>

<h1>📦 Rapport Stock &amp; Ventes</h1>
<p class="subtitle">Généré le ${today} · Période : 30 derniers jours</p>

<!-- Métriques -->
<div class="section">
  <div class="section-title">📊 Indicateurs Clés</div>
  <div class="metrics-grid">
    <div class="metric-card">
      <div class="metric-label">Ventes 30j</div>
      <div class="metric-value">${fmtGnf(data.metrics.total_sales_30d)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Ventes Aujourd'hui</div>
      <div class="metric-value">${fmtGnf(data.metrics.sales_today)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Ventes Ce Mois</div>
      <div class="metric-value">${fmtGnf(data.metrics.sales_month)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Panier Moyen</div>
      <div class="metric-value">${fmtGnf(data.metrics.avg_basket ?? 0)}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Commandes 30j</div>
      <div class="metric-value">${data.metrics.orders_30d}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Commandes Auj.</div>
      <div class="metric-value">${data.metrics.orders_today}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Stock Critique</div>
      <div class="metric-value" style="color:#dc2626">${data.metrics.low_stock_count}</div>
    </div>
  </div>
</div>

<!-- Statuts -->
${statusPillsHtml ? `
<div class="section">
  <div class="section-title">🔖 Statuts des Commandes</div>
  <div class="pills">${statusPillsHtml}</div>
</div>` : ''}

<!-- Source breakdown -->
${sourceHtml ? `
<div class="section">
  <div class="section-title">🌐 Répartition par Source</div>
  <div class="sources">${sourceHtml}</div>
</div>` : ''}

<!-- Top produits -->
<div class="section">
  <div class="section-title">🏆 Top 5 Produits</div>
  <table>
    <thead><tr><th>#</th><th>Produit</th><th>SKU</th><th>Qté vendue</th><th style="text-align:right">CA (GNF)</th></tr></thead>
    <tbody>
      ${data.top_products.map((p, i) => `
        <tr>
          <td style="font-weight:900;color:#f59e0b">${i + 1}</td>
          <td style="font-weight:600">${p.nom ?? '—'}</td>
          <td style="font-family:monospace;color:#64748b">${p.sku ?? '—'}</td>
          <td style="font-weight:700">${p.qty} u.</td>
          <td style="text-align:right;font-weight:700">${fmtGnf(p.revenue ?? 0)}</td>
        </tr>`).join('')}
    </tbody>
  </table>
</div>

<!-- Stock critique -->
<div class="section">
  <div class="section-title">⚠️ Stock Critique</div>
  ${data.low_stock.length === 0
    ? '<p style="color:#64748b">Aucun produit en rupture.</p>'
    : `<table>
        <thead><tr><th>Produit</th><th>SKU</th><th>Réel</th><th>Minimum</th><th>Écart</th><th>Statut</th></tr></thead>
        <tbody>
          ${data.low_stock.map((item) => {
              let bc = '#d97706', bl = 'Faible', bg = '#fef3c720';
              if (item.stock_reel === 0) { bc = '#dc2626'; bl = 'Rupture'; bg = '#fee2e220'; }
              else if (item.stock_minimal > 0 && item.stock_reel / item.stock_minimal <= 0.5) { bc = '#ea580c'; bl = 'Critique'; bg = '#ffedd520'; }
              return `<tr>
                <td style="font-weight:600">${item.nom}</td>
                <td style="font-family:monospace;color:#64748b">${item.sku}</td>
                <td style="font-weight:900;color:#dc2626">${item.stock_reel}</td>
                <td>${item.stock_minimal}</td>
                <td style="color:#64748b">${item.stock_reel - item.stock_minimal}</td>
                <td><span class="badge" style="background:${bg};color:${bc};border:1px solid ${bc}30">${bl}</span></td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`}
</div>

<!-- Ventes journalières -->
<div class="section">
  <div class="section-title">📈 Ventes Journalières</div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Total (GNF)</th>
        <th style="color:#38bdf8">En ligne</th>
        <th style="color:#a78bfa">POS</th>
        <th style="text-align:center">Commandes</th>
      </tr>
    </thead>
    <tbody>${dailyRows}</tbody>
  </table>
</div>

<!-- Commandes récentes -->
${recentOrdersHtml}

<div class="footer">
  Rapport généré automatiquement — Stock Manager v1.0 · ${new Date().toLocaleDateString('fr-FR')}
</div>
</body>
</html>`;

        const win = window.open('', '_blank', 'width=1000,height=750');
        if (!win) { setLoading(null); return; }
        win.document.write(html);
        win.document.close();
        win.onload = () => { setTimeout(() => { win.print(); setLoading(null); }, 300); };
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-white border-gray-200 text-slate-800 hover:bg-gray-50 hover:text-slate-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white gap-2 font-semibold"
                    disabled={loading !== null}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {loading ? (
                            <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Export en cours…
                            </motion.span>
                        ) : (
                            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Exporter
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200 w-48">
                <DropdownMenuLabel className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Format
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem className="gap-2 hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white" onClick={exportPDF}>
                    <FileText className="w-4 h-4 text-red-400" />
                    Rapport PDF
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 hover:bg-zinc-800 cursor-pointer focus:bg-zinc-800 focus:text-white" onClick={exportExcel}>
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Export Excel (CSV)
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}