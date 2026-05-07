<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LandingGalleryItem extends Model
{
    protected $fillable = ['cat', 'title', 'location', 'image_path', 'sort_order', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
