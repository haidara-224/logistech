<?php

namespace App\Http\Controllers;

use App\Models\LandingGalleryItem;
use App\Models\SiteSection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $landingData = $this->getLandingData();

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'isAdmin' => $user?->hasRole('admin'),
            'isSuperAdmin' => $user?->hasRole('super admin'),
            'landing' => $landingData,
        ]);
    }

    public function images()
    {
        $user = Auth::user();
        $landingData = $this->getLandingData();

        return Inertia::render('Gallery/Gallery', [
            'canRegister' => Features::enabled(Features::registration()),
            'isAdmin' => $user?->hasRole('admin'),
            'isSuperAdmin' => $user?->hasRole('super admin'),
            'landing' => $landingData,
        ]);
    }

    private function getLandingData(): array
    {
        $heroData = SiteSection::getSection('hero');
        $services = [];

        foreach (['charpente', 'transport', 'froid', 'batiment', 'logistique'] as $svc) {
            $raw = SiteSection::getValue('services', $svc, '{}');
            $data = json_decode($raw, true) ?? [];
            if (! empty($data)) {
                $services[$svc] = $data;
            }
        }

        return [
            'heroImages' => json_decode($heroData['images'] ?? '[]', true) ?? [],
            'heroLabels' => [
                'badge_fr' => $heroData['badge_fr'] ?? null,
                'badge_en' => $heroData['badge_en'] ?? null,
                'title1_fr' => $heroData['title1_fr'] ?? null,
                'title1_en' => $heroData['title1_en'] ?? null,
                'title2_fr' => $heroData['title2_fr'] ?? null,
                'title2_en' => $heroData['title2_en'] ?? null,
                'subtitle_fr' => $heroData['subtitle_fr'] ?? null,
                'subtitle_en' => $heroData['subtitle_en'] ?? null,
            ],
            'logo' => SiteSection::getValue('logo', 'path'),
            'aboutImage' => SiteSection::getValue('about', 'image_path'),
            'services' => $services,
            'galleryItems' => LandingGalleryItem::active()->orderBy('sort_order')
                ->get(['id', 'cat', 'title', 'location', 'image_path'])
                ->toArray(),
        ];
    }
}
