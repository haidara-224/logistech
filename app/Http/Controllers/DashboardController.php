<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $now    = Carbon::now();
        $start  = $now->copy()->subDays(29)->startOfDay();

        $saleStatuses = ['payer', 'livree'];
        $source       = $request->get('source'); // 'online' | 'pos' | null = all

        // ── Core metrics ────────────────────────────────────────────────────
        $totalSales30 = (float) Commande::whereIn('status', $saleStatuses)
            ->when($source, fn($q) => $q->where('source', $source))
            ->whereBetween('created_at', [$start, $now])
            ->sum('montant_total');

        $ordersCount30 = (int) Commande::when($source, fn($q) => $q->where('source', $source))
            ->whereBetween('created_at', [$start, $now])->count();

        $ordersToday = (int) Commande::when($source, fn($q) => $q->where('source', $source))
            ->whereDate('created_at', $now->toDateString())->count();

        $salesToday = (float) Commande::whereIn('status', $saleStatuses)
            ->when($source, fn($q) => $q->where('source', $source))
            ->whereDate('created_at', $now->toDateString())
            ->sum('montant_total');

        $startOfMonth = $now->copy()->startOfMonth();
        $salesMonth   = (float) Commande::whereIn('status', $saleStatuses)
            ->when($source, fn($q) => $q->where('source', $source))
            ->whereBetween('created_at', [$startOfMonth, $now])
            ->sum('montant_total');

        // Average basket (paid orders 30d)
        $avgBasket = (float) Commande::whereIn('status', $saleStatuses)
            ->when($source, fn($q) => $q->where('source', $source))
            ->whereBetween('created_at', [$start, $now])
            ->avg('montant_total') ?? 0;

        // ── Sales per day — overall + per source (for dual-line chart) ──────
        $buildDaySeries = function (string $src = null) use ($start, $now, $saleStatuses) {
            return Commande::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(montant_total) as total'))
                ->whereIn('status', $saleStatuses)
                ->when($src, fn($q) => $q->where('source', $src))
                ->whereBetween('created_at', [$start, $now])
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->keyBy('date')
                ->map(fn($r) => (float) $r->total)
                ->toArray();
        };

        $salesRows        = $buildDaySeries($source);
        $salesRowsOnline  = $buildDaySeries('online');
        $salesRowsPos     = $buildDaySeries('pos');

        $labels      = [];
        $data        = [];
        $dataOnline  = [];
        $dataPos     = [];

        for ($i = 0; $i < 30; $i++) {
            $d   = $start->copy()->addDays($i);
            $key = $d->format('Y-m-d');
            $labels[]     = $key;
            $data[]       = $salesRows[$key]       ?? 0;
            $dataOnline[] = $salesRowsOnline[$key] ?? 0;
            $dataPos[]    = $salesRowsPos[$key]    ?? 0;
        }

        // ── Orders per day count (for order volume chart) ────────────────────
        $orderCountRows = Commande::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as cnt'))
            ->when($source, fn($q) => $q->where('source', $source))
            ->whereBetween('created_at', [$start, $now])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(fn($r) => (int) $r->cnt)
            ->toArray();

        $orderCountData = array_map(fn($key) => $orderCountRows[$key] ?? 0, $labels);

        // ── Source breakdown (online vs pos — amounts) ──────────────────────
        $sourceBreakdown = Commande::select('source', DB::raw('SUM(montant_total) as total'), DB::raw('COUNT(*) as cnt'))
            ->whereIn('status', $saleStatuses)
            ->whereBetween('created_at', [$start, $now])
            ->whereNotNull('source')
            ->groupBy('source')
            ->get()
            ->mapWithKeys(fn($r) => [$r->source => [
                'total' => (float) $r->total,
                'count' => (int)   $r->cnt,
            ]])
            ->toArray();

        // ── Status breakdown ────────────────────────────────────────────────
        $statusCounts = Commande::select('status', DB::raw('count(*) as count'))
            ->when($source, fn($q) => $q->where('source', $source))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        // ── Low stock ───────────────────────────────────────────────────────
        $lowStock = Produit::with('categorie', 'mouvements')->get()->filter(function ($p) {
            return $p->stock_reel <= ($p->stock_minimal ?? 0);
        })->values();

        // ── Top products ────────────────────────────────────────────────────
        $topQuery = DB::table('commande_items')
            ->join('commandes', 'commande_items.commande_id', '=', 'commandes.id')
            ->select(
                'commande_items.produit_id',
                DB::raw('SUM(commande_items.quantite) as qty'),
                DB::raw('SUM(commande_items.prix_total) as revenue')
            )
            ->groupBy('commande_items.produit_id')
            ->orderByDesc('qty')
            ->limit(5);

        if ($source) {
            $topQuery->where('commandes.source', $source);
        }

        $topProducts = $topQuery->get()->map(function ($row) {
            $produit = Produit::find($row->produit_id);
            return [
                'produit_id' => $row->produit_id,
                'nom'        => $produit?->nom,
                'sku'        => $produit?->sku,
                'qty'        => (int)   $row->qty,
                'revenue'    => (float) $row->revenue,
            ];
        })->values();

        // ── Recent orders (paginated) ────────────────────────────────────────
        $perPage       = (int) $request->get('per_page', 10);
        $recentOrders  = Commande::with('client')
            ->when($source, fn($q) => $q->where('source', $source))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(fn($c) => [
                'id'           => $c->id,
                'client'       => $c->client?->nom . ' ' . ($c->client?->prenom ?? ''),
                'status'       => $c->status,
                'source'       => $c->source,
                'montant'      => (float) $c->montant_total,
                'created_at'   => $c->created_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('dashboard', [
            'metrics' => [
                'total_sales_30d'  => $totalSales30,
                'sales_today'      => $salesToday,
                'sales_month'      => $salesMonth,
                'orders_30d'       => $ordersCount30,
                'orders_today'     => $ordersToday,
                'low_stock_count'  => $lowStock->count(),
                'avg_basket'       => round($avgBasket),
            ],
            'sales_chart' => [
                'labels'        => $labels,
                'data'          => $data,
                'data_online'   => $dataOnline,
                'data_pos'      => $dataPos,
                'order_counts'  => $orderCountData,
            ],
            'low_stock'        => $lowStock->map(fn($p) => [
                'id'            => $p->id,
                'nom'           => $p->nom,
                'sku'           => $p->sku,
                'stock_reel'    => $p->stock_reel,
                'stock_minimal' => $p->stock_minimal,
            ]),
            'top_products'      => $topProducts,
            'status_counts'     => $statusCounts,
            'source_breakdown'  => $sourceBreakdown,
            'recent_orders'     => $recentOrders,
            'filters'           => ['source' => $source],
        ]);
    }

    /**
     * Return recent orders as JSON for client-side pagination.
     */
    public function recentOrdersJson(Request $request)
    {
        $source = $request->get('source');
        $perPage = (int) $request->get('per_page', 10);

        $recentOrders = Commande::with('client')
            ->when($source, fn($q) => $q->where('source', $source))
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->through(fn($c) => [
                'id'           => $c->id,
                'client'       => $c->client?->nom . ' ' . ($c->client?->prenom ?? ''),
                'status'       => $c->status,
                'source'       => $c->source,
                'montant'      => (float) $c->montant_total,
                'created_at'   => $c->created_at?->format('d/m/Y H:i'),
            ]);

        return response()->json($recentOrders->toArray());
    }
}