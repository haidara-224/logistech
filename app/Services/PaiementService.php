<?php

namespace App\Services;

use App\Events\PaiementRecu;
use App\Models\Commande;
use App\Models\Facture;
use App\Models\Paiement;
use Illuminate\Support\Facades\DB;

class PaiementService
{
    public function registerPayment(int $commandeId, array $data, ?int $factureId = null)
    {
        return DB::transaction(function () use ($commandeId, $data, $factureId) {
            $commande = Commande::findOrFail($commandeId);

            $paiement = Paiement::create([
                'commande_id' => $commande->id,
                'facture_id' => $factureId,
                'montant' => $data['montant'],
                'mode_paiement' => $data['mode_paiement'] ?? ($data['methode'] ?? 'espece'),
                'status' => 'effectue',
                'date_paiement' => $data['date_paiement'] ?? now(),
            ]);

            $commande->status = 'payer';
            $commande->save();

            if ($factureId) {
                Facture::where('id', $factureId)->update(['statut' => 'payee']);
            }

            event(new PaiementRecu($paiement));

            return compact('paiement', 'commande');
        });
    }

    public function registerFacturePayment(Facture $facture, array $data): Paiement
    {
        return DB::transaction(function () use ($facture, $data) {
            $paiement = Paiement::create([
                'commande_id' => null,
                'facture_id' => $facture->id,
                'montant' => $data['montant'],
                'mode_paiement' => $data['mode_paiement'] ?? 'espece',
                'status' => 'effectue',
                'date_paiement' => $data['date_paiement'] ?? now(),
            ]);

            $facture->update(['statut' => 'payee']);

            return $paiement;
        });
    }
}
