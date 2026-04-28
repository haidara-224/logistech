<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class RestoreController extends Controller
{
    public function index()
    {
        return Inertia::render('restoration/restore', [
            'camions' => Camion::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'chauffeurs' => Chauffeur::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'expeditions' => Expedition::onlyTrashed()->orderByDesc('deleted_at')->get(),
        ]);
    }

    public function restoreCamion(int $id): RedirectResponse
    {
        $camion = Camion::onlyTrashed()->findOrFail($id);
        $camion->restore();

        return back()->with('success', 'Camion restauré.');
    }

    public function restoreChauffeur(int $id): RedirectResponse
    {
        $chauffeur = Chauffeur::onlyTrashed()->findOrFail($id);
        $chauffeur->restore();

        return back()->with('success', 'Chauffeur restauré.');
    }

    public function restoreExpedition(int $id): RedirectResponse
    {
        $expedition = Expedition::onlyTrashed()->findOrFail($id);
        $expedition->restore();

        return back()->with('success', 'Expédition restaurée.');
    }
}
