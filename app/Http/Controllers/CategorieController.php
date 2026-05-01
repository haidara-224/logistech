<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'name' => 'required|string|max:255|unique:categories,name',
        ]);
        Categorie::create($data);

        return redirect()->route('categories.index')->with('success', 'Catégorie créée');
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
            'name' => "sometimes|required|string|max:255|unique:categories,name,{$categorie->id}",
        ]);
        $categorie->update($data);

        return redirect()->route('categories.index')->with('success', 'Catégorie mise à jour');
    }

    public function destroy(Categorie $categorie): RedirectResponse
    {
        $categorie->delete();

        return redirect()->route('categories.index')->with('success', 'Catégorie supprimée');
    }
}
