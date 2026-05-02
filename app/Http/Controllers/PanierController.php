<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PanierController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $produit = Produit::findOrFail($request->produit_id);
        $panier = session('panier', []);
        $id = (string) $request->produit_id;

        if (isset($panier[$id])) {
            $panier[$id]['quantite'] = min(
                $panier[$id]['quantite'] + $request->quantite,
                $produit->stock_reel,
            );
        } else {
            $panier[$id] = [
                'produit_id' => $produit->id,
                'nom' => $produit->nom,
                'prix' => $produit->prix_vente,
                'quantite' => min($request->quantite, $produit->stock_reel),
            ];
        }

        session(['panier' => $panier]);

        return response()->json(['panier' => $panier, 'count' => count($panier)]);
    }

    public function update(Request $request, int $produitId): JsonResponse
    {
        $request->validate(['quantite' => 'required|integer|min:0']);

        $panier = session('panier', []);
        $id = (string) $produitId;

        if ($request->quantite === 0) {
            unset($panier[$id]);
        } else {
            $produit = Produit::findOrFail($produitId);
            if (isset($panier[$id])) {
                $panier[$id]['quantite'] = min($request->quantite, $produit->stock_reel);
            }
        }

        session(['panier' => $panier]);

        return response()->json(['panier' => $panier, 'count' => count($panier)]);
    }

    public function destroy(int $produitId): JsonResponse
    {
        $panier = session('panier', []);
        unset($panier[(string) $produitId]);
        session(['panier' => $panier]);

        return response()->json(['panier' => $panier, 'count' => count($panier)]);
    }

    public function clear(): JsonResponse
    {
        session(['panier' => []]);

        return response()->json(['panier' => [], 'count' => 0]);
    }
}
