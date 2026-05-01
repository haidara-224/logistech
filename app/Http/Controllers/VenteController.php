<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VenteController extends Controller
{
    public function index()
    {
        $commandes = Commande::with('client', 'items.produit')
            ->whereIn('status', ['payer', 'livree'])
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'ca_total' => Commande::whereIn('status', ['payer', 'livree'])->sum('montant_total') ?? 0,
            'ca_mois' => Commande::whereIn('status', ['payer', 'livree'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('montant_total') ?? 0,
            'nb_ventes' => Commande::whereIn('status', ['payer', 'livree'])->count(),
            'panier_moyen' => round(Commande::whereIn('status', ['payer', 'livree'])->avg('montant_total') ?? 0),
        ];

        $chart = Commande::selectRaw("DATE(created_at) as date, SUM(montant_total) as ca, COUNT(*) as nb")
            ->whereIn('status', ['payer', 'livree'])
            ->where('created_at', '>=', now()->subDays(30))
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        $topProduits = DB::table('commande_items')
            ->join('produits', 'commande_items.produit_id', '=', 'produits.id')
            ->join('commandes', 'commande_items.commande_id', '=', 'commandes.id')
            ->whereIn('commandes.status', ['payer', 'livree'])
            ->selectRaw('produits.nom, SUM(commande_items.quantite) as total_vendu, SUM(commande_items.prix_total) as ca')
            ->groupBy('produits.id', 'produits.nom')
            ->orderByDesc('ca')
            ->limit(5)
            ->get();

        return Inertia::render('ventes/Index', compact('commandes', 'stats', 'chart', 'topProduits'));
    }
}
