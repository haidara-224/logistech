<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Stock — {{ $generatedAt }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; }

        .header { background: linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%); color: white; padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; }
        .header h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
        .header p { font-size: 11px; opacity: 0.8; margin-top: 4px; }
        .header-right { text-align: right; font-size: 11px; opacity: 0.85; }

        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #e5e7eb; margin: 0; }
        .stat { background: #f8fafc; padding: 16px 20px; }
        .stat-value { font-size: 22px; font-weight: 800; color: #1e3a5f; }
        .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
        .stat-alerte .stat-value { color: #dc2626; }
        .stat-rupture .stat-value { color: #f59e0b; }

        .section { padding: 20px 32px; }
        .section-title { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #e5e7eb; }

        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #1e3a5f; color: white; }
        thead th { padding: 9px 12px; text-align: left; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        tbody tr { border-bottom: 1px solid #f1f5f9; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody tr.alerte { background: #fff5f5; }
        tbody tr.rupture { background: #fffbeb; }
        tbody td { padding: 8px 12px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .badge-ok { background: #d1fae5; color: #065f46; }
        .badge-alerte { background: #fee2e2; color: #991b1b; }
        .badge-rupture { background: #fef3c7; color: #92400e; }
        .text-right { text-align: right; }
        .font-mono { font-family: 'Courier New', monospace; }
        .text-muted { color: #9ca3af; }
        .total-row { background: #1e3a5f !important; color: white; font-weight: 700; }
        .total-row td { padding: 10px 12px; }

        .actions { padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e5e7eb; display: flex; gap: 10px; }
        .btn { padding: 8px 18px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; }
        .btn-print { background: #1e3a5f; color: white; }
        .btn-close { background: #e5e7eb; color: #374151; }

        .footer { padding: 12px 32px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; display: flex; justify-content: space-between; }

        @media print {
            .actions { display: none; }
            body { font-size: 11px; }
            .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .stats { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            thead tr { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .total-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>

<div class="header">
    <div>
        <h1>📦 Rapport de Stock</h1>
        <p>Inventaire complet — valeur et statut des produits</p>
    </div>
    <div class="header-right">
        <div>Généré le {{ $generatedAt }}</div>
        <div style="margin-top:4px;font-size:10px;">LOGISTECH — Confidentiel</div>
    </div>
</div>

<div class="stats">
    <div class="stat">
        <div class="stat-value">{{ $produits->count() }}</div>
        <div class="stat-label">Produits référencés</div>
    </div>
    <div class="stat">
        <div class="stat-value">{{ number_format($valeurTotale, 0, ',', ' ') }} GNF</div>
        <div class="stat-label">Valeur totale du stock</div>
    </div>
    <div class="stat stat-alerte">
        <div class="stat-value">{{ $enAlerte }}</div>
        <div class="stat-label">Produits en alerte stock</div>
    </div>
    <div class="stat stat-rupture">
        <div class="stat-value">{{ $enRupture }}</div>
        <div class="stat-label">Produits en rupture</div>
    </div>
</div>

@if($enAlerte > 0)
<div class="section">
    <div class="section-title">⚠️ Produits en alerte (stock ≤ stock minimal)</div>
    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>SKU</th>
                <th class="text-right">Stock actuel</th>
                <th class="text-right">Stock minimal</th>
                <th class="text-right">Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($produits->where('alerte', true)->sortBy('quantite_stock') as $p)
            <tr class="{{ $p['quantite_stock'] == 0 ? 'rupture' : 'alerte' }}">
                <td><strong>{{ $p['nom'] }}</strong></td>
                <td class="font-mono text-muted">{{ $p['sku'] ?? '—' }}</td>
                <td class="text-right font-mono">{{ $p['quantite_stock'] }}</td>
                <td class="text-right font-mono">{{ $p['stock_minimal'] }}</td>
                <td class="text-right">
                    @if($p['quantite_stock'] == 0)
                        <span class="badge badge-rupture">Rupture</span>
                    @else
                        <span class="badge badge-alerte">Alerte</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

<div class="section">
    <div class="section-title">Liste complète des produits</div>
    <table>
        <thead>
            <tr>
                <th>Produit</th>
                <th>SKU</th>
                <th>Catégorie</th>
                <th class="text-right">Stock</th>
                <th class="text-right">Min.</th>
                <th class="text-right">Prix achat</th>
                <th class="text-right">Valeur stock</th>
                <th class="text-right">Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($produits as $p)
            <tr class="{{ $p['quantite_stock'] == 0 ? 'rupture' : ($p['alerte'] ? 'alerte' : '') }}">
                <td><strong>{{ $p['nom'] }}</strong></td>
                <td class="font-mono text-muted">{{ $p['sku'] ?? '—' }}</td>
                <td class="text-muted">{{ $p['categorie']['name'] ?? '—' }}</td>
                <td class="text-right font-mono">{{ $p['quantite_stock'] }}</td>
                <td class="text-right font-mono text-muted">{{ $p['stock_minimal'] }}</td>
                <td class="text-right font-mono">{{ number_format($p['prix_achat'] ?? 0, 0, ',', ' ') }}</td>
                <td class="text-right font-mono"><strong>{{ number_format($p['valeur_stock'], 0, ',', ' ') }}</strong></td>
                <td class="text-right">
                    @if($p['quantite_stock'] == 0)
                        <span class="badge badge-rupture">Rupture</span>
                    @elseif($p['alerte'])
                        <span class="badge badge-alerte">Alerte</span>
                    @else
                        <span class="badge badge-ok">OK</span>
                    @endif
                </td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="6"><strong>TOTAL STOCK</strong></td>
                <td class="text-right font-mono"><strong>{{ number_format($valeurTotale, 0, ',', ' ') }} GNF</strong></td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>

<div class="actions">
    <button class="btn btn-print" onclick="window.print()">🖨️ Imprimer / Télécharger PDF</button>
    <button class="btn btn-close" onclick="window.close()">✕ Fermer</button>
</div>

<div class="footer">
    <span>LOGISTECH — Rapport de stock confidentiel</span>
    <span>Généré automatiquement le {{ $generatedAt }}</span>
</div>

</body>
</html>
