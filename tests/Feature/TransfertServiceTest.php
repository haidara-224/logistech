<?php

use App\Models\Depot;
use App\Models\Produit;
use App\Models\User;
use App\Services\TransfertService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    $this->service = app(TransfertService::class);
});

it('creates a transfert with items', function () {
    $source = Depot::factory()->create(['nom' => 'Entrepôt A']);
    $destination = Depot::factory()->create(['nom' => 'Entrepôt B']);
    $produit = Produit::factory()->create(['quantite_stock' => 20]);

    $transfert = $this->service->create([
        'depot_source_id' => $source->id,
        'depot_destination_id' => $destination->id,
        'notes' => null,
        'items' => [
            ['produit_id' => $produit->id, 'quantite' => 5],
        ],
    ]);

    expect($transfert->statut)->toBe('en_cours')
        ->and($transfert->depot_source_id)->toBe($source->id)
        ->and($transfert->items)->toHaveCount(1);
});

it('generates a unique numero_transfert', function () {
    $source = Depot::factory()->create();
    $dest = Depot::factory()->create();
    $produit = Produit::factory()->create(['quantite_stock' => 50]);

    $t1 = $this->service->create(['depot_source_id' => $source->id, 'depot_destination_id' => $dest->id, 'notes' => null, 'items' => [['produit_id' => $produit->id, 'quantite' => 1]]]);
    $t2 = $this->service->create(['depot_source_id' => $source->id, 'depot_destination_id' => $dest->id, 'notes' => null, 'items' => [['produit_id' => $produit->id, 'quantite' => 1]]]);

    expect($t1->numero_transfert)->not->toBe($t2->numero_transfert);
});

it('completes a transfert and creates mouvements stock', function () {
    $source = Depot::factory()->create();
    $dest = Depot::factory()->create();
    $produit = Produit::factory()->create(['quantite_stock' => 20]);

    $transfert = $this->service->create([
        'depot_source_id' => $source->id,
        'depot_destination_id' => $dest->id,
        'notes' => null,
        'items' => [['produit_id' => $produit->id, 'quantite' => 8]],
    ]);

    $this->service->completer($transfert);

    $transfert->refresh();
    expect($transfert->statut)->toBe('complete');

    $this->assertDatabaseHas('mouvements_stocks', [
        'produit_id' => $produit->id,
        'type' => 'sortie',
        'quantite' => 8,
        'source' => 'transfert',
        'transfert_id' => $transfert->id,
    ]);

    $this->assertDatabaseHas('mouvements_stocks', [
        'produit_id' => $produit->id,
        'type' => 'entree',
        'quantite' => 8,
        'source' => 'transfert',
        'transfert_id' => $transfert->id,
    ]);
});
