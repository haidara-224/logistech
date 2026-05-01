<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $search = request()->get('search', '');

        $clients = Client::when($search, function ($q) use ($search) {
            $q->where('nom', 'like', "%{$search}%")
                ->orWhere('prenom', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('telephone', 'like', "%{$search}%");
        })->paginate(20);

        return Inertia::render('clients/Index', [
            'clients' => $clients,
            'filters' => ['search' => $search],
        ]);
    }

    public function create()
    {
        return Inertia::render('clients/Create');
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $client = Client::create($request->validated());

        return redirect()->route('clients.show', $client->id)->with('success', 'Client créé');
    }

    public function show(Client $client)
    {
        $client->load(['commandes' => function ($q) {
            $q->orderByDesc('created_at')->limit(20);
        }]);

        return Inertia::render('clients/Show', ['client' => $client]);
    }

    public function edit(Client $client)
    {
        return Inertia::render('clients/Edit', ['client' => $client]);
    }

    public function update(StoreClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($request->validated());

        return redirect()->route('clients.show', $client->id)->with('success', 'Client mis à jour');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        return redirect()->route('clients.index')->with('success', 'Client supprimé');
    }
}
