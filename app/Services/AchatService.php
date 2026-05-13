<?php

namespace App\Services;

use App\Models\Achat;
use App\Models\AchatItem;
use App\Models\Mouvements_stock;
use App\Models\Produit;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AchatService
{
    /**
     * @param array{
     *   fournisseur_id: int|null,
     *   notes: string|null,
     *   frais_transport: float,
     *   droits_douane: float,
     *   items: array<array{produit_id: int, quantite: int, prix_achat_unitaire: float, prix_vente_nouveau?: float|null}>
     * } $data
     */
    public function create(array $data): Achat
    {
        return DB::transaction(function () use ($data) {
            $nextId = (Achat::withTrashed()->max('id') ?? 0) + 1;

            $achat = Achat::create([
                'fournisseur_id' => $data['fournisseur_id'] ?? null,
                'user_id' => Auth::id(),
                'numero_achat' => 'ACH-'.now()->format('Ymd').'-'.str_pad($nextId, 4, '0', STR_PAD_LEFT),
                'statut' => 'brouillon',
                'frais_transport' => $data['frais_transport'] ?? 0,
                'droits_douane' => $data['droits_douane'] ?? 0,
                'notes' => $data['notes'] ?? null,
                'date_achat' => now(),
                'montant_total' => 0,
            ]);

            $total = 0;

            foreach ($data['items'] as $itemData) {
                $produit = Produit::findOrFail($itemData['produit_id']);
                $qteActuelle = max(0, $produit->quantite_stock ?? 0);
                $ancienPrix = (float) ($produit->prix_achat ?? 0);
                $nouveauPrix = (float) $itemData['prix_achat_unitaire'];
                $qteNouvelle = (int) $itemData['quantite'];

                $prixMoyen = $qteActuelle + $qteNouvelle > 0
                    ? round(($qteActuelle * $ancienPrix + $qteNouvelle * $nouveauPrix) / ($qteActuelle + $qteNouvelle), 2)
                    : $nouveauPrix;

                $prixTotal = round($qteNouvelle * $nouveauPrix, 2);
                $total += $prixTotal;

                AchatItem::create([
                    'achat_id' => $achat->id,
                    'produit_id' => $produit->id,
                    'quantite' => $qteNouvelle,
                    'prix_achat_unitaire' => $nouveauPrix,
                    'prix_total' => $prixTotal,
                    'ancien_prix_achat' => $ancienPrix,
                    'nouveau_prix_moyen' => $prixMoyen,
                    'prix_vente_nouveau' => isset($itemData['prix_vente_nouveau']) && $itemData['prix_vente_nouveau'] > 0
                        ? (float) $itemData['prix_vente_nouveau']
                        : null,
                ]);
            }

            $achat->update(['montant_total' => $total]);

            return $achat;
        });
    }

    public function valider(Achat $achat): void
    {
        DB::transaction(function () use ($achat) {
            $achat->load('items.produit');

            foreach ($achat->items as $item) {
                $produit = $item->produit;

                $updates = [
                    'prix_achat' => $item->nouveau_prix_moyen,
                    'quantite_stock' => $produit->quantite_stock + $item->quantite,
                ];

                if ($item->prix_vente_nouveau !== null && $item->prix_vente_nouveau > 0) {
                    $updates['prix_vente'] = $item->prix_vente_nouveau;
                }

                $produit->update($updates);

                Mouvements_stock::create([
                    'produit_id' => $produit->id,
                    'type' => 'entree',
                    'quantite' => $item->quantite,
                    'source' => 'achat',
                    'achat_id' => $achat->id,
                    'user_id' => Auth::id(),
                    'prix_unitaire' => $item->prix_achat_unitaire,
                    'note' => "Achat {$achat->numero_achat}",
                ]);
            }

            $achat->update(['statut' => 'valide']);
        });
    }
}
