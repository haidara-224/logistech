<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use Inertia\Inertia;
use Inertia\Response;

class PlanificationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('planification/Index', [
            'camions' => Camion::orderBy('immatriculation')->get(),
            'chauffeurs' => Chauffeur::orderBy('nom')->get(),
            'expeditions' => Expedition::with(['camion', 'chauffeur', 'produits', 'livraisons'])
                ->orderByDesc('date_depart')
                ->get(),
        ]);
    }
}
