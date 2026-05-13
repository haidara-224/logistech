<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Facture;
use App\Models\Paiement;
use App\Services\PaiementService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaiementController extends Controller
{
    protected PaiementService $service;

    public function __construct(PaiementService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $paiements = Paiement::with('commande.client')
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'total_encaisse' => Paiement::where('status', 'effectue')->sum('montant') ?? 0,
            'ca_mois' => Paiement::where('status', 'effectue')
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('montant') ?? 0,
            'especes' => Paiement::where('mode_paiement', 'espece')->where('status', 'effectue')->sum('montant') ?? 0,
            'mobile_money' => Paiement::where('mode_paiement', 'mobile_money')->where('status', 'effectue')->sum('montant') ?? 0,
            'carte' => Paiement::where('mode_paiement', 'carte_bancaire')->where('status', 'effectue')->sum('montant') ?? 0,
            'nb_paiements' => Paiement::count(),
        ];

        $chart = Paiement::selectRaw('DATE(created_at) as date, SUM(montant) as total, COUNT(*) as nb')
            ->where('status', 'effectue')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupByRaw('DATE(created_at)')
            ->orderBy('date')
            ->get();

        return Inertia::render('paiements/Index', compact('paiements', 'stats', 'chart'));
    }

    public function createFromFacture(Facture $facture)
    {
        $facture->load('commande.client', 'commande.items.produit');

        return Inertia::render('paiements/Create', [
            'commande' => $facture->commande,
            'facture' => $facture,
        ]);
    }

    public function create(Commande $commande)
    {
        $commande->load('client', 'items.produit');
        $facture = $commande->factures()->where('type', 'vente')->latest()->first();

        return Inertia::render('paiements/Create', [
            'commande' => $commande,
            'facture' => $facture,
        ]);
    }

    public function register(Request $request, Commande $commande): RedirectResponse
    {
        $data = $request->validate([
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'nullable|string',
            'date_paiement' => 'nullable|date',
            'facture_id' => 'nullable|exists:factures,id',
        ]);

        $this->service->registerPayment($commande->id, $data, $data['facture_id'] ?? null);

        return redirect()->route('commandes.show', $commande->id)->with('success', 'Paiement enregistré');
    }
}
