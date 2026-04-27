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
        $now = Carbon::now();
        $start = $now->copy()->subDays(29)->startOfDay();

        // Summary metrics
        $totalSales30 = (float) Commande::where('status', 'paid')
            ->whereBetween('created_at', [$start, $now])
            ->sum('montant_total');

        $ordersCount30 = (int) Commande::whereBetween('created_at', [$start, $now])->count();

        $ordersToday = (int) Commande::whereDate('created_at', $now->toDateString())->count();

        // Sales per day for last 30 days
        $salesRows = Commande::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(montant_total) as total'))
            ->where('status', 'paid')
            ->whereBetween('created_at', [$start, $now])
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->map(fn ($r) => (float) $r->total)
            ->toArray();

        $labels = [];
        $data = [];
        for ($i = 0; $i < 30; $i++) {
            $d = $start->copy()->addDays($i);
            $key = $d->format('Y-m-d');
            $labels[] = $key;
            $data[] = $salesRows[$key] ?? 0;
        }

        // Low stock products
        $lowStock = Produit::with('categorie', 'mouvements')->get()->filter(function ($p) {
            return $p->stock_reel <= ($p->stock_minimal ?? 0);
        })->values();

        // Top sold products (by quantity)
        $top = DB::table('commande_items')
            ->select('produit_id', DB::raw('SUM(quantite) as qty'))
            ->groupBy('produit_id')
            ->orderByDesc('qty')
            ->limit(5)
            ->get();

        $topProducts = collect($top)->map(function ($row) {
            $produit = Produit::find($row->produit_id);
            return [
                'produit_id' => $row->produit_id,
                'nom' => $produit?->nom,
                'sku' => $produit?->sku,
                'qty' => (int) $row->qty,
            ];
        })->values();

        return Inertia::render('dashboard', [
            'metrics' => [
                'total_sales_30d' => $totalSales30,
                'orders_30d' => $ordersCount30,
                'orders_today' => $ordersToday,
                'low_stock_count' => $lowStock->count(),
            ],
            'sales_chart' => [
                'labels' => $labels,
                'data' => $data,
            ],
            'low_stock' => $lowStock->map(fn ($p) => [
                'id' => $p->id,
                'nom' => $p->nom,
                'sku' => $p->sku,
                'stock_reel' => $p->stock_reel,
                'stock_minimal' => $p->stock_minimal,
            ]),
            'top_products' => $topProducts,
        ]);
    }
}
