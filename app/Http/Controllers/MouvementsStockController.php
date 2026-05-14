<?php

namespace App\Http\Controllers;

use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MouvementsStockController extends Controller
{
    public function index()
    {
        $mouvements = Mouvements_stock::with(['produit', 'user'])
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
            ->select('id', 'nom', 'sku', 'quantite_stock', 'stock_minimal', 'prix_achat')
            ->orderBy('nom')
            ->get();

        $ajustements = Mouvements_stock::with(['produit', 'user'])
            ->where('source', 'ajustement')
            ->orderByDesc('created_at')
            ->paginate(20);

        $alertes = Produit::whereColumn('quantite_stock', '<=', 'stock_minimal')
            ->select('id', 'nom', 'sku', 'quantite_stock', 'stock_minimal')
            ->orderBy('quantite_stock')
            ->get();

        $valeurStock = Produit::selectRaw('SUM(quantite_stock * prix_achat) as total')->value('total') ?? 0;

        return Inertia::render('stock/Ajustements', compact('produits', 'ajustements', 'alertes', 'valeurStock'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'type' => 'required|in:entree,sortie',
            'quantite' => 'required|integer|min:1',
            'note' => 'nullable|string|max:500',
        ]);

        $produit = Produit::findOrFail($data['produit_id']);

        if ($data['type'] === 'sortie' && $data['quantite'] > $produit->quantite_stock) {
            return back()->withErrors([
                'quantite' => "Quantité demandée ({$data['quantite']}) supérieure au stock disponible ({$produit->quantite_stock}).",
            ])->withInput();
        }

        Mouvements_stock::create([
            ...$data,
            'source' => 'ajustement',
            'user_id' => Auth::id(),
        ]);

        if ($data['type'] === 'entree') {
            $produit->increment('quantite_stock', $data['quantite']);
        } else {
            $produit->decrement('quantite_stock', $data['quantite']);
        }

        return redirect()->route('stock.ajustements')->with('success', 'Ajustement enregistré avec succès.');
    }

    public function exportStock(): Response
    {
        $produits = Produit::with('categorie')
            ->select('id', 'nom', 'sku', 'quantite_stock', 'stock_minimal', 'prix_achat', 'prix_vente', 'categorie_id')
            ->orderBy('nom')
            ->get()
            ->map(fn ($p) => [
                ...$p->toArray(),
                'valeur_stock' => $p->quantite_stock * ($p->prix_achat ?? 0),
                'alerte' => $p->quantite_stock <= $p->stock_minimal,
            ]);

        $valeurTotale = $produits->sum('valeur_stock');
        $enAlerte = $produits->where('alerte', true)->count();
        $enRupture = $produits->where('quantite_stock', 0)->count();
        $generatedAt = now()->format('d/m/Y à H:i');

        return response()->view('stock.rapport', compact('produits', 'valeurTotale', 'enAlerte', 'enRupture', 'generatedAt'));
    }
}
