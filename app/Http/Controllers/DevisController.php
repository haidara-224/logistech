<?php

namespace App\Http\Controllers;

use App\Events\AdminActivityEvent;
use App\Models\AdminNotification;
use App\Models\Devis;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DevisController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service' => 'required|string|max:100',
            'nom' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'telephone' => 'nullable|string|max:30',
            'delai' => 'nullable|string|max:100',
            'message' => 'nullable|string|max:2000',
        ]);

        $devis = Devis::create($validated);

        $notif = AdminNotification::create([
            'type' => 'devis',
            'message' => "Nouvelle demande de devis de {$devis->nom} ({$devis->service})",
            'data' => ['id' => $devis->id, 'nom' => $devis->nom, 'service' => $devis->service],
        ]);

        rescue(fn () => broadcast(new AdminActivityEvent(
            type: 'devis',
            message: $notif->message,
            data: array_merge($notif->data, ['notif_id' => $notif->id]),
        )));

        return back()->with('success', 'Votre demande de devis a bien été envoyée.');
    }

    public function index(): Response
    {
        $devis = Devis::latest()->get();

        return Inertia::render('devis/index', [
            'devis' => $devis,
            'stats' => [
                'total' => $devis->count(),
                'nouveau' => $devis->where('statut', 'nouveau')->count(),
                'vu' => $devis->where('statut', 'vu')->count(),
                'traite' => $devis->where('statut', 'traite')->count(),
            ],
        ]);
    }

    public function update(Request $request, Devis $devi): RedirectResponse
    {
        $request->validate(['statut' => 'required|in:nouveau,vu,traite']);
        $devi->update(['statut' => $request->statut]);

        return back()->with('success', 'Statut mis à jour.');
    }

    public function destroy(Devis $devi): RedirectResponse
    {
        $devi->delete();

        return back()->with('success', 'Demande supprimée.');
    }
}
