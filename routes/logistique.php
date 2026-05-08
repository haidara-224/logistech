<?php

use App\Http\Controllers\Logistique\CamionController;
use App\Http\Controllers\Logistique\ChauffeurController;
use App\Http\Controllers\Logistique\CongesController;
use App\Http\Controllers\Logistique\ExpeditionController;
use App\Http\Controllers\Logistique\HseController;
use App\Http\Controllers\Logistique\LivraisonController;
use App\Http\Controllers\Logistique\LogistiqueController;
use App\Http\Controllers\Logistique\MaintenanceCamionController;
use App\Http\Controllers\Logistique\PlanificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin|super admin'])->prefix('dashboard')->group(function () {
    Route::get('logistique', [LogistiqueController::class, 'index'])->name('logistique.index');
    Route::get('planification', [PlanificationController::class, 'index'])->name('planification.index');

    Route::post('logistique/camions', [CamionController::class, 'store'])->name('logistique.camions.store');
    Route::put('logistique/camions/{camion}', [CamionController::class, 'update'])->name('logistique.camions.update');
    Route::delete('logistique/camions/{camion}', [CamionController::class, 'destroy'])->name('logistique.camions.destroy');

    Route::post('logistique/chauffeurs', [ChauffeurController::class, 'store'])->name('logistique.chauffeurs.store');
    Route::put('logistique/chauffeurs/{chauffeur}', [ChauffeurController::class, 'update'])->name('logistique.chauffeurs.update');
    Route::delete('logistique/chauffeurs/{chauffeur}', [ChauffeurController::class, 'destroy'])->name('logistique.chauffeurs.destroy');

    Route::post('logistique/expeditions', [ExpeditionController::class, 'store'])->name('logistique.expeditions.store');
    Route::put('logistique/expeditions/{expedition}', [ExpeditionController::class, 'update'])->name('logistique.expeditions.update');
    Route::patch('logistique/expeditions/{expedition}/statut', [ExpeditionController::class, 'updateStatus'])->name('logistique.expeditions.status.update');
    Route::patch('logistique/expeditions/{expedition}/annuler', [ExpeditionController::class, 'annuler'])->name('logistique.expeditions.annuler');
    Route::delete('logistique/expeditions/{expedition}', [ExpeditionController::class, 'destroy'])->name('logistique.expeditions.destroy');

    Route::post('logistique/livraisons', [LivraisonController::class, 'store'])->name('logistique.livraisons.store');
    Route::patch('logistique/livraisons/{livraison}/valider', [LivraisonController::class, 'valider'])->name('logistique.livraisons.valider');

    // Congés chauffeurs (admin)
    Route::get('conges', [CongesController::class, 'index'])->name('conges.index');
    Route::patch('conges/{conge}/statut', [CongesController::class, 'updateStatut'])->name('conges.statut');
    Route::delete('conges/{conge}', [CongesController::class, 'destroy'])->name('conges.destroy');

    Route::post('logistique/maintenances', [MaintenanceCamionController::class, 'store'])->name('logistique.maintenances.store');
    Route::put('logistique/maintenances/{maintenanceCamion}', [MaintenanceCamionController::class, 'update'])->name('logistique.maintenances.update');
    Route::delete('logistique/maintenances/{maintenanceCamion}', [MaintenanceCamionController::class, 'destroy'])->name('logistique.maintenances.destroy');

    // HSE
    Route::get('hse', [HseController::class, 'index'])->name('hse.index');

    Route::post('hse/chauffeurs/{chauffeur}/documents', [HseController::class, 'storeChauffeurDoc'])->name('hse.chauffeur_docs.store');
    Route::post('hse/chauffeur-documents/{doc}', [HseController::class, 'updateChauffeurDoc'])->name('hse.chauffeur_docs.update');
    Route::delete('hse/chauffeur-documents/{doc}', [HseController::class, 'destroyChauffeurDoc'])->name('hse.chauffeur_docs.destroy');

    Route::post('hse/camions/{camion}/documents', [HseController::class, 'storeCamionDoc'])->name('hse.camion_docs.store');
    Route::post('hse/camion-documents/{doc}', [HseController::class, 'updateCamionDoc'])->name('hse.camion_docs.update');
    Route::delete('hse/camion-documents/{doc}', [HseController::class, 'destroyCamionDoc'])->name('hse.camion_docs.destroy');

    Route::post('hse/incidents', [HseController::class, 'storeIncident'])->name('hse.incidents.store');
    Route::put('hse/incidents/{incident}', [HseController::class, 'updateIncident'])->name('hse.incidents.update');
    Route::patch('hse/incidents/{incident}/statut', [HseController::class, 'patchIncidentStatut'])->name('hse.incidents.statut');
    Route::delete('hse/incidents/{incident}', [HseController::class, 'destroyIncident'])->name('hse.incidents.destroy');
});
