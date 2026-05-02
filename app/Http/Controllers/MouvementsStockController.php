<?php

namespace App\Http\Controllers;

use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MouvementsStockController extends Controller
{
    public function index()
    {
        $mouvements = Mouvements_stock::with('produit')
            ->orderByDesc('created_at')
            ->paginate(25);

        $stats = [
            'total_entrees' => Mouvements_stock::where('type', 'entree')->sum('quantite'),
            'total_sorties' => Mouvements_stock::where('type', 'sortie')->sum('quantite'),
            'mouvements_mois' => Mouvements_stock::whereMonth('created_at', now()->month)->count(),
            'ajustements_mois' => Mouvements_stock::where('source', 'ajustement')
                ->whereMonth('created_at', now()->month)->count(),
        ];

        $chart = Mouvements_stock::selectRaw(
            "DATE(created_at) as date,
             SUM(CASE WHEN type='entree' THEN quantite ELSE 0 END) as entrees,
             SUM(CASE WHEN type='sortie' THEN quantite ELSE 0 END) as sorties"
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        return Inertia::render('mouvements/Index', compact('mouvements', 'stats', 'chart'));
    }

    public function ajustements()
    {
        $produits = Produit::with(['images.image'])
            ->select('id', 'nom', 'sku', 'quantite_stock', 'stock_minimal')
            ->orderBy('nom')
            ->get();

        $ajustements = Mouvements_stock::with('produit')
            ->where('source', 'ajustement')
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('stock/Ajustements', compact('produits', 'ajustements'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type' => 'required|in:entree,sortie',
            'quantite' => 'required|integer|min:1',
        ]);

        Mouvements_stock::create(array_merge($data, ['source' => 'ajustement']));

        $produit = Produit::findOrFail($data['produit_id']);
        if ($data['type'] === 'entree') {
            $produit->increment('quantite_stock', $data['quantite']);
        } else {
            $produit->decrement('quantite_stock', $data['quantite']);
        }

        return redirect()->route('stock.ajustements')->with('success', 'Ajustement enregistré avec succès');
    }
}
