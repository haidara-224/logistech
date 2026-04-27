<?php

namespace App\Services;

use App\Models\Paiement;
use App\Models\Commande;
use App\Models\Facture;
use Illuminate\Support\Facades\DB;
use App\Events\PaiementRecu;

class PaiementService
{
    public function registerPayment(int $commandeId, array $data)
    {
        return DB::transaction(function () use ($commandeId, $data) {
            $commande = Commande::findOrFail($commandeId);

            $paiement = Paiement::create([
                'commande_id' => $commande->id,
                'montant' => $data['montant'],
                'mode_paiement' => $data['mode_paiement'] ?? ($data['methode'] ?? 'espece'),
                'status' => $data['status'] ?? 'effectue',
                'date_paiement' => $data['date_paiement'] ?? now(),
            ]);

            // update commande status
            $commande->status = $data['status'] ?? 'payer';
            $commande->save();

            // create simple facture
            $facture = Facture::create([
                'commande_id' => $commande->id,
                'numero_facture' => 'F-' . now()->format('Ymd') . '-' . $commande->id,
                'date_emission' => now(),
                'montant_total' => $paiement->montant,
            ]);

            event(new PaiementRecu($paiement));

            return compact('paiement', 'facture', 'commande');
        });
    }
}
