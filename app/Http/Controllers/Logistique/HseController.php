<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreHseDocumentRequest;
use App\Http\Requests\Logistique\StoreHseIncidentRequest;
use App\Models\AdminNotification;
use App\Models\Camion;
use App\Models\Chauffeur;
use App\Models\Expedition;
use App\Models\HseCamionDocument;
use App\Models\HseChauffeurDocument;
use App\Models\HseIncident;
use App\Models\InspectionPredepart;
use App\Models\RapportCarburant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HseController extends Controller
{
    public function index(): Response
    {
        $chauffeurDocs = HseChauffeurDocument::with('chauffeur')
            ->orderBy('date_expiration')
            ->get()
            ->append(['statut', 'jours_restants']);

        $camionDocs = HseCamionDocument::with('camion')
            ->orderBy('date_expiration')
            ->get()
            ->append(['statut', 'jours_restants']);

        $incidents = HseIncident::with(['chauffeur', 'camion', 'expedition'])
            ->orderByDesc('date_incident')
            ->get();

        $inspections = InspectionPredepart::with(['chauffeur', 'camion', 'expedition'])
            ->orderByDesc('created_at')
            ->limit(100)
            ->get();

        $rapportsCarburant = RapportCarburant::with(['chauffeur', 'camion'])
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        $sosAlerts = AdminNotification::where('type', 'sos')
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $expiresThisMonth = $chauffeurDocs->where('statut', 'expire_bientot')->count()
            + $camionDocs->where('statut', 'expire_bientot')->count();

        $expires = $chauffeurDocs->where('statut', 'expire')->count()
            + $camionDocs->where('statut', 'expire')->count();

        return Inertia::render('hse/Index', [
            'chauffeurDocs' => $chauffeurDocs,
            'camionDocs' => $camionDocs,
            'incidents' => $incidents,
            'inspections' => $inspections,
            'rapportsCarburant' => $rapportsCarburant,
            'sosAlerts' => $sosAlerts,
            'chauffeurs' => Chauffeur::orderBy('nom')->get(['id', 'nom', 'prenom']),
            'camions' => Camion::orderBy('immatriculation')->get(['id', 'immatriculation', 'marque']),
            'expeditions' => Expedition::orderByDesc('date_depart')->limit(50)->get(['id', 'reference', 'date_depart']),
            'stats' => [
                'docs_expires' => $expires,
                'docs_expire_bientot' => $expiresThisMonth,
                'docs_valides' => $chauffeurDocs->where('statut', 'valide')->count()
                    + $camionDocs->where('statut', 'valide')->count(),
                'incidents_ouverts' => $incidents->where('statut', 'ouvert')->count(),
                'incidents_total' => $incidents->count(),
                'accidents_30j' => $incidents
                    ->where('type', 'accident')
                    ->where('date_incident', '>=', now()->subDays(30))
                    ->count(),
                'inspections_total' => $inspections->count(),
                'litres_total' => round((float) $rapportsCarburant->sum('litres'), 1),
                'co2_total' => round((float) $rapportsCarburant->sum('litres') * 2.67, 1),
                'sos_non_lus' => $sosAlerts->whereNull('read_at')->count(),
            ],
        ]);
    }

    /* ─── Chauffeur documents ─────────────────────────────────────────── */

    public function storeChauffeurDoc(StoreHseDocumentRequest $request, Chauffeur $chauffeur): RedirectResponse
    {
        $data = $request->validated();
        $data['chauffeur_id'] = $chauffeur->id;

        if ($request->hasFile('document')) {
            $data['document_path'] = '/storage/'.$request->file('document')->store('hse/chauffeurs', 'public');
        }

        unset($data['document']);
        HseChauffeurDocument::create($data);

        return back()->with('success', 'Document ajouté.');
    }

    public function updateChauffeurDoc(StoreHseDocumentRequest $request, HseChauffeurDocument $doc): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('document')) {
            if ($doc->document_path) {
                Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $doc->document_path), '/'));
            }
            $data['document_path'] = '/storage/'.$request->file('document')->store('hse/chauffeurs', 'public');
        }

        unset($data['document']);
        $doc->update($data);

        return back()->with('success', 'Document mis à jour.');
    }

    public function destroyChauffeurDoc(HseChauffeurDocument $doc): RedirectResponse
    {
        if ($doc->document_path) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $doc->document_path), '/'));
        }
        $doc->delete();

        return back()->with('success', 'Document supprimé.');
    }

    /* ─── Camion documents ────────────────────────────────────────────── */

    public function storeCamionDoc(StoreHseDocumentRequest $request, Camion $camion): RedirectResponse
    {
        $data = $request->validated();
        $data['camion_id'] = $camion->id;

        if ($request->hasFile('document')) {
            $data['document_path'] = '/storage/'.$request->file('document')->store('hse/camions', 'public');
        }

        unset($data['document']);
        HseCamionDocument::create($data);

        return back()->with('success', 'Document ajouté.');
    }

    public function updateCamionDoc(StoreHseDocumentRequest $request, HseCamionDocument $doc): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('document')) {
            if ($doc->document_path) {
                Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $doc->document_path), '/'));
            }
            $data['document_path'] = '/storage/'.$request->file('document')->store('hse/camions', 'public');
        }

        unset($data['document']);
        $doc->update($data);

        return back()->with('success', 'Document mis à jour.');
    }

    public function destroyCamionDoc(HseCamionDocument $doc): RedirectResponse
    {
        if ($doc->document_path) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $doc->document_path), '/'));
        }
        $doc->delete();

        return back()->with('success', 'Document supprimé.');
    }

    /* ─── Incidents ───────────────────────────────────────────────────── */

    public function storeIncident(StoreHseIncidentRequest $request): RedirectResponse
    {
        HseIncident::create($request->validated());

        return back()->with('success', 'Incident enregistré.');
    }

    public function updateIncident(StoreHseIncidentRequest $request, HseIncident $incident): RedirectResponse
    {
        $incident->update($request->validated());

        return back()->with('success', 'Incident mis à jour.');
    }

    public function patchIncidentStatut(HseIncident $incident): RedirectResponse
    {
        $next = match ($incident->statut) {
            'ouvert' => 'en_investigation',
            'en_investigation' => 'clos',
            default => $incident->statut,
        };

        $incident->update(['statut' => $next]);

        return back()->with('success', 'Statut mis à jour.');
    }

    public function destroyIncident(HseIncident $incident): RedirectResponse
    {
        $incident->delete();

        return back()->with('success', 'Incident supprimé.');
    }
}
