<?php

namespace App\Http\Controllers\Logistique;

use App\Http\Controllers\Controller;
use App\Http\Requests\Logistique\StoreChauffeurRequest;
use App\Http\Requests\Logistique\UpdateChauffeurRequest;
use App\Models\Chauffeur;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class ChauffeurController extends Controller
{
    public function store(StoreChauffeurRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => trim(($data['prenom'] ?? '').' '.$data['nom']),
            'email' => $data['email'],
            'password' => Hash::make('0000'),
            'must_change_password' => true,
        ]);

        $user->assignRole('chauffeur');

        Chauffeur::create([...$data, 'user_id' => $user->id, 'matricule' => $this->generateMatricule()]);

        return back()->with('success', 'Chauffeur enregistré — compte créé avec le mot de passe provisoire : 0000.');
    }

    private function generateMatricule(): string
    {
        $year = date('Y');
        $base = 'CHF-'.$year.'-';
        $count = Chauffeur::withTrashed()->count() + 1;

        do {
            $matricule = $base.str_pad($count, 4, '0', STR_PAD_LEFT);
            $count++;
        } while (Chauffeur::withTrashed()->where('matricule', $matricule)->exists());

        return $matricule;
    }

    public function update(UpdateChauffeurRequest $request, Chauffeur $chauffeur): RedirectResponse
    {
        $data = $request->validated();
        $chauffeur->update($data);

        if ($chauffeur->user && isset($data['email'])) {
            $chauffeur->user->update([
                'email' => $data['email'],
                'name' => trim(($data['prenom'] ?? $chauffeur->prenom).' '.($data['nom'] ?? $chauffeur->nom)),
            ]);
        }

        return back()->with('success', 'Chauffeur mis à jour.');
    }

    public function destroy(Chauffeur $chauffeur): RedirectResponse
    {
        $chauffeur->user?->delete();
        $chauffeur->delete();

        return back()->with('success', 'Chauffeur et son compte supprimés.');
    }
}
