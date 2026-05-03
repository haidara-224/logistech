<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscription extends Model
{
    use Auditable;

    protected $fillable = ['email'];
}
