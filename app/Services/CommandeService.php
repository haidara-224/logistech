<?php

namespace App\Services;

use App\Contracts\CommandeServiceInterface;
use App\Contracts\StockServiceInterface;
use App\Models\Commande;
use App\Models\Commande_item;
use Illuminate\Support\Facades\DB;

class CommandeService implements CommandeServiceInterface
{
    protected StockServiceInterface $stockService;

    public function __construct(StockServiceInterface $stockService)
    {
        $this->stockService = $stockService;
    }

    public function createCommande(array $data): Commande
    {
        return DB::transaction(function () use ($data) {
            $items = $data['items'] ?? [];

            $commande = Commande::create([
                'client_id' => $data['client_id'] ?? null,
                'user_id' => $data['user_id'] ?? null,
                'status' => $data['status'] ?? 'en_attente',
                'montant_total' => 0,
            ]);

            $total = 0;

            foreach ($items as $item) {
                $prixUnitaire = $item['prix_unitaire'] ?? 0;
                $quantite = $item['quantite'] ?? 0;
                $prixTotal = $prixUnitaire * $quantite;

                $ci = Commande_item::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $item['produit_id'],
                    'quantite' => $quantite,
                    'prix_unitaire' => $prixUnitaire,
                    'prix_total' => $prixTotal,
                ]);

                // decrement stock via stock service
                $this->stockService->adjustStock($item['produit_id'], 'out', $quantite, 'commande', $commande->id);

                $total += $prixTotal;
            }

            $commande->montant_total = $total;
            $commande->save();

            return $commande;
        });
    }
}
