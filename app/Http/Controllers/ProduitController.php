<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Http\Requests\StoreProduitRequest;
use App\Http\Requests\UpdateProduitRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ProduitController extends Controller
{
    public function index()
    {
        $produits = Produit::with(['categorie', 'images'])->paginate(20);
        return Inertia::render('produits/Index', ['produits' => $produits]);
    }

    public function create()
    {
        return Inertia::render('produits/Create');
    }

    public function store(StoreProduitRequest $request): RedirectResponse
    {
        $produit = Produit::create($request->validated());
        return redirect()->route('produits.show', $produit->id)->with('success', 'Produit créé');
    }

    public function show(Produit $produit)
    {
        $produit->load(['categorie', 'images', 'mouvements']);
        return Inertia::render('produits/Show', ['produit' => $produit]);
    }

    public function edit(Produit $produit)
    {
        $produit->load(['categorie', 'images']);
        return Inertia::render('produits/Edit', ['produit' => $produit]);
    }

    public function update(UpdateProduitRequest $request, Produit $produit): RedirectResponse
    {
        $produit->update($request->validated());
        return redirect()->route('produits.show', $produit->id)->with('success', 'Produit mis à jour');
    }

    public function destroy(Produit $produit): RedirectResponse
    {
        $produit->delete();
        return redirect()->route('produits.index')->with('success', 'Produit supprimé');
    }
}

