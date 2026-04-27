<?php

namespace App\Contracts;

use App\Models\Commande;

interface CommandeServiceInterface
{
    public function createCommande(array $data): Commande;
}
