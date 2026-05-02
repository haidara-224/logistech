<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use App\Models\Livraison;
use App\Models\Produit;
use Inertia\Inertia;

class LogistiqueController extends Controller
{
    public function index()
    {
        $camions = Camion::orderBy('immatriculation')->get();
        $chauffeurs = Chauffeur::orderBy('nom')->get();
        $expeditions = Expedition::with(['camion', 'chauffeur', 'produits', 'livraisons'])
            ->orderByDesc('date_depart')
            ->get();
        $livraisons = Livraison::with('expedition')
            ->orderByDesc('date_statut')
            ->limit(50)
            ->get();
        $produits = Produit::where('quantite_stock', '>', 0)
            ->orderBy('nom')
            ->get();

        $retards = $expeditions
            ->whereNotIn('statut', ['livré', 'annulé'])
            ->filter(fn ($e) => $e->date_arrivee_prevue && $e->date_arrivee_prevue->lt(now()))
            ->values();

        $livrees = $expeditions->where('statut', 'livré')->count();
        $avecDate = $expeditions
            ->whereNotNull('date_arrivee_prevue')
            ->whereIn('statut', ['livré'])
            ->count();
        $alTemps = $expeditions
            ->where('statut', 'livré')
            ->filter(fn ($e) => $e->date_arrivee_prevue && $e->date_depart && $e->date_depart->lte($e->date_arrivee_prevue))
            ->count();

        return Inertia::render('logistique/Index', [
            'camions' => $camions,
            'chauffeurs' => $chauffeurs,
            'camionsDisponibles' => $camions->where('statut', 'disponible')->values(),
            'chauffeursDisponibles' => $chauffeurs->where('statut', 'disponible')->values(),
            'expeditions' => $expeditions,
            'livraisons' => $livraisons,
            'produits' => $produits,
            'retards' => $retards,
            'stats' => [
                'camions_disponibles' => $camions->where('statut', 'disponible')->count(),
                'camions_en_maintenance' => $camions->where('statut', 'maintenance')->count(),
                'expeditions_en_cours' => $expeditions->where('statut', 'en cours')->count(),
                'expeditions_en_retard' => $retards->count(),
                'livraisons_en_preparation' => $expeditions->where('statut', 'en préparation')->count(),
                'livraisons_livrees' => $livrees,
                'chauffeurs_en_mission' => $chauffeurs->where('statut', 'en mission')->count(),
                'taux_ponctualite' => $avecDate > 0 ? (int) round(($alTemps / $avecDate) * 100) : null,
            ],
        ]);
    }
}
