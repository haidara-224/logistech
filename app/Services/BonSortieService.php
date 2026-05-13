<?php

namespace App\Services;

use App\Models\BonSortie;
use App\Models\BonSortieItem;
use App\Models\Mouvements_stock;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BonSortieService
{
    /**
     * @param array{
     *   depot_id: int|null,
     *   motif: string|null,
     *   notes: string|null,
     *   items: array<array{produit_id: int, quantite: int}>
     * } $data
     */
    public function create(array $data): BonSortie
    {
        return DB::transaction(function () use ($data) {
            $nextId = (BonSortie::withTrashed()->max('id') ?? 0) + 1;

            $bs = BonSortie::create([
                'user_id' => Auth::id(),
                'depot_id' => $data['depot_id'] ?? null,
                'numero_bs' => 'BS-'.now()->format('Ymd').'-'.str_pad($nextId, 4, '0', STR_PAD_LEFT),
                'statut' => 'brouillon',
                'motif' => $data['motif'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $itemData) {
                BonSortieItem::create([
                    'bon_sortie_id' => $bs->id,
                    'produit_id' => $itemData['produit_id'],
                    'quantite' => $itemData['quantite'],
                ]);
            }

            return $bs;
        });
    }

    public function valider(BonSortie $bonSortie): void
    {
        DB::transaction(function () use ($bonSortie) {
            $bonSortie->load('items.produit');

            foreach ($bonSortie->items as $item) {
                $produit = $item->produit;

                $produit->decrement('quantite_stock', $item->quantite);

                Mouvements_stock::create([
                    'produit_id' => $produit->id,
                    'type' => 'sortie',
                    'quantite' => $item->quantite,
                    'source' => 'bon_sortie',
                    'bon_sortie_id' => $bonSortie->id,
                    'depot_id' => $bonSortie->depot_id,
                    'user_id' => Auth::id(),
                    'note' => "Bon de sortie {$bonSortie->numero_bs}".($bonSortie->motif ? ' — '.$bonSortie->motif : ''),
                ]);
            }

            $bonSortie->update([
                'statut' => 'valide',
                'date_emission' => now(),
            ]);
        });
    }

    public function annuler(BonSortie $bonSortie): void
    {
        $bonSortie->update(['statut' => 'annule']);
    }
}
