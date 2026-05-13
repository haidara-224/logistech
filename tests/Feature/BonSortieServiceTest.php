<?php

use App\Models\Produit;
use App\Models\User;
use App\Services\BonSortieService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $this->service = app(BonSortieService::class);
});

it('creates a bon de sortie with items', function () {
    $produit = Produit::factory()->create(['quantite_stock' => 20]);

    $bs = $this->service->create([
        'depot_id' => null,
        'motif' => 'Consommation interne',
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 5],
        ],
    ]);

    expect($bs->statut)->toBe('brouillon')
        ->and($bs->items)->toHaveCount(1);

    $produit->refresh();
    expect($produit->quantite_stock)->toBe(20); // no stock change until validation
});

it('validates a bon de sortie and deducts stock', function () {
    $produit = Produit::factory()->create(['quantite_stock' => 20]);

    $bs = $this->service->create([
        'depot_id' => null,
        'motif' => null,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 8],
        ],
    ]);

    $this->service->valider($bs);

    $produit->refresh();
    expect($produit->quantite_stock)->toBe(12);

    $bs->refresh();
    expect($bs->statut)->toBe('valide');
});

it('creates a mouvement_stock on validation', function () {
    $produit = Produit::factory()->create(['quantite_stock' => 10]);

    $bs = $this->service->create([
        'depot_id' => null,
        'motif' => 'Test',
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 3],
        ],
    ]);

    $this->service->valider($bs);

    $this->assertDatabaseHas('mouvements_stocks', [
        'produit_id' => $produit->id,
        'type' => 'sortie',
        'quantite' => 3,
        'source' => 'bon_sortie',
        'bon_sortie_id' => $bs->id,
    ]);
});
