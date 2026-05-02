<?php

namespace App\Http\Controllers;

use App\Events\AdminActivityEvent;
use App\Models\AdminNotification;
use App\Models\NewsletterSubscription;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|max:150|unique:newsletter_subscriptions,email',
        ], [
            'email.unique' => 'Cette adresse email est déjà abonnée.',
        ]);

        NewsletterSubscription::create(['email' => $request->email]);

        $notif = AdminNotification::create([
            'type' => 'newsletter',
            'message' => "Nouvel abonné newsletter : {$request->email}",
            'data' => ['email' => $request->email],
        ]);

        rescue(fn () => broadcast(new AdminActivityEvent(
            type: 'newsletter',
            message: $notif->message,
            data: array_merge($notif->data, ['notif_id' => $notif->id]),
        )));

        return back()->with('success', 'Vous êtes maintenant abonné à notre newsletter.');
    }

    public function index(): Response
    {
        $abonnes = NewsletterSubscription::latest()->get();

        return Inertia::render('newsletter/index', [
            'abonnes' => $abonnes,
            'total' => $abonnes->count(),
        ]);
    }

    public function destroy(NewsletterSubscription $newsletterSubscription): RedirectResponse
    {
        $newsletterSubscription->delete();

        return back()->with('success', 'Abonné supprimé.');
    }
}
