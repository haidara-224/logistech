<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProduitRequest;
use App\Http\Requests\UpdateProduitRequest;
use App\Models\Categorie;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProduitController extends Controller
{
    // App/Http/Controllers/ProduitController.php

    public function index()
    {
        $search = request()->get('search', '');

        $query = Produit::with(['categorie', 'images']);

        // Filtre de recherche
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('categorie', function ($cat) use ($search) {
                        $cat->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $produits = $query->paginate(12); // Changé à 12 pour mieux s'adapter à la grille

        // Calcul des statistiques
        $stats = [
            'total_produits' => Produit::count(),
            'valeur_stock' => Produit::sum(DB::raw('prix_vente * COALESCE(quantite_stock, 0)')) ?? 0,
            'produits_rupture' => Produit::where('quantite_stock', 0)->count(),
            'produits_faible_stock' => Produit::whereColumn('quantite_stock', '<=', 'stock_minimal')
                ->where('quantite_stock', '>', 0)
                ->count(),
        ];

        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Index', [
            'produits' => $produits,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Create', ['categories' => $categories]);
    }

    public function store(StoreProduitRequest $request): RedirectResponse
    {
        Produit::create($request->validated());

        return redirect()->route('produits.index')->with('success', 'Produit créé');
    }

    public function show(Produit $produit)
    {
        $produit->load(['categorie', 'images', 'mouvements']);

        return Inertia::render('produits/Show', ['produit' => $produit]);
    }

    public function edit(Produit $produit)
    {
        $produit->load(['categorie', 'images']);
        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Edit', ['produit' => $produit, 'categories' => $categories]);
    }

    public function update(UpdateProduitRequest $request, Produit $produit): RedirectResponse
    {
        $produit->update($request->validated());

        return redirect()->back()->with('success', 'Produit mis à jour');
    }

    public function destroy(Produit $produit): RedirectResponse
    {
        $produit->delete();

        return redirect()->back()->with('success', 'Produit supprimé');
    }
}
