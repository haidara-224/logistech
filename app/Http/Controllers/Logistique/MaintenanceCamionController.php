<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceCamion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class MaintenanceCamionController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'camion_id' => 'required|exists:camions,id',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cout' => 'nullable|numeric|min:0',
            'kilometrage' => 'nullable|integer|min:0',
            'date_maintenance' => 'required|date',
            'prochaine_maintenance' => 'nullable|date|after:date_maintenance',
            'statut' => 'required|in:planifiée,en cours,terminée',
        ]);

        MaintenanceCamion::create($data);

        return back()->with('success', 'Maintenance enregistrée.');
    }

    public function update(Request $request, MaintenanceCamion $maintenanceCamion): RedirectResponse
    {
        $data = $request->validate([
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cout' => 'nullable|numeric|min:0',
            'kilometrage' => 'nullable|integer|min:0',
            'date_maintenance' => 'required|date',
            'prochaine_maintenance' => 'nullable|date|after:date_maintenance',
            'statut' => 'required|in:planifiée,en cours,terminée',
        ]);

        $maintenanceCamion->update($data);

        return back()->with('success', 'Maintenance mise à jour.');
    }

    public function destroy(MaintenanceCamion $maintenanceCamion): RedirectResponse
    {
        $maintenanceCamion->delete();

        return back()->with('success', 'Maintenance supprimée.');
    }
}
