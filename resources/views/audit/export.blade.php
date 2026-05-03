<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport d'audit — Logistech Equip+</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 11px;
            color: #1a1a2e;
            background: #fff;
            padding: 32px;
        }

        /* ── Header ── */
        .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 3px solid #C8962E;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .header-left h1 {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
        }
        .header-left p {
            font-size: 11px;
            color: #64748b;
            margin-top: 3px;
        }
        .header-right {
            text-align: right;
        }
        .header-right .badge {
            display: inline-block;
            background: #C8962E;
            color: #fff;
            font-weight: 700;
            font-size: 10px;
            padding: 3px 10px;
            border-radius: 100px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .header-right .meta {
            font-size: 10px;
            color: #94a3b8;
            margin-top: 6px;
        }

        /* ── Filtres actifs ── */
        .filters-bar {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            font-size: 10px;
            color: #475569;
        }
        .filters-bar strong { color: #1e293b; }
        .filter-tag {
            background: #e0e7ff;
            color: #3730a3;
            border-radius: 4px;
            padding: 2px 8px;
            font-weight: 600;
        }

        /* ── Stats ── */
        .stats {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }
        .stat-card {
            flex: 1;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            text-align: center;
        }
        .stat-card .value {
            font-size: 20px;
            font-weight: 800;
            color: #C8962E;
        }
        .stat-card .label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            margin-top: 2px;
        }

        /* ── Table ── */
        table {
            width: 100%;
            border-collapse: collapse;
        }
        thead tr {
            background: #0f172a;
            color: #fff;
        }
        thead th {
            padding: 8px 10px;
            text-align: left;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody tr:hover { background: #f1f5f9; }
        tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }

        /* ── Action badges ── */
        .badge-action {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 2px 8px;
            border-radius: 100px;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            white-space: nowrap;
        }
        .badge-created    { background: #d1fae5; color: #065f46; }
        .badge-updated    { background: #dbeafe; color: #1e40af; }
        .badge-deleted    { background: #fee2e2; color: #991b1b; }
        .badge-restored   { background: #fef3c7; color: #92400e; }
        .badge-bulk       { background: #fecaca; color: #7f1d1d; }
        .badge-other      { background: #f1f5f9; color: #475569; }

        .model-name {
            font-weight: 600;
            color: #334155;
        }
        .model-id {
            font-family: monospace;
            color: #94a3b8;
            font-size: 9px;
        }
        .user-name { font-weight: 600; color: #1e293b; }
        .user-email { color: #94a3b8; font-size: 9px; }
        .ip { font-family: monospace; color: #94a3b8; font-size: 9px; }
        .desc { color: #475569; max-width: 260px; }

        /* ── Footer ── */
        .footer {
            margin-top: 28px;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            display: flex;
            justify-content: space-between;
            color: #94a3b8;
            font-size: 9px;
        }

        /* ── Print rules ── */
        @media print {
            body { padding: 16px; }
            .no-print { display: none !important; }
            table { page-break-inside: auto; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
        }
    </style>
</head>
<body>

    <!-- Bouton impression (masqué à l'impression) -->
    <div class="no-print" style="margin-bottom:20px; display:flex; gap:10px; align-items:center;">
        <button onclick="window.print()"
            style="background:#C8962E;color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:8px;">
            ⬇ Télécharger / Imprimer
        </button>
        <button onclick="window.close()"
            style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0;padding:10px 20px;border-radius:8px;font-size:13px;cursor:pointer;">
            Fermer
        </button>
        <span style="color:#94a3b8;font-size:12px;">Utilisez « Enregistrer en PDF » dans la boîte de dialogue d'impression.</span>
    </div>

    <!-- En-tête rapport -->
    <div class="header">
        <div class="header-left">
            <h1>Journal d'audit</h1>
            <p>Logistech Equip+ — Traçabilité complète des actions système</p>
        </div>
        <div class="header-right">
            <span class="badge">Confidentiel</span>
            <div class="meta">Généré le {{ $generatedAt }}</div>
        </div>
    </div>

    <!-- Filtres actifs -->
    @if(count($filters))
    <div class="filters-bar">
        <strong>Filtres appliqués :</strong>
        @foreach($filters as $key => $value)
            <span class="filter-tag">{{ ucfirst($key) }} : {{ $value }}</span>
        @endforeach
    </div>
    @endif

    <!-- Stats -->
    @php
        $byAction = $logs->groupBy('action');
        $creations = $byAction->get('created', collect())->count();
        $modifications = $byAction->get('updated', collect())->count();
        $suppressions = $logs->filter(fn($l) => str_contains($l->action, 'deleted'))->count();
        $restaurations = $byAction->get('restored', collect())->count();
    @endphp
    <div class="stats">
        <div class="stat-card">
            <div class="value">{{ $total }}</div>
            <div class="label">Total entrées</div>
        </div>
        <div class="stat-card">
            <div class="value" style="color:#059669;">{{ $creations }}</div>
            <div class="label">Créations</div>
        </div>
        <div class="stat-card">
            <div class="value" style="color:#2563eb;">{{ $modifications }}</div>
            <div class="label">Modifications</div>
        </div>
        <div class="stat-card">
            <div class="value" style="color:#dc2626;">{{ $suppressions }}</div>
            <div class="label">Suppressions</div>
        </div>
        <div class="stat-card">
            <div class="value" style="color:#d97706;">{{ $restaurations }}</div>
            <div class="label">Restaurations</div>
        </div>
    </div>

    <!-- Tableau -->
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Modèle</th>
                <th>Description</th>
                <th>IP</th>
            </tr>
        </thead>
        <tbody>
            @forelse($logs as $i => $log)
            @php
                $actionLabels = [
                    'created'            => ['label' => 'Création',              'cls' => 'badge-created'],
                    'updated'            => ['label' => 'Modification',          'cls' => 'badge-updated'],
                    'deleted'            => ['label' => 'Suppression',           'cls' => 'badge-deleted'],
                    'restored'           => ['label' => 'Restauration',          'cls' => 'badge-restored'],
                    'bulk_deleted'       => ['label' => 'Suppression masse',     'cls' => 'badge-bulk'],
                    'force_deleted'      => ['label' => 'Suppr. définitive',     'cls' => 'badge-bulk'],
                    'bulk_force_deleted' => ['label' => 'Purge totale',          'cls' => 'badge-bulk'],
                ];
                $cfg = $actionLabels[$log->action] ?? ['label' => $log->action, 'cls' => 'badge-other'];
                $modelShort = class_basename($log->model_type);
                $modelLabels = [
                    'Produit' => 'Produit', 'Commande' => 'Commande', 'Client' => 'Client',
                    'Categorie' => 'Catégorie', 'Facture' => 'Facture', 'Paiement' => 'Paiement',
                    'Devis' => 'Devis', 'Expedition' => 'Expédition', 'Livraison' => 'Livraison',
                    'Camion' => 'Camion', 'Chauffeur' => 'Chauffeur',
                    'Mouvements_stock' => 'Mvt stock', 'Contact' => 'Contact',
                    'NewsletterSubscription' => 'Newsletter', 'User' => 'Utilisateur',
                    'Commande_item' => 'Article cmd', 'ImageProduit' => 'Image',
                ];
            @endphp
            <tr>
                <td style="color:#94a3b8; font-size:9px;">{{ $i + 1 }}</td>
                <td style="white-space:nowrap; color:#475569;">
                    {{ \Carbon\Carbon::parse($log->created_at)->format('d/m/Y H:i') }}
                </td>
                <td>
                    <div class="user-name">{{ $log->user?->name ?? 'Système' }}</div>
                    @if($log->user?->email)
                    <div class="user-email">{{ $log->user->email }}</div>
                    @endif
                </td>
                <td>
                    <span class="badge-action {{ $cfg['cls'] }}">{{ $cfg['label'] }}</span>
                </td>
                <td>
                    <span class="model-name">{{ $modelLabels[$modelShort] ?? $modelShort }}</span>
                    @if($log->model_id)
                    <span class="model-id">#{{ $log->model_id }}</span>
                    @endif
                </td>
                <td class="desc">{{ $log->description }}</td>
                <td class="ip">{{ $log->ip_address ?? '—' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align:center; padding:24px; color:#94a3b8;">
                    Aucune entrée dans le journal
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Pied de page -->
    <div class="footer">
        <span>Logistech Equip+ — Journal d'audit système</span>
        <span>{{ $total }} entrée{{ $total > 1 ? 's' : '' }} — Généré le {{ $generatedAt }}</span>
    </div>

</body>
</html>
