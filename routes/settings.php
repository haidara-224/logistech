<?php

use App\Http\Controllers\Settings\PermissionController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\RestoreController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
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

        Route::get('/permissions', [PermissionController::class, 'index'])->name('settings.permissions.index');
        Route::post('/permissions/users', [PermissionController::class, 'storeUser'])->name('settings.permissions.users.store');
        Route::put('/permissions/users/{user}', [PermissionController::class, 'updateUser'])->name('settings.permissions.users.update');
        Route::post('/permissions/roles', [PermissionController::class, 'storeRole'])->name('settings.permissions.roles.store');
        Route::post('/permissions/permissions', [PermissionController::class, 'storePermission'])->name('settings.permissions.permissions.store');
    });
});
