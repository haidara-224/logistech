<?php

namespace App\Http\Controllers;

use App\Models\Depot;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepotController extends Controller
{
    public function index()
    {
        $depots = Depot::orderBy('nom')->get();

        return Inertia::render('depots/Index', ['depots' => $depots]);
    }

    public function create()
    {
        return Inertia::render('depots/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
        ]);

        $depot = Depot::create($validated);

        return redirect()->route('depots.index')->with('success', "Dépôt \"{$depot->nom}\" créé.");
    }

    public function edit(Depot $depot)
    {
        return Inertia::render('depots/Edit', ['depot' => $depot]);
    }

    public function update(Request $request, Depot $depot): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'adresse' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
        ]);

        $depot->update($validated);

        return redirect()->route('depots.index')->with('success', 'Dépôt mis à jour.');
    }

    public function destroy(Depot $depot): RedirectResponse
    {
        $depot->delete();

        return redirect()->route('depots.index')->with('success', 'Dépôt supprimé.');
    }
}
