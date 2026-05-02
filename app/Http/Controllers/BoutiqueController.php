<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Produit;
use Inertia\Inertia;
use Inertia\Response;

class BoutiqueController extends Controller
{
    public function index(): Response
    {
        $produits = Produit::with(['categorie', 'images.image'])
            ->get()
            ->filter(fn (Produit $p) => $p->stock_reel > 0)
            ->values();

        $categories = Categorie::whereHas('produits', function ($q) {
            $q->whereNull('deleted_at');
        })->get();

        return Inertia::render('boutique/index', [
            'produits' => $produits,
            'categories' => $categories,
            'panier' => session('panier', []),
        ]);
    }
}
