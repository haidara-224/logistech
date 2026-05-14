<?php

namespace App\Http\Controllers;

use App\Models\BonSortie;
use App\Models\Depot;
use App\Models\Produit;
use App\Services\BonSortieService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BonSortieController extends Controller
{
    public function __construct(private readonly BonSortieService $service) {}

    public function index()
    {
        $bonsSortie = BonSortie::with('user', 'depot')
            ->orderByDesc('created_at')
            ->paginate(20);

        $stats = [
            'total' => BonSortie::count(),
            'ce_mois' => BonSortie::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
            'valides' => BonSortie::where('statut', 'valide')->count(),
        ];

        return Inertia::render('bons-sortie/Index', compact('bonsSortie', 'stats'));
    }

    public function create()
    {
        $depots = Depot::select('id', 'nom')->orderBy('nom')->get();
        $produits = Produit::with('images.image')
            ->select('id', 'nom', 'sku', 'quantite_stock')
            ->orderBy('nom')
            ->get();

        return Inertia::render('bons-sortie/Create', compact('depots', 'produits'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'depot_id' => 'nullable|exists:depots,id',
            'motif' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
        ]);

        $errors = [];
        foreach ($validated['items'] as $index => $item) {
            $produit = Produit::find($item['produit_id']);
            if ($produit && $item['quantite'] > $produit->quantite_stock) {
                $errors["items.$index.quantite"] = "Quantité demandée ({$item['quantite']}) supérieure au stock disponible ({$produit->quantite_stock}) pour « {$produit->nom} ».";
            }
        }
        if (! empty($errors)) {
            return back()->withErrors($errors)->withInput();
        }

        $bs = $this->service->create($validated);

        return redirect()->route('bons-sortie.show', $bs->id)->with('success', 'Bon de sortie créé.');
    }

    public function show(BonSortie $bonSortie)
    {
        $bonSortie->load('user', 'depot', 'items.produit');

        return Inertia::render('bons-sortie/Show', ['bonSortie' => $bonSortie]);
    }

    public function valider(BonSortie $bonSortie): RedirectResponse
    {
        if ($bonSortie->statut !== 'brouillon') {
            return back()->with('info', 'Ce bon de sortie a déjà été traité.');
        }

        $this->service->valider($bonSortie);

        return redirect()->route('bons-sortie.show', $bonSortie->id)->with('success', 'Bon de sortie validé — stock mis à jour.');
    }

    public function annuler(BonSortie $bonSortie): RedirectResponse
    {
        if ($bonSortie->statut === 'valide') {
            return back()->with('error', 'Un bon de sortie validé ne peut pas être annulé.');
        }

        $this->service->annuler($bonSortie);

        return redirect()->route('bons-sortie.show', $bonSortie->id)->with('success', 'Bon de sortie annulé.');
    }
}
