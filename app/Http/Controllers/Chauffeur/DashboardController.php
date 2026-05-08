<?php

namespace App\Http\Controllers\Chauffeur;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;
use App\Models\Chauffeur;
use App\Models\ChauffeurNotification;
use App\Models\CongeChauffeur;
use App\Models\Expedition;
use App\Models\HseChauffeurDocument;
use App\Models\HseIncident;
use App\Models\Livraison;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private function chauffeur(): Chauffeur
    {
        $chauffeur = User::find(auth()->id())?->chauffeur;

        abort_unless($chauffeur !== null, 404, 'Aucun profil chauffeur associé.');

        return $chauffeur;
    }

    public function index(): Response
    {
        $chauffeur = $this->chauffeur();

        $activeExpedition = Expedition::with(['camion', 'produits', 'livraisons'])
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('statut', ['en préparation', 'en cours', 'livraison_soumise'])
            ->latest('date_depart')
            ->first();

        $agenda = Expedition::with('camion')
            ->where('chauffeur_id', $chauffeur->id)
            ->where('date_depart', '>=', now()->startOfDay())
            ->whereNotIn('statut', ['livré', 'annulé'])
            ->orderBy('date_depart')
            ->limit(10)
            ->get();

        $pastExpeditions = Expedition::with('camion')
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('statut', ['livré', 'annulé'])
            ->orderByDesc('date_depart')
            ->limit(10)
            ->get();

        $incidents = HseIncident::where('chauffeur_id', $chauffeur->id)
            ->orderByDesc('date_incident')
            ->limit(20)
            ->get();

        $documents = HseChauffeurDocument::where('chauffeur_id', $chauffeur->id)
            ->orderBy('date_expiration')
            ->get()
            ->append(['statut', 'jours_restants']);

        $conges = CongeChauffeur::where('chauffeur_id', $chauffeur->id)
            ->orderByDesc('date_debut')
            ->limit(20)
            ->get();

        $notifications = ChauffeurNotification::where('chauffeur_id', $chauffeur->id)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        return Inertia::render('chauffeur/Dashboard', [
            'chauffeur' => $chauffeur->load('user'),
            'activeExpedition' => $activeExpedition,
            'agenda' => $agenda,
            'pastExpeditions' => $pastExpeditions,
            'incidents' => $incidents,
            'documents' => $documents,
            'conges' => $conges,
            'notifications' => $notifications,
            'stats' => [
                'incidents_ouverts' => $incidents->where('statut', 'ouvert')->count(),
                'docs_expires' => $documents->where('statut', 'expire')->count(),
                'docs_expire_bientot' => $documents->where('statut', 'expire_bientot')->count(),
                'docs_valides' => $documents->where('statut', 'valide')->count(),
                'voyages_total' => Expedition::where('chauffeur_id', $chauffeur->id)->count(),
                'conges_en_attente' => $conges->where('statut', 'en_attente')->count(),
                'notifications_non_lues' => $notifications->whereNull('read_at')->count(),
            ],
        ]);
    }

    public function updateExpedition(Request $request, Expedition $expedition): RedirectResponse
    {
        $chauffeur = $this->chauffeur();
        abort_unless($expedition->chauffeur_id === $chauffeur->id, 403);

        $request->validate([
            'etat' => ['required', 'in:en cours,livré'],
            'commentaire' => ['nullable', 'string', 'max:500'],
            'km_reel' => ['nullable', 'integer', 'min:0', 'max:999999'],
        ]);

        Livraison::create([
            'expedition_id' => $expedition->id,
            'etat' => $request->etat,
            'commentaire' => $request->commentaire,
            'km_reel' => $request->km_reel,
            'date_statut' => now(),
        ]);

        if ($request->etat === 'en cours') {
            // Démarrage immédiat — pas besoin de validation admin
            $expedition->update(['statut' => 'en cours']);
            $expedition->camion->update(['statut' => 'en mission']);
            $chauffeur->update(['statut' => 'en mission']);

            AdminNotification::create([
                'type' => 'expedition_demarre',
                'message' => "Expédition {$expedition->reference} démarrée par {$chauffeur->prenom} {$chauffeur->nom}.",
                'data' => ['expedition_id' => $expedition->id, 'chauffeur_id' => $chauffeur->id],
            ]);
        } elseif ($request->etat === 'livré') {
            // La livraison est soumise mais attend la validation admin avant de clore l'expédition
            $expedition->update(['statut' => 'livraison_soumise']);

            AdminNotification::create([
                'type' => 'livraison',
                'message' => "Livraison soumise pour l'expédition {$expedition->reference} par {$chauffeur->prenom} {$chauffeur->nom}. En attente de validation.",
                'data' => ['expedition_id' => $expedition->id, 'chauffeur_id' => $chauffeur->id],
            ]);
        }

        return back()->with('success', 'Livraison soumise. En attente de validation admin.');
    }

    public function storeIncident(Request $request): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        $validated = $request->validate([
            'type' => ['required', 'string', 'max:50'],
            'date_incident' => ['required', 'date'],
            'lieu' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
            'blesses' => ['boolean'],
            'nb_blesses' => ['integer', 'min:0', 'max:99'],
            'dommages_vehicule' => ['boolean'],
            'cout_estime' => ['nullable', 'numeric', 'min:0'],
            'causes' => ['nullable', 'array'],
            'causes.*' => ['string', 'max:50'],
            'expedition_id' => ['nullable', 'exists:expeditions,id'],
        ]);

        HseIncident::create([
            ...$validated,
            'chauffeur_id' => $chauffeur->id,
            'camion_id' => Expedition::where('chauffeur_id', $chauffeur->id)
                ->whereIn('statut', ['en cours', 'en préparation'])
                ->latest()
                ->value('camion_id'),
            'statut' => 'ouvert',
        ]);

        AdminNotification::create([
            'type' => 'incident',
            'message' => "Incident déclaré par {$chauffeur->prenom} {$chauffeur->nom} : {$validated['type']}.",
            'data' => ['chauffeur_id' => $chauffeur->id],
        ]);

        return back()->with('success', 'Incident déclaré.');
    }

    public function resolveIncident(HseIncident $incident): RedirectResponse
    {
        $chauffeur = $this->chauffeur();
        abort_unless($incident->chauffeur_id === $chauffeur->id, 403);

        $next = match ($incident->statut) {
            'ouvert' => 'en_investigation',
            'en_investigation' => 'clos',
            default => $incident->statut,
        };

        $incident->update(['statut' => $next]);

        return back()->with('success', 'Statut mis à jour.');
    }

    public function storeConge(Request $request): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        $request->validate([
            'date_debut' => ['required', 'date', 'after_or_equal:today'],
            'date_fin' => ['required', 'date', 'after_or_equal:date_debut'],
            'type' => ['required', 'in:conge_annuel,maladie,recuperation,autre'],
            'motif' => ['nullable', 'string', 'max:1000'],
        ]);

        CongeChauffeur::create([
            'chauffeur_id' => $chauffeur->id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'type' => $request->type,
            'motif' => $request->motif,
            'statut' => 'en_attente',
        ]);

        AdminNotification::create([
            'type' => 'conge',
            'message' => "{$chauffeur->prenom} {$chauffeur->nom} a demandé un congé du {$request->date_debut} au {$request->date_fin}.",
            'data' => ['chauffeur_id' => $chauffeur->id],
        ]);

        return back()->with('success', 'Demande de congé envoyée.');
    }

    public function markNotificationsRead(): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        ChauffeurNotification::where('chauffeur_id', $chauffeur->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    public function editPassword(): Response
    {
        return Inertia::render('chauffeur/ChangePassword');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'password_confirmation' => ['required', 'string'],
        ]);

        User::find(auth()->id())?->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        return redirect()->route('chauffeur.dashboard')->with('success', 'Mot de passe mis à jour. Bienvenue !');
    }
}
