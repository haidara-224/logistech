<?php

namespace App\Http\Controllers;

use App\Models\AgendaEvenement;
use App\Models\Expedition;
use App\Models\MaintenanceCamion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    public function index(): Response
    {
        $custom = AgendaEvenement::with('user')->orderBy('date_debut')->get();

        $expeditions = Expedition::with(['camion', 'chauffeur'])
            ->where(fn ($q) => $q->whereNotNull('date_depart')->orWhereNotNull('date_arrivee_prevue'))
            ->get();

        $maintenances = MaintenanceCamion::with('camion')
            ->where(fn ($q) => $q->whereNotNull('date_maintenance')->orWhereNotNull('prochaine_maintenance'))
            ->get();

        $events = collect();

        // Custom events
        foreach ($custom as $e) {
            $events->push([
                'id' => "custom-{$e->id}",
                'raw_id' => $e->id,
                'type' => 'custom',
                'titre' => $e->titre,
                'description' => $e->description,
                'date' => $e->date_debut->format('Y-m-d'),
                'date_fin' => $e->date_fin?->format('Y-m-d'),
                'heure' => $e->heure_debut,
                'couleur' => $e->couleur,
                'priorite' => $e->priorite,
                'editable' => true,
                'alerter_avant' => $e->alerter_avant,
            ]);
        }

        // Expedition departures
        foreach ($expeditions->whereNotNull('date_depart') as $exp) {
            $events->push([
                'id' => "exp-dep-{$exp->id}",
                'type' => 'expedition_depart',
                'titre' => "Départ — {$exp->reference}",
                'description' => "{$exp->origine} → {$exp->destination}".
                                 ($exp->chauffeur ? " · {$exp->chauffeur->nom}" : ''),
                'date' => $exp->date_depart->format('Y-m-d'),
                'couleur' => '#3B82F6',
                'priorite' => 'haute',
                'editable' => false,
                'statut' => $exp->statut,
                'camion' => $exp->camion?->immatriculation,
            ]);
        }

        // Expedition expected arrivals
        foreach ($expeditions->whereNotNull('date_arrivee_prevue') as $exp) {
            $isLate = $exp->statut !== 'livré' && $exp->statut !== 'annulé'
                && $exp->date_arrivee_prevue->lt(now());

            $events->push([
                'id' => "exp-arr-{$exp->id}",
                'type' => 'expedition_arrivee',
                'titre' => "Arrivée prévue — {$exp->reference}",
                'description' => "{$exp->origine} → {$exp->destination}".
                                 ($exp->chauffeur ? " · {$exp->chauffeur->nom}" : ''),
                'date' => $exp->date_arrivee_prevue->format('Y-m-d'),
                'couleur' => $isLate ? '#EF4444' : '#10B981',
                'priorite' => $isLate ? 'urgente' : 'normale',
                'editable' => false,
                'statut' => $exp->statut,
                'en_retard' => $isLate,
            ]);
        }

        // Maintenances réalisées
        foreach ($maintenances->whereNotNull('date_maintenance') as $m) {
            $events->push([
                'id' => "maint-{$m->id}",
                'type' => 'maintenance',
                'titre' => "Maintenance — {$m->camion?->immatriculation}",
                'description' => $m->type.($m->description ? " · {$m->description}" : ''),
                'date' => $m->date_maintenance->format('Y-m-d'),
                'couleur' => '#F59E0B',
                'priorite' => 'normale',
                'editable' => false,
                'statut' => $m->statut,
            ]);
        }

        // Prochaines maintenances
        foreach ($maintenances->whereNotNull('prochaine_maintenance') as $m) {
            $daysAhead = now()->diffInDays($m->prochaine_maintenance, false);
            $events->push([
                'id' => "maint-next-{$m->id}",
                'type' => 'maintenance_prochaine',
                'titre' => "Prochaine maintenance — {$m->camion?->immatriculation}",
                'description' => $m->type,
                'date' => $m->prochaine_maintenance->format('Y-m-d'),
                'couleur' => $daysAhead <= 7 ? '#EF4444' : '#F97316',
                'priorite' => $daysAhead <= 7 ? 'urgente' : 'haute',
                'editable' => false,
            ]);
        }

        // Alerts = events today or within next 30 days, sorted by urgency
        $priorityOrder = ['urgente' => 0, 'haute' => 1, 'normale' => 2, 'basse' => 3];
        $today = now()->startOfDay();

        $alertes = $events
            ->filter(fn ($e) => $today->diffInDays($e['date'], false) <= 30)
            ->sortBy([
                fn ($a, $b) => ($priorityOrder[$a['priorite']] ?? 4) <=> ($priorityOrder[$b['priorite']] ?? 4),
                fn ($a, $b) => $a['date'] <=> $b['date'],
            ])
            ->values();

        return Inertia::render('agenda/Index', [
            'evenements' => $events->sortBy('date')->values(),
            'alertes' => $alertes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'heure_debut' => 'nullable|date_format:H:i',
            'heure_fin' => 'nullable|date_format:H:i',
            'couleur' => 'nullable|string|max:7',
            'priorite' => 'required|in:basse,normale,haute,urgente',
            'alerter_avant' => 'required|integer|min:0|max:30',
        ]);

        AgendaEvenement::create([...$validated, 'user_id' => Auth::id()]);

        return back()->with('success', 'Événement créé.');
    }

    public function update(Request $request, AgendaEvenement $agendaEvenement): RedirectResponse
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'heure_debut' => 'nullable|date_format:H:i',
            'heure_fin' => 'nullable|date_format:H:i',
            'couleur' => 'nullable|string|max:7',
            'priorite' => 'required|in:basse,normale,haute,urgente',
            'alerter_avant' => 'required|integer|min:0|max:30',
        ]);

        $agendaEvenement->update($validated);

        return back()->with('success', 'Événement mis à jour.');
    }

    public function destroy(AgendaEvenement $agendaEvenement): RedirectResponse
    {
        $agendaEvenement->delete();

        return back()->with('success', 'Événement supprimé.');
    }
}
