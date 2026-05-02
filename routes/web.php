<?php

use App\Http\Controllers\BoutiqueController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevisController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MouvementsStockController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\PanierController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\VenteController;
use App\Models\AdminNotification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/images', [HomeController::class, 'images'])->name('images');

// Routes publiques
Route::post('/devis', [DevisController::class, 'store'])->name('devis.store');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::post('/newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');

// Boutique publique
Route::get('/boutique', [BoutiqueController::class, 'index'])->name('boutique.index');
Route::get('/boutique/checkout', [CheckoutController::class, 'create'])->name('boutique.checkout');
Route::post('/boutique/checkout', [CheckoutController::class, 'store'])->name('boutique.checkout.store');
Route::get('/boutique/confirmation', [CheckoutController::class, 'confirmation'])->name('boutique.confirmation');

// Panier (API JSON)
Route::post('/panier', [PanierController::class, 'store'])->name('panier.store');
Route::patch('/panier/{produitId}', [PanierController::class, 'update'])->name('panier.update');
Route::delete('/panier/{produitId}', [PanierController::class, 'destroy'])->name('panier.destroy');
Route::delete('/panier', [PanierController::class, 'clear'])->name('panier.clear');

Route::middleware(['auth', 'verified', 'role:admin|super admin'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/dashboard/recent-orders', [DashboardController::class, 'recentOrdersJson'])->name('dashboard.recent_orders');

    // Notifications admin
    Route::get('/admin/notifications', function () {
        return response()->json(
            AdminNotification::latest()->limit(50)->get(['id', 'type', 'message', 'data', 'read_at', 'created_at'])
        );
    })->name('admin.notifications');

    Route::patch('/admin/notifications/read-all', function () {
        AdminNotification::whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    })->name('admin.notifications.read_all');

    // Devis (admin)
    Route::get('/devis', [DevisController::class, 'index'])->name('devis.index');
    Route::patch('/devis/{devi}', [DevisController::class, 'update'])->name('devis.update');
    Route::delete('/devis/{devi}', [DevisController::class, 'destroy'])->name('devis.destroy');

    // Contact (admin)
    Route::get('/contact', [ContactController::class, 'index'])->name('contact.index');
    Route::patch('/contact/{contact}/read', [ContactController::class, 'markRead'])->name('contact.read');
    Route::delete('/contact/{contact}', [ContactController::class, 'destroy'])->name('contact.destroy');

    // Newsletter (admin)
    Route::get('/newsletter', [NewsletterController::class, 'index'])->name('newsletter.index');
    Route::delete('/newsletter/{newsletterSubscription}', [NewsletterController::class, 'destroy'])->name('newsletter.destroy');
    // Product routes handled by controller (Inertia)
    Route::get('produits', [ProduitController::class, 'index'])->name('produits.index');
    Route::get('produits/creer', [ProduitController::class, 'create'])->name('produits.create');
    Route::post('produits', [ProduitController::class, 'store'])->name('produits.store');
    Route::get('produits/{produit}', [ProduitController::class, 'show'])->name('produits.show');
    Route::get('produits/{produit}/modifier', [ProduitController::class, 'edit'])->name('produits.edit');
    Route::put('produits/{produit}', [ProduitController::class, 'update'])->name('produits.update');
    Route::delete('produits/{produit}', [ProduitController::class, 'destroy'])->name('produits.destroy');

    // Category routes
    Route::get('categories', [CategorieController::class, 'index'])->name('categories.index');
    Route::get('categories/creer', [CategorieController::class, 'create'])->name('categories.create');
    Route::post('categories', [CategorieController::class, 'store'])->name('categories.store');
    Route::get('categories/{categorie}', [CategorieController::class, 'show'])->name('categories.show');
    Route::get('categories/{categorie}/modifier', [CategorieController::class, 'edit'])->name('categories.edit');
    Route::put('categories/{categorie}', [CategorieController::class, 'update'])->name('categories.update');
    Route::delete('categories/{categorie}', [CategorieController::class, 'destroy'])->name('categories.destroy');

    // Client routes
    Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('clients/creer', [ClientController::class, 'create'])->name('clients.create');
    Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
    Route::get('clients/{client}/modifier', [ClientController::class, 'edit'])->name('clients.edit');
    Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    // Commande routes
    Route::get('commandes', [CommandeController::class, 'index'])->name('commandes.index');
    Route::get('commandes/creer', [CommandeController::class, 'create'])->name('commandes.create');
    Route::post('commandes', [CommandeController::class, 'store'])->name('commandes.store');
    Route::get('commandes/{commande}', [CommandeController::class, 'show'])->name('commandes.show');
    Route::delete('commandes/{commande}', [CommandeController::class, 'destroy'])->name('commandes.destroy');

    // Paiement routes (for a commande)
    Route::get('commandes/{commande}/paiements/creer', [PaiementController::class, 'create'])->name('paiements.create');
    Route::post('commandes/{commande}/paiements', [PaiementController::class, 'register'])->name('paiements.register');

    // Paiements list
    Route::get('paiements', [PaiementController::class, 'index'])->name('paiements.index');

    // Factures
    Route::get('factures', [FactureController::class, 'index'])->name('factures.index');
    Route::get('factures/{facture}', [FactureController::class, 'show'])->name('factures.show');

    // Ventes (commandes payées / CA)
    Route::get('ventes', [VenteController::class, 'index'])->name('ventes.index');

    // Mouvements & Ajustements de stock
    Route::get('mouvements', [MouvementsStockController::class, 'index'])->name('mouvements.index');
    Route::get('stock/ajustements', [MouvementsStockController::class, 'ajustements'])->name('stock.ajustements');
    Route::post('stock/ajustements', [MouvementsStockController::class, 'store'])->name('stock.ajustements.store');
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
require __DIR__.'/logistique.php';
