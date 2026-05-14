<?php

namespace App\Http\Controllers;

use App\Models\Depot;
use App\Models\Produit;
use App\Models\TransfertDepot;
use App\Services\TransfertService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransfertDepotController extends Controller
{
    public function __construct(private readonly TransfertService $service) {}

    public function index()
    {
        $transferts = TransfertDepot::with('depotSource', 'depotDestination')
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('transferts/Index', ['transferts' => $transferts]);
    }

    public function create()
    {
        $depots = Depot::select('id', 'nom')->orderBy('nom')->get();
        $produits = Produit::select('id', 'nom', 'sku', 'quantite_stock')
            ->where('quantite_stock', '>', 0)
            ->orderBy('nom')
            ->get();

        return Inertia::render('transferts/Create', compact('depots', 'produits'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'depot_source_id' => 'required|exists:depots,id',
            'depot_destination_id' => 'required|exists:depots,id|different:depot_source_id',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
        ]);

        $errors = [];
        foreach ($validated['items'] as $index => $item) {
            $produit = Produit::find($item['produit_id']);
            if ($produit && (int) $item['quantite'] > $produit->quantite_stock) {
                $errors["items.$index.quantite"] = "Quantité demandée ({$item['quantite']}) supérieure au stock disponible ({$produit->quantite_stock}) pour « {$produit->nom} ».";
            }
        }
        if (! empty($errors)) {
            return back()->withErrors($errors)->withInput();
        }

        $transfert = $this->service->create($validated);

        return redirect()->route('transferts.show', $transfert->id)->with('success', 'Transfert créé.');
    }

    public function show(TransfertDepot $transfert)
    {
        $transfert->load('depotSource', 'depotDestination', 'user', 'items.produit');

        return Inertia::render('transferts/Show', ['transfert' => $transfert]);
    }

    public function completer(TransfertDepot $transfert): RedirectResponse
    {
        if ($transfert->statut !== 'en_cours') {
            return back()->with('info', 'Ce transfert a déjà été traité.');
        }

        $this->service->completer($transfert);

        return redirect()->route('transferts.show', $transfert->id)->with('success', 'Transfert complété — stock mis à jour.');
    }
}
