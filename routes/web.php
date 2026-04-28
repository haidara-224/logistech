<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SocialiteController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Socialite\Facades\Socialite;


Route::get("/",[HomeController::class,'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard/recent-orders', [DashboardController::class, 'recentOrdersJson'])->name('dashboard.recent_orders');
    // Product routes handled by controller (Inertia)
    Route::get('produits', [App\Http\Controllers\ProduitController::class, 'index'])->name('produits.index');
    Route::get('produits/creer', [App\Http\Controllers\ProduitController::class, 'create'])->name('produits.create');
    Route::post('produits', [App\Http\Controllers\ProduitController::class, 'store'])->name('produits.store');
    Route::get('produits/{produit}', [App\Http\Controllers\ProduitController::class, 'show'])->name('produits.show');
    Route::get('produits/{produit}/modifier', [App\Http\Controllers\ProduitController::class, 'edit'])->name('produits.edit');
    Route::put('produits/{produit}', [App\Http\Controllers\ProduitController::class, 'update'])->name('produits.update');
    Route::delete('produits/{produit}', [App\Http\Controllers\ProduitController::class, 'destroy'])->name('produits.destroy');
    
    // Category routes
    Route::get('categories', [App\Http\Controllers\CategorieController::class, 'index'])->name('categories.index');
    Route::get('categories/creer', [App\Http\Controllers\CategorieController::class, 'create'])->name('categories.create');
    Route::post('categories', [App\Http\Controllers\CategorieController::class, 'store'])->name('categories.store');
    Route::get('categories/{categorie}', [App\Http\Controllers\CategorieController::class, 'show'])->name('categories.show');
    Route::get('categories/{categorie}/modifier', [App\Http\Controllers\CategorieController::class, 'edit'])->name('categories.edit');
    Route::put('categories/{categorie}', [App\Http\Controllers\CategorieController::class, 'update'])->name('categories.update');
    Route::delete('categories/{categorie}', [App\Http\Controllers\CategorieController::class, 'destroy'])->name('categories.destroy');

    // Client routes
    Route::get('clients', [App\Http\Controllers\ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/creer', [App\Http\Controllers\ClientController::class, 'create'])->name('clients.create');
    Route::post('clients', [App\Http\Controllers\ClientController::class, 'store'])->name('clients.store');
    Route::get('clients/{client}', [App\Http\Controllers\ClientController::class, 'show'])->name('clients.show');
    Route::get('clients/{client}/modifier', [App\Http\Controllers\ClientController::class, 'edit'])->name('clients.edit');
    Route::put('clients/{client}', [App\Http\Controllers\ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [App\Http\Controllers\ClientController::class, 'destroy'])->name('clients.destroy');

    // Commande routes
    Route::get('commandes', [App\Http\Controllers\CommandeController::class, 'index'])->name('commandes.index');
    Route::get('commandes/creer', [App\Http\Controllers\CommandeController::class, 'create'])->name('commandes.create');
    Route::post('commandes', [App\Http\Controllers\CommandeController::class, 'store'])->name('commandes.store');
    Route::get('commandes/{commande}', [App\Http\Controllers\CommandeController::class, 'show'])->name('commandes.show');
    Route::delete('commandes/{commande}', [App\Http\Controllers\CommandeController::class, 'destroy'])->name('commandes.destroy');

    // Paiement routes (for a commande)
    Route::get('commandes/{commande}/paiements/creer', [App\Http\Controllers\PaiementController::class, 'create'])->name('paiements.create');
    Route::post('commandes/{commande}/paiements', [App\Http\Controllers\PaiementController::class, 'register'])->name('paiements.register');
});
Route::get('/auth/redirect', function () {
    return Socialite::driver('google')->redirect();
});
Route::get('/auth/google/redirect', [SocialiteController::class, 'redirectToGoogle'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'handleGoogleCallback']);

Route::get('/auth/callback', function () {
    $githubUser = Socialite::driver('google')->user();

    $user = User::updateOrCreate([
        'google_id' => $githubUser->id,
    ], [
        'name' => $githubUser->name,
        'email' => $githubUser->email,
        'google_token' => $githubUser->token,
        'google_refresh_token' => $githubUser->refreshToken,
    ]);

    Auth::login($user);

    return redirect()->back();
});

require __DIR__.'/settings.php';
