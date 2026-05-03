<?php

use App\Http\Controllers\Logistique\CamionController;
use App\Http\Controllers\Logistique\ChauffeurController;
use App\Http\Controllers\Logistique\ExpeditionController;
use App\Http\Controllers\Logistique\LivraisonController;
use App\Http\Controllers\Logistique\LogistiqueController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin|super admin'])->prefix('dashboard')->group(function () {
    Route::get('logistique', [LogistiqueController::class, 'index'])->name('logistique.index');

    Route::post('logistique/camions', [CamionController::class, 'store'])->name('logistique.camions.store');
    Route::put('logistique/camions/{camion}', [CamionController::class, 'update'])->name('logistique.camions.update');
    Route::delete('logistique/camions/{camion}', [CamionController::class, 'destroy'])->name('logistique.camions.destroy');

    Route::post('logistique/chauffeurs', [ChauffeurController::class, 'store'])->name('logistique.chauffeurs.store');
    Route::put('logistique/chauffeurs/{chauffeur}', [ChauffeurController::class, 'update'])->name('logistique.chauffeurs.update');
    Route::delete('logistique/chauffeurs/{chauffeur}', [ChauffeurController::class, 'destroy'])->name('logistique.chauffeurs.destroy');

    Route::post('logistique/expeditions', [ExpeditionController::class, 'store'])->name('logistique.expeditions.store');
    Route::put('logistique/expeditions/{expedition}', [ExpeditionController::class, 'update'])->name('logistique.expeditions.update');
    Route::patch('logistique/expeditions/{expedition}/statut', [ExpeditionController::class, 'updateStatus'])->name('logistique.expeditions.status.update');
    Route::delete('logistique/expeditions/{expedition}', [ExpeditionController::class, 'destroy'])->name('logistique.expeditions.destroy');

    Route::post('logistique/livraisons', [LivraisonController::class, 'store'])->name('logistique.livraisons.store');
});
