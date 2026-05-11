<?php

namespace App\Console\Commands;

use App\Models\ChauffeurNotification;
use App\Models\HseChauffeurDocument;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('hse:notifier-expiration-documents')]
#[Description('Envoie une notification aux chauffeurs dont un document expire dans 30, 14 ou 7 jours.')]
class NotifierExpirationDocuments extends Command
{
    private const SEUILS = [30, 14, 7];

    public function handle(): int
    {
        $today = now()->startOfDay();
        $notified = 0;

        foreach (self::SEUILS as $seuil) {
            $cible = $today->copy()->addDays($seuil);

            $docs = HseChauffeurDocument::with('chauffeur')
                ->whereNotNull('date_expiration')
                ->whereNotNull('chauffeur_id')
                ->whereDate('date_expiration', $cible)
                ->get();

            foreach ($docs as $doc) {
                if (! $doc->chauffeur) {
                    continue;
                }

                $typeLabel = HseChauffeurDocument::typeLabel($doc->type);
                $message = "Votre {$typeLabel} expire dans {$seuil} jour".($seuil > 1 ? 's' : '').'.';

                $dejaCree = ChauffeurNotification::where('chauffeur_id', $doc->chauffeur->id)
                    ->where('type', 'document_expiration')
                    ->whereDate('created_at', $today)
                    ->where('data->document_id', $doc->id)
                    ->exists();

                if ($dejaCree) {
                    continue;
                }

                ChauffeurNotification::create([
                    'chauffeur_id' => $doc->chauffeur->id,
                    'type' => 'document_expiration',
                    'message' => $message,
                    'data' => [
                        'document_id' => $doc->id,
                        'document_type' => $doc->type,
                        'jours_restants' => $seuil,
                    ],
                ]);

                $notified++;
            }
        }

        $this->info("{$notified} notification(s) envoyée(s).");

        return self::SUCCESS;
    }
}
