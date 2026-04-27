<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class CategorieController extends Controller
{
    public function index()
    {
        $categories = Categorie::withCount('produits')->paginate(20);
        return Inertia::render('categories/Index', ['categories' => $categories]);
    }

    public function create()
    {
        return Inertia::render('categories/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $categorie = Categorie::create($data);
        return redirect()->route('categories.show', $categorie->id)->with('success', 'Catégorie créée');
    }

    public function show(Categorie $categorie)
    {
        $categorie->load('produits');
        return Inertia::render('categories/Show', ['categorie' => $categorie]);
    }

    public function edit(Categorie $categorie)
    {
        return Inertia::render('categories/Edit', ['categorie' => $categorie]);
    }

    public function update(Request $request, Categorie $categorie): RedirectResponse
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $categorie->update($data);
        return redirect()->route('categories.show', $categorie->id)->with('success', 'Catégorie mise à jour');
    }

    public function destroy(Categorie $categorie): RedirectResponse
    {
        $categorie->delete();
        return redirect()->route('categories.index')->with('success', 'Catégorie supprimée');
    }
}
