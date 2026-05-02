<?php

namespace App\Http\Controllers;

use App\Events\AdminActivityEvent;
use App\Models\AdminNotification;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'telephone' => 'nullable|string|max:30',
            'message' => 'required|string|max:2000',
        ]);

        $contact = Contact::create($validated);

        $notif = AdminNotification::create([
            'type' => 'contact',
            'message' => "Nouveau message de contact de {$contact->nom}",
            'data' => ['id' => $contact->id, 'nom' => $contact->nom, 'email' => $contact->email],
        ]);

        rescue(fn () => broadcast(new AdminActivityEvent(
            type: 'contact',
            message: $notif->message,
            data: array_merge($notif->data, ['notif_id' => $notif->id]),
        )));

        return back()->with('success', 'Votre message a bien été envoyé.');
    }

    public function index(): Response
    {
        $contacts = Contact::latest()->get();

        return Inertia::render('contact/index', [
            'contacts' => $contacts,
            'stats' => [
                'total' => $contacts->count(),
                'non_lus' => $contacts->where('lu', false)->count(),
                'lus' => $contacts->where('lu', true)->count(),
            ],
        ]);
    }

    public function markRead(Contact $contact): RedirectResponse
    {
        $contact->update(['lu' => true]);

        return back();
    }

    public function destroy(Contact $contact): RedirectResponse
    {
        $contact->delete();

        return back()->with('success', 'Message supprimé.');
    }
}
