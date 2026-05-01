<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use App\Models\Produit;
use App\Models\User;
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
            'users' => User::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'produits' => Produit::onlyTrashed()->orderByDesc('deleted_at')->get(),
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
    public function restoreUser(int $id): RedirectResponse
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return back()->with('success', 'Utilisateur restauré.');
    }
    public function restoreproduit(int $id): RedirectResponse
    {
        $produit = Produit::onlyTrashed()->findOrFail($id);
        $produit->restore();

        return back()->with('success', 'Produit restauré.');
    }   
    public function restoreAll(): RedirectResponse
    {
        Camion::onlyTrashed()->restore();
        Chauffeur::onlyTrashed()->restore();
        Expedition::onlyTrashed()->restore();
        User::onlyTrashed()->restore();
        Produit::onlyTrashed()->restore();
        return back()->with('success', 'Toutes les données restaurées.');
    }

}
