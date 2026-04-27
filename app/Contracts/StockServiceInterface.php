<?php

namespace App\Contracts;

interface StockServiceInterface
{
    public function adjustStock(int $produitId, string $type, int $quantite, string $source = null, $referenceId = null): void;
}
