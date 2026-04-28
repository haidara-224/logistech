<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreCamionRequest;
use App\Http\Requests\Logistique\UpdateCamionRequest;
use App\Models\Camion;
use Illuminate\Http\RedirectResponse;

class CamionController extends Controller
{
    public function store(StoreCamionRequest $request): RedirectResponse
    {
        Camion::create($request->validated());

        return back()->with('success', 'Camion enregistré avec succès.');
    }

    public function update(UpdateCamionRequest $request, Camion $camion): RedirectResponse
    {
        $camion->update($request->validated());

        return back()->with('success', 'Camion mis à jour.');
    }

    public function destroy(Camion $camion): RedirectResponse
    {
        $camion->delete();

        return back()->with('success', 'Camion supprimé.');
    }
}
