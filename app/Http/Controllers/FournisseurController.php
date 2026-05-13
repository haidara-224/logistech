<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FournisseurController extends Controller
{
    public function index()
    {
        $fournisseurs = Fournisseur::withCount('achats')
            ->orderBy('nom')
            ->paginate(20);

        return Inertia::render('fournisseurs/Index', ['fournisseurs' => $fournisseurs]);
    }

    public function create()
    {
        return Inertia::render('fournisseurs/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        $fournisseur = Fournisseur::create($validated);

        return redirect()->route('fournisseurs.show', $fournisseur->id)->with('success', 'Fournisseur créé.');
    }

    public function show(Fournisseur $fournisseur)
    {
        $fournisseur->load(['achats' => fn ($q) => $q->latest()->limit(10)]);

        return Inertia::render('fournisseurs/Show', ['fournisseur' => $fournisseur]);
    }

    public function edit(Fournisseur $fournisseur)
    {
        return Inertia::render('fournisseurs/Edit', ['fournisseur' => $fournisseur]);
    }

    public function update(Request $request, Fournisseur $fournisseur): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'adresse' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        $fournisseur->update($validated);

        return redirect()->route('fournisseurs.show', $fournisseur->id)->with('success', 'Fournisseur mis à jour.');
    }

    public function destroy(Fournisseur $fournisseur): RedirectResponse
    {
        $fournisseur->delete();

        return redirect()->route('fournisseurs.index')->with('success', 'Fournisseur supprimé.');
    }
}
