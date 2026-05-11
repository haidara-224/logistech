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
use App\Models\InspectionPredepart;
use App\Models\Livraison;
use App\Models\RapportCarburant;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private function chauffeur(): Chauffeur
    {
        $chauffeur = User::find(Auth::id())?->chauffeur;

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

        $rapportsCarburant = RapportCarburant::where('chauffeur_id', $chauffeur->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        $lastInspection = InspectionPredepart::where('chauffeur_id', $chauffeur->id)
            ->latest()
            ->first();

        // Score conducteur
        $totalVoyages = Expedition::where('chauffeur_id', $chauffeur->id)->count();
        $voyagesLivres = Expedition::where('chauffeur_id', $chauffeur->id)
            ->where('statut', 'livré')
            ->count();
        $totalIncidents = HseIncident::where('chauffeur_id', $chauffeur->id)->count();
        $totalKm = Livraison::whereHas('expedition', fn ($q) => $q->where('chauffeur_id', $chauffeur->id))
            ->whereNotNull('km_reel')
            ->sum('km_reel');
        $totalLitres = $rapportsCarburant->sum('litres');
        $score = [
            'ponctualite' => $totalVoyages > 0 ? round(($voyagesLivres / $totalVoyages) * 100) : 100,
            'securite' => $totalVoyages > 0 ? max(0, round((1 - $totalIncidents / $totalVoyages) * 100)) : 100,
            'km_total' => (int) $totalKm,
            'litres_total' => round((float) $totalLitres, 1),
            'co2_kg' => round((float) $totalLitres * 2.67, 1),
        ];

        return Inertia::render('chauffeur/Dashboard', [
            'chauffeur' => $chauffeur->load('user'),
            'activeExpedition' => $activeExpedition,
            'agenda' => $agenda,
            'pastExpeditions' => $pastExpeditions,
            'incidents' => $incidents,
            'documents' => $documents,
            'conges' => $conges,
            'notifications' => $notifications,
            'rapportsCarburant' => $rapportsCarburant,
            'lastInspection' => $lastInspection,
            'score' => $score,
            'stats' => [
                'incidents_ouverts' => $incidents->where('statut', 'ouvert')->count(),
                'docs_expires' => $documents->where('statut', 'expire')->count(),
                'docs_expire_bientot' => $documents->where('statut', 'expire_bientot')->count(),
                'docs_valides' => $documents->where('statut', 'valide')->count(),
                'voyages_total' => $totalVoyages,
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
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'max:5120'],
        ]);

        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $photoPaths[] = Storage::disk('public')->put('incidents', $photo);
            }
        }

        HseIncident::create([
            ...$validated,
            'chauffeur_id' => $chauffeur->id,
            'camion_id' => Expedition::where('chauffeur_id', $chauffeur->id)
                ->whereIn('statut', ['en cours', 'en préparation'])
                ->latest()
                ->value('camion_id'),
            'statut' => 'ouvert',
            'photos_paths' => $photoPaths,
        ]);

        AdminNotification::create([
            'type' => 'incident',
            'message' => "Incident déclaré par {$chauffeur->prenom} {$chauffeur->nom} : {$validated['type']}.",
            'data' => ['chauffeur_id' => $chauffeur->id],
        ]);

        return back()->with('success', 'Incident déclaré.');
    }

    public function storeInspection(Request $request): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        $validated = $request->validate([
            'expedition_id' => ['nullable', 'exists:expeditions,id'],
            'freins' => ['boolean'],
            'pneus' => ['boolean'],
            'feux' => ['boolean'],
            'cargaison' => ['boolean'],
            'extincteur' => ['boolean'],
            'trousse_secours' => ['boolean'],
            'documents_bord' => ['boolean'],
            'niveaux_fluides' => ['boolean'],
            'observations' => ['nullable', 'string', 'max:1000'],
        ]);

        $camionId = $request->expedition_id
            ? Expedition::find($request->expedition_id)?->camion_id
            : Expedition::where('chauffeur_id', $chauffeur->id)
                ->whereIn('statut', ['en cours', 'en préparation'])
                ->latest()
                ->value('camion_id');

        InspectionPredepart::create([
            ...$validated,
            'chauffeur_id' => $chauffeur->id,
            'camion_id' => $camionId,
        ]);

        return back()->with('success', 'Inspection pré-départ enregistrée.');
    }

    public function storeCarburant(Request $request): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        $validated = $request->validate([
            'litres' => ['required', 'numeric', 'min:1', 'max:2000'],
            'cout' => ['nullable', 'numeric', 'min:0'],
            'station' => ['nullable', 'string', 'max:255'],
            'km_compteur' => ['nullable', 'integer', 'min:0'],
            'expedition_id' => ['nullable', 'exists:expeditions,id'],
        ]);

        $camionId = $request->expedition_id
            ? Expedition::find($request->expedition_id)?->camion_id
            : Expedition::where('chauffeur_id', $chauffeur->id)
                ->whereIn('statut', ['en cours', 'en préparation'])
                ->latest()
                ->value('camion_id');

        RapportCarburant::create([
            ...$validated,
            'chauffeur_id' => $chauffeur->id,
            'camion_id' => $camionId,
        ]);

        return back()->with('success', 'Rapport carburant enregistré.');
    }

    public function storeSos(Request $request): RedirectResponse
    {
        $chauffeur = $this->chauffeur();

        $request->validate([
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        AdminNotification::create([
            'type' => 'sos',
            'message' => "🆘 SOS de {$chauffeur->prenom} {$chauffeur->nom}".($request->message ? " : {$request->message}" : '.'),
            'data' => [
                'chauffeur_id' => $chauffeur->id,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'message' => $request->message,
            ],
        ]);

        return back()->with('success', 'SOS envoyé. Les équipes ont été alertées.');
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

        User::find(Auth::id())?->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        return redirect()->route('chauffeur.dashboard')->with('success', 'Mot de passe mis à jour. Bienvenue !');
    }
}
