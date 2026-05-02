<?php

namespace App\Services;

use App\Contracts\StockServiceInterface;
use App\Models\Mouvements_stock;
use Illuminate\Support\Facades\DB;

class StockService implements StockServiceInterface
{
    public function adjustStock(int $produitId, string $type, int $quantite, string $source = null, $referenceId = null): void
    {
        // Normalize type to migration values: 'entree' or 'sortie'
        $type = in_array($type, ['in', 'entree'], true) ? 'entree' : 'sortie';

        $payload = [
            'produit_id' => $produitId,
            'type' => $type,
            'quantite' => $quantite,
            'source' => $source,
        ];

        if ($referenceId !== null) {
            $payload['commande_id'] = $referenceId;
        }

        Mouvements_stock::create([
            'produit_id' => $produitId,
            'type' => $type,
            'quantite' => $quantite,
            'source' => "commande",
            'commande_id' => $referenceId,
        ]);
    }
}
