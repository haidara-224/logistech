<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\SoftDeletes;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(fn ($model) => $model->recordAudit('created', $model->attributesToArray()));

        static::updated(function ($model) {
            $dirty = collect($model->getDirty())
                ->except([
                    'password', 'remember_token',
                    'two_factor_secret', 'two_factor_recovery_codes',
                    'deleted_at', 'updated_at',
                ])
                ->toArray();

            if (empty($dirty)) {
                return;
            }

            $model->recordAudit('updated', [
                'avant' => array_intersect_key($model->getOriginal(), $dirty),
                'après' => $dirty,
            ]);
        });

        static::deleted(fn ($model) => $model->recordAudit('deleted', null));

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class))) {
            static::restored(fn ($model) => $model->recordAudit('restored', null));
        }
    }

    private function recordAudit(string $action, mixed $data): void
    {
        AuditLog::record($action, static::class, $this->id, $this->buildAuditDescription($action), $data);
    }

    private function buildAuditDescription(string $action): string
    {
        $actionLabels = [
            'created' => 'Création',
            'updated' => 'Modification',
            'deleted' => 'Suppression',
            'restored' => 'Restauration',
        ];

        $modelLabels = [
            'Produit' => 'du produit',
            'Commande' => 'de la commande',
            'Client' => 'du client',
            'Categorie' => 'de la catégorie',
            'Facture' => 'de la facture',
            'Paiement' => 'du paiement',
            'Devis' => 'du devis',
            'Expedition' => "de l'expédition",
            'Livraison' => 'de la livraison',
            'Camion' => 'du camion',
            'Chauffeur' => 'du chauffeur',
            'Mouvements_stock' => 'du mouvement de stock',
            'Contact' => 'du contact',
            'NewsletterSubscription' => 'de la newsletter',
            'User' => "de l'utilisateur",
            'Commande_item' => "de l'article de commande",
            'ImageProduit' => "de l'image produit",
        ];

        $shortClass = class_basename($this);
        $modelLabel = $modelLabels[$shortClass] ?? "de {$shortClass}";
        $actionLabel = $actionLabels[$action] ?? $action;

        $name = $this->nom ?? $this->name ?? $this->prenom ?? null;
        $namePart = $name ? " \"{$name}\"" : '';

        return "{$actionLabel} {$modelLabel}{$namePart} #{$this->id}";
    }
}
