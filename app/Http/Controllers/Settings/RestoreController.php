<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Camion;
use App\Models\Categorie;
use App\Models\Chauffeur;
use App\Models\Client;
use App\Models\Commande;
use App\Models\Devis;
use App\Models\Expedition;
use App\Models\Facture;
use App\Models\Livraison;
use App\Models\Mouvements_stock;
use App\Models\Paiement;
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
            'commandes' => Commande::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'categories' => Categorie::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'clients' => Client::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'devis' => Devis::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'livraisons' => Livraison::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'factures' => Facture::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'paiements' => Paiement::onlyTrashed()->orderByDesc('deleted_at')->get(),
            'mouvements' => Mouvements_stock::onlyTrashed()->orderByDesc('deleted_at')->get(),
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

    public function restoreCommande(int $id): RedirectResponse
    {
        $commande = Commande::onlyTrashed()->findOrFail($id);
        $commande->restore();

        return back()->with('success', 'Commande restaurée.');
    }

    public function restoreCategorie(int $id): RedirectResponse
    {
        Categorie::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Catégorie restaurée.');
    }

    public function restoreClient(int $id): RedirectResponse
    {
        Client::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Client restauré.');
    }

    public function restoreDevis(int $id): RedirectResponse
    {
        Devis::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Devis restauré.');
    }

    public function restoreLivraison(int $id): RedirectResponse
    {
        Livraison::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Livraison restaurée.');
    }

    public function restoreFacture(int $id): RedirectResponse
    {
        Facture::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Facture restaurée.');
    }

    public function restorePaiement(int $id): RedirectResponse
    {
        Paiement::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Paiement restauré.');
    }

    public function restoreMouvement(int $id): RedirectResponse
    {
        Mouvements_stock::onlyTrashed()->findOrFail($id)->restore();

        return back()->with('success', 'Mouvement de stock restauré.');
    }

    public function restoreAll(): RedirectResponse
    {
        Camion::onlyTrashed()->restore();
        Chauffeur::onlyTrashed()->restore();
        Expedition::onlyTrashed()->restore();
        User::onlyTrashed()->restore();
        Produit::onlyTrashed()->restore();
        Commande::onlyTrashed()->restore();
        Categorie::onlyTrashed()->restore();
        Client::onlyTrashed()->restore();
        Devis::onlyTrashed()->restore();
        Livraison::onlyTrashed()->restore();
        Facture::onlyTrashed()->restore();
        Paiement::onlyTrashed()->restore();
        Mouvements_stock::onlyTrashed()->restore();

        return back()->with('success', 'Toutes les données restaurées.');
    }

    public function emptyTrash(): RedirectResponse
    {
        Camion::onlyTrashed()->forceDelete();
        Chauffeur::onlyTrashed()->forceDelete();
        Expedition::onlyTrashed()->forceDelete();
        User::onlyTrashed()->forceDelete();
        Produit::onlyTrashed()->forceDelete();
        Commande::onlyTrashed()->forceDelete();
        Categorie::onlyTrashed()->forceDelete();
        Client::onlyTrashed()->forceDelete();
        Devis::onlyTrashed()->forceDelete();
        Livraison::onlyTrashed()->forceDelete();
        Facture::onlyTrashed()->forceDelete();
        Paiement::onlyTrashed()->forceDelete();
        Mouvements_stock::onlyTrashed()->forceDelete();

        return back()->with('success', 'Corbeille vidée — suppression définitive effectuée.');
    }

    public function forceDeleteCategorie(int $id): RedirectResponse
    {
        Categorie::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Catégorie supprimée définitivement.');
    }

    public function forceDeleteClient(int $id): RedirectResponse
    {
        Client::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Client supprimé définitivement.');
    }

    public function forceDeleteDevis(int $id): RedirectResponse
    {
        Devis::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Devis supprimé définitivement.');
    }

    public function forceDeleteLivraison(int $id): RedirectResponse
    {
        Livraison::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Livraison supprimée définitivement.');
    }

    public function forceDeleteFacture(int $id): RedirectResponse
    {
        Facture::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Facture supprimée définitivement.');
    }

    public function forceDeletePaiement(int $id): RedirectResponse
    {
        Paiement::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Paiement supprimé définitivement.');
    }

    public function forceDeleteMouvement(int $id): RedirectResponse
    {
        Mouvements_stock::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Mouvement de stock supprimé définitivement.');
    }

    public function forceDeleteCamion(int $id): RedirectResponse
    {
        Camion::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Camion supprimé définitivement.');
    }

    public function forceDeleteChauffeur(int $id): RedirectResponse
    {
        Chauffeur::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Chauffeur supprimé définitivement.');
    }

    public function forceDeleteExpedition(int $id): RedirectResponse
    {
        Expedition::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Expédition supprimée définitivement.');
    }

    public function forceDeleteUser(int $id): RedirectResponse
    {
        User::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Utilisateur supprimé définitivement.');
    }

    public function forceDeleteProduit(int $id): RedirectResponse
    {
        Produit::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Produit supprimé définitivement.');
    }

    public function forceDeleteCommande(int $id): RedirectResponse
    {
        Commande::onlyTrashed()->findOrFail($id)->forceDelete();

        return back()->with('success', 'Commande supprimée définitivement.');
    }
}
