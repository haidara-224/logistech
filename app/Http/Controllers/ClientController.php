<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::paginate(20);
        return Inertia::render('clients/Index', ['clients' => $clients]);
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

