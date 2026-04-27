<?php

namespace App\Http\Controllers;

use App\Services\PaiementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class PaiementController extends Controller
{
    protected PaiementService $service;

    public function __construct(PaiementService $service)
    {
        $this->service = $service;
    }

    public function create($commandeId)
    {
        return Inertia::render('paiements/Create', ['commande_id' => $commandeId]);
    }

    public function register(Request $request, $commandeId): RedirectResponse
    {
        $data = $request->validate([
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'nullable|string',
            'status' => 'nullable|string',
            'date_paiement' => 'nullable|date'
        ]);

        $result = $this->service->registerPayment($commandeId, $data);

        return redirect()->route('commandes.show', $commandeId)->with('success', 'Paiement enregistré');
    }
}

