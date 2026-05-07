<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSection extends Model
{
    protected $fillable = ['section', 'key', 'value'];

    public static function getValue(string $section, string $key, ?string $default = null): ?string
    {
        return static::where('section', $section)->where('key', $key)->value('value') ?? $default;
    }

    public static function setValue(string $section, string $key, ?string $value): void
    {
        static::updateOrCreate(['section' => $section, 'key' => $key], ['value' => $value]);
    }

    public static function getSection(string $section): array
    {
        return static::where('section', $section)->pluck('value', 'key')->toArray();
    }
}
