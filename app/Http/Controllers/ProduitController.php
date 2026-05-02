<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProduitRequest;
use App\Http\Requests\UpdateProduitRequest;
use App\Models\Categorie;
use App\Models\Image;
use App\Models\ImageProduit;
use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProduitController extends Controller
{
    public function index()
    {
        $search = request()->input('search', '');

        $query = Produit::with(['categorie', 'images.image'])->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('categorie', fn ($cat) => $cat->where('name', 'like', "%{$search}%"));
            });
        }

        $produits = $query->paginate(20);

        $stats = [
            'total_produits' => Produit::count(),
            'valeur_stock' => Produit::sum(DB::raw('prix_vente * COALESCE(quantite_stock, 0)')) ?? 0,
            'produits_rupture' => Produit::where('quantite_stock', 0)->count(),
            'produits_faible_stock' => Produit::whereColumn('quantite_stock', '<=', 'stock_minimal')
                ->where('quantite_stock', '>', 0)
                ->count(),
        ];

        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Index', [
            'produits' => $produits,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Create', ['categories' => $categories]);
    }

    public function store(StoreProduitRequest $request): RedirectResponse
    {
        $produit = Produit::create($request->validated());
        Mouvements_stock::create([
            'produit_id' => $produit->id,
            'quantite' => $produit->quantite_stock,
            'type' => 'entree',
              'source' => 'ajustement',
        ]);

        $this->storeImages($produit, $request->file('images', []));

        return redirect()->route('produits.index')->with('success', 'Produit créé avec succès.');
    }

    public function show(Produit $produit)
    {
        $produit->load(['categorie', 'images.image', 'mouvements']);

        return Inertia::render('produits/Show', ['produit' => $produit]);
    }

    public function edit(Produit $produit)
    {
        $produit->load(['categorie', 'images.image']);
        $categories = Categorie::select('id', 'name')->get();

        return Inertia::render('produits/Edit', ['produit' => $produit, 'categories' => $categories]);
    }

    public function update(UpdateProduitRequest $request, Produit $produit): RedirectResponse
    {
        $produit->update($request->validated());

        // Delete removed images
        foreach ($request->input('deleted_image_ids', []) as $imageProduitId) {
            $pivot = ImageProduit::with('image')->where('id', $imageProduitId)->where('produit_id', $produit->id)->first();
            if ($pivot) {
                Storage::disk('public')->delete($pivot->image->image_path);
                $pivot->image->delete();
                $pivot->delete();
            }
        }

        $this->storeImages($produit, $request->file('images', []));
        Mouvements_stock::updateOrCreate(
            ['produit_id' => $produit->id],
            [
                'produit_id' => $produit->id,
                'quantite' => $produit->quantite_stock,
                'type' => 'entree',
                'source' => 'ajustement',
            ]
        );
        return redirect()->back()->with('success', 'Produit mis à jour.');
    }

    public function destroy(Produit $produit): RedirectResponse
    {
        $produit->delete();

        return redirect()->back()->with('success', 'Produit supprimé.');
    }

    private function storeImages(Produit $produit, array $files): void
    {
        foreach ($files as $file) {
            $path = $file->store('produits', 'public');
            $image = Image::create(['image_path' => $path]);
            ImageProduit::create(['produit_id' => $produit->id, 'image_id' => $image->id]);
        }
    }
}
