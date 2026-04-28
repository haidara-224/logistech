<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreChauffeurRequest;
use App\Http\Requests\Logistique\UpdateChauffeurRequest;
use App\Models\Chauffeur;
use Illuminate\Http\RedirectResponse;

class ChauffeurController extends Controller
{
    public function store(StoreChauffeurRequest $request): RedirectResponse
    {
        Chauffeur::create($request->validated());

        return back()->with('success', 'Chauffeur enregistré avec succès.');
    }

    public function update(UpdateChauffeurRequest $request, Chauffeur $chauffeur): RedirectResponse
    {
        $chauffeur->update($request->validated());

        return back()->with('success', 'Chauffeur mis à jour.');
    }

    public function destroy(Chauffeur $chauffeur): RedirectResponse
    {
        $chauffeur->delete();

        return back()->with('success', 'Chauffeur supprimé.');
    }
}
