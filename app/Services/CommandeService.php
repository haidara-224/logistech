<?php

namespace App\Services;

use App\Contracts\CommandeServiceInterface;
use App\Contracts\StockServiceInterface;
use App\Models\Commande;
use App\Models\Commande_item;
use Illuminate\Support\Facades\Auth;
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
                'user_id' => Auth::id(),
                'status' => $data['status'] ?? 'en_attente',
                'source' => $data['source'] ?? 'pos',
                'montant_total' => 0,
                'frais_transport' => $data['frais_transport'] ?? 0,
                'droits_douane' => $data['droits_douane'] ?? 0,
                'notes' => $data['notes'] ?? null,
            ]);

            $total = 0;

            foreach ($items as $item) {
                $prixUnitaire = $item['prix_unitaire'] ?? 0;
                $quantite = $item['quantite'] ?? 0;
                $prixTotal = $prixUnitaire * $quantite;

                Commande_item::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $item['produit_id'],
                    'quantite' => $quantite,
                    'prix_unitaire' => $prixUnitaire,
                    'prix_total' => $prixTotal,
                ]);

                $this->stockService->adjustStock($item['produit_id'], 'out', $quantite, $data['source'] ?? 'online', $commande->id);

                $total += $prixTotal;
            }

            $commande->montant_total = $total;
            $commande->save();

            return $commande;
        });
    }
}
