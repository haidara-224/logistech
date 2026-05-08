<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Models\Chauffeur;
use App\Models\ChauffeurNotification;
use App\Models\CongeChauffeur;
use App\Models\Expedition;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CongesController extends Controller
{
    public function index(): Response
    {
        $conges = CongeChauffeur::with('chauffeur')
            ->orderByDesc('created_at')
            ->get();

        $chauffeurs = Chauffeur::orderBy('nom')->get(['id', 'nom', 'prenom']);

        return Inertia::render('logistique/Conges', [
            'conges' => $conges,
            'chauffeurs' => $chauffeurs,
            'stats' => [
                'en_attente' => $conges->where('statut', 'en_attente')->count(),
                'approuve' => $conges->where('statut', 'approuve')->count(),
                'refuse' => $conges->where('statut', 'refuse')->count(),
            ],
        ]);
    }

    public function updateStatut(Request $request, CongeChauffeur $conge): RedirectResponse
    {
        $request->validate([
            'statut' => ['required', 'in:approuve,refuse'],
            'commentaire_admin' => ['nullable', 'string', 'max:1000'],
        ]);

        $conge->update([
            'statut' => $request->statut,
            'commentaire_admin' => $request->commentaire_admin,
        ]);

        $chauffeur = $conge->chauffeur;

        if ($request->statut === 'approuve') {
            // Free the camion from any active expedition before setting the driver on leave
            $activeExpedition = Expedition::with('camion')
                ->where('chauffeur_id', $chauffeur->id)
                ->whereIn('statut', ['en préparation', 'en cours'])
                ->latest()
                ->first();

            if ($activeExpedition?->camion) {
                $activeExpedition->camion->update(['statut' => 'disponible']);
            }

            $chauffeur->update(['statut' => 'en_repos']);

            ChauffeurNotification::create([
                'chauffeur_id' => $chauffeur->id,
                'type' => 'conge_approuve',
                'message' => "Votre congé du {$conge->date_debut->format('d/m/Y')} au {$conge->date_fin->format('d/m/Y')} a été approuvé.",
                'data' => ['conge_id' => $conge->id],
            ]);
        } else {
            ChauffeurNotification::create([
                'chauffeur_id' => $chauffeur->id,
                'type' => 'conge_refuse',
                'message' => "Votre congé du {$conge->date_debut->format('d/m/Y')} au {$conge->date_fin->format('d/m/Y')} a été refusé.".
                    ($request->commentaire_admin ? " Motif : {$request->commentaire_admin}" : ''),
                'data' => ['conge_id' => $conge->id],
            ]);
        }

        return back()->with('success', 'Décision enregistrée.');
    }

    public function destroy(CongeChauffeur $conge): RedirectResponse
    {
        $conge->delete();

        return back()->with('success', 'Demande supprimée.');
    }
}
