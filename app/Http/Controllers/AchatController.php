<?php

namespace App\Http\Controllers;

use App\Models\Achat;
use App\Models\Facture;
use App\Models\Fournisseur;
use App\Models\Produit;
use App\Services\AchatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AchatController extends Controller
{
    public function __construct(private readonly AchatService $service) {}

    public function index()
    {
        $achats = Achat::with('fournisseur')
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'total' => Achat::count(),
            'ce_mois' => Achat::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
            'montant_mois' => Achat::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->sum('montant_total') ?? 0,
        ];

        return Inertia::render('achats/Index', compact('achats', 'stats'));
    }

    public function create()
    {
        $fournisseurs = Fournisseur::select('id', 'nom')->orderBy('nom')->get();
        $produits = Produit::with('images.image')
            ->select('id', 'nom', 'sku', 'prix_achat', 'quantite_stock')
            ->orderBy('nom')
            ->get();

        return Inertia::render('achats/Create', compact('fournisseurs', 'produits'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'frais_transport' => 'nullable|numeric|min:0',
            'droits_douane' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'items.*.prix_achat_unitaire' => 'required|numeric|min:0',
            'items.*.prix_vente_nouveau' => 'nullable|numeric|min:0',
        ]);

        $achat = $this->service->create($validated);

        return redirect()->route('achats.show', $achat->id)->with('success', 'Achat enregistré.');
    }

    public function show(Achat $achat)
    {
        $achat->load('fournisseur', 'items.produit', 'facture', 'bonReception');

        return Inertia::render('achats/Show', ['achat' => $achat]);
    }

    public function valider(Achat $achat): RedirectResponse
    {
        if ($achat->statut !== 'brouillon') {
            return back()->with('info', 'Cet achat a déjà été traité.');
        }

        $this->service->valider($achat);

        return redirect()->route('achats.show', $achat->id)->with('success', 'Achat validé — stock mis à jour.');
    }

    public function generateFacture(Achat $achat): RedirectResponse
    {
        $existing = $achat->facture;

        if ($existing) {
            return redirect()->route('factures.show', $existing->id)->with('info', 'Une facture existe déjà pour cet achat.');
        }

        $nextId = (Facture::withTrashed()->max('id') ?? 0) + 1;

        $facture = Facture::create([
            'achat_id' => $achat->id,
            'numero_facture' => 'FAC-'.now()->year.'-'.str_pad($nextId, 5, '0', STR_PAD_LEFT),
            'type' => 'achat',
            'statut' => 'emise',
            'montant_total' => $achat->montant_total ?? 0,
            'frais_transport' => $achat->frais_transport ?? 0,
            'droits_douane' => $achat->droits_douane ?? 0,
            'notes' => $achat->notes,
            'date_emission' => now(),
        ]);

        return redirect()->route('factures.show', $facture->id)->with('success', 'Facture d\'achat générée.');
    }
}
