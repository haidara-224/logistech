<?php

use App\Models\Produit;
use App\Models\User;
use App\Services\AchatService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $this->service = app(AchatService::class);
});

it('creates an achat with items and calculates total', function () {
    $produit = Produit::factory()->create(['prix_achat' => 10000, 'quantite_stock' => 5]);

    $achat = $this->service->create([
        'fournisseur_id' => null,
        'frais_transport' => 5000,
        'droits_douane' => 0,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 10, 'prix_achat_unitaire' => 12000],
        ],
    ]);

    expect($achat->statut)->toBe('brouillon')
        ->and($achat->montant_total)->toBe(120000.0)
        ->and($achat->items)->toHaveCount(1);
});

it('calculates prix moyen pondéré correctly', function () {
    $produit = Produit::factory()->create(['prix_achat' => 10000, 'quantite_stock' => 10]);

    $achat = $this->service->create([
        'fournisseur_id' => null,
        'frais_transport' => 0,
        'droits_douane' => 0,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 10, 'prix_achat_unitaire' => 20000],
        ],
    ]);

    $item = $achat->items->first();
    // PMP = (10 * 10000 + 10 * 20000) / 20 = 15000
    expect((float) $item->nouveau_prix_moyen)->toBe(15000.0)
        ->and((float) $item->ancien_prix_achat)->toBe(10000.0);
});

it('validates achat updates product stock and prix_achat', function () {
    $produit = Produit::factory()->create(['prix_achat' => 10000, 'quantite_stock' => 5]);

    $achat = $this->service->create([
        'fournisseur_id' => null,
        'frais_transport' => 0,
        'droits_douane' => 0,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 5, 'prix_achat_unitaire' => 20000],
        ],
    ]);

    $this->service->valider($achat);

    $produit->refresh();
    // Stock: 5 + 5 = 10
    expect($produit->quantite_stock)->toBe(10)
        // PMP: (5*10000 + 5*20000) / 10 = 15000
        ->and((float) $produit->prix_achat)->toBe(15000.0);

    $achat->refresh();
    expect($achat->statut)->toBe('valide');
});

it('creates a mouvement_stock on validation', function () {
    $produit = Produit::factory()->create(['prix_achat' => 5000, 'quantite_stock' => 0]);

    $achat = $this->service->create([
        'fournisseur_id' => null,
        'frais_transport' => 0,
        'droits_douane' => 0,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 3, 'prix_achat_unitaire' => 5000],
        ],
    ]);

    $this->service->valider($achat);

    $this->assertDatabaseHas('mouvements_stocks', [
        'produit_id' => $produit->id,
        'type' => 'entree',
        'quantite' => 3,
        'source' => 'achat',
        'achat_id' => $achat->id,
    ]);
});
