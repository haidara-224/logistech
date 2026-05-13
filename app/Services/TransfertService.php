<?php

namespace App\Services;

use App\Models\Mouvements_stock;
use App\Models\TransfertDepot;
use App\Models\TransfertItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransfertService
{
    /**
     * @param array{
     *   depot_source_id: int,
     *   depot_destination_id: int,
     *   notes: string|null,
     *   items: array<array{produit_id: int, quantite: int}>
     * } $data
     */
    public function create(array $data): TransfertDepot
    {
        return DB::transaction(function () use ($data) {
            $nextId = (TransfertDepot::withTrashed()->max('id') ?? 0) + 1;

            $transfert = TransfertDepot::create([
                'depot_source_id' => $data['depot_source_id'],
                'depot_destination_id' => $data['depot_destination_id'],
                'user_id' => Auth::id(),
                'numero_transfert' => 'TRF-'.now()->format('Ymd').'-'.str_pad($nextId, 4, '0', STR_PAD_LEFT),
                'statut' => 'en_cours',
                'notes' => $data['notes'] ?? null,
                'date_transfert' => now(),
            ]);

            foreach ($data['items'] as $itemData) {
                TransfertItem::create([
                    'transfert_id' => $transfert->id,
                    'produit_id' => $itemData['produit_id'],
                    'quantite' => $itemData['quantite'],
                ]);
            }

            return $transfert;
        });
    }

    public function completer(TransfertDepot $transfert): void
    {
        DB::transaction(function () use ($transfert) {
            $transfert->load('items.produit');

            foreach ($transfert->items as $item) {
                Mouvements_stock::create([
                    'produit_id' => $item->produit_id,
                    'type' => 'sortie',
                    'quantite' => $item->quantite,
                    'source' => 'transfert',
                    'transfert_id' => $transfert->id,
                    'user_id' => Auth::id(),
                    'note' => "Transfert {$transfert->numero_transfert} — sortie dépôt #{$transfert->depot_source_id}",
                ]);

                Mouvements_stock::create([
                    'produit_id' => $item->produit_id,
                    'type' => 'entree',
                    'quantite' => $item->quantite,
                    'source' => 'transfert',
                    'transfert_id' => $transfert->id,
                    'user_id' => Auth::id(),
                    'note' => "Transfert {$transfert->numero_transfert} — entrée dépôt #{$transfert->depot_destination_id}",
                ]);
            }

            $transfert->update(['statut' => 'complete']);
        });
    }
}
