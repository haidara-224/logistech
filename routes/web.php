<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\SocialiteController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Socialite\Facades\Socialite;


Route::get("/",[HomeController::class,'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
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
