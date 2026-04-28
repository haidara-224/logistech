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
            ->limit(12)
            ->get();
        $produits = Produit::where('quantite_stock', '>', 0)
            ->orderBy('nom')
            ->get();

        return Inertia::render('logistique/Index', [
            'camions' => $camions,
            'chauffeurs' => $chauffeurs,
            'camionsDisponibles' => $camions->where('statut', 'disponible')->values(),
            'chauffeursDisponibles' => $chauffeurs->where('statut', 'disponible')->values(),
            'expeditions' => $expeditions,
            'livraisons' => $livraisons,
            'produits' => $produits,
            'stats' => [
                'camions_disponibles' => $camions->where('statut', 'disponible')->count(),
                'expeditions_en_cours' => $expeditions->where('statut', 'en cours')->count(),
                'livraisons_en_preparation' => $expeditions->where('statut', 'en préparation')->count(),
                'livraisons_livrees' => $expeditions->where('statut', 'livré')->count(),
                'chauffeurs_en_mission' => $chauffeurs->where('statut', 'en mission')->count(),
            ],
        ]);
    }
}
