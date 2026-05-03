<?php

use App\Http\Controllers\Settings\PermissionController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\RestoreController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('dashboard')->group(function () {
    Route::redirect('settings', '/dashboard/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::middleware(['role:super admin'])->group(function () {
        Route::get('/restore', [RestoreController::class, 'index'])->name('settings.restore.index');
        Route::post('/restore/camions/{id}', [RestoreController::class, 'restoreCamion'])->name('settings.restore.camions');
        Route::post('/restore/chauffeurs/{id}', [RestoreController::class, 'restoreChauffeur'])->name('settings.restore.chauffeurs');
        Route::post('/restore/expeditions/{id}', [RestoreController::class, 'restoreExpedition'])->name('settings.restore.expeditions');
        Route::post('/restore/users/{id}', [RestoreController::class, 'restoreUser'])->name('settings.restore.users');
        Route::post('/restore/produits/{id}', [RestoreController::class, 'restoreproduit'])->name('settings.restore.produits');
        Route::post('/restore/commandes/{id}', [RestoreController::class, 'restoreCommande'])->name('settings.restore.commandes');
        Route::post('/restore/all', [RestoreController::class, 'restoreAll'])->name('settings.restore.all');
        Route::delete('/restore/empty', [RestoreController::class, 'emptyTrash'])->name('settings.restore.empty');
        Route::delete('/restore/camions/{id}', [RestoreController::class, 'forceDeleteCamion'])->name('settings.restore.camions.force');
        Route::delete('/restore/chauffeurs/{id}', [RestoreController::class, 'forceDeleteChauffeur'])->name('settings.restore.chauffeurs.force');
        Route::delete('/restore/expeditions/{id}', [RestoreController::class, 'forceDeleteExpedition'])->name('settings.restore.expeditions.force');
        Route::delete('/restore/users/{id}', [RestoreController::class, 'forceDeleteUser'])->name('settings.restore.users.force');
        Route::delete('/restore/produits/{id}', [RestoreController::class, 'forceDeleteProduit'])->name('settings.restore.produits.force');
        Route::delete('/restore/commandes/{id}', [RestoreController::class, 'forceDeleteCommande'])->name('settings.restore.commandes.force');

        Route::get('/permissions', [PermissionController::class, 'index'])->name('settings.permissions.index');
        Route::post('/permissions/users', [PermissionController::class, 'storeUser'])->name('settings.permissions.users.store');
        Route::put('/permissions/users/{user}', [PermissionController::class, 'updateUser'])->name('settings.permissions.users.update');
        Route::post('/permissions/roles', [PermissionController::class, 'storeRole'])->name('settings.permissions.roles.store');
        Route::post('/permissions/permissions', [PermissionController::class, 'storePermission'])->name('settings.permissions.permissions.store');
    });
});
