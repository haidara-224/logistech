<?php

namespace App\Http\Controllers;

use App\Models\LandingGalleryItem;
use App\Models\SiteSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LandingSectionController extends Controller
{
    private const SERVICES = ['charpente', 'transport', 'froid', 'batiment', 'logistique'];

    public function index(): Response
    {
        $heroData = SiteSection::getSection('hero');

        $services = [];
        foreach (self::SERVICES as $svc) {
            $raw = SiteSection::getValue('services', $svc, '{}');
            $data = json_decode($raw, true) ?? [];
            $services[$svc] = [
                'images' => $data['images'] ?? [],
                'title_fr' => $data['title_fr'] ?? '',
                'title_en' => $data['title_en'] ?? '',
                'short_fr' => $data['short_fr'] ?? '',
                'short_en' => $data['short_en'] ?? '',
                'desc_fr' => $data['desc_fr'] ?? '',
                'desc_en' => $data['desc_en'] ?? '',
                'features_fr' => $data['features_fr'] ?? ['', '', '', ''],
                'features_en' => $data['features_en'] ?? ['', '', '', ''],
            ];
        }

        return Inertia::render('landing/index', [
            'heroImages' => json_decode($heroData['images'] ?? '[]', true) ?? [],
            'heroLabels' => [
                'badge_fr' => $heroData['badge_fr'] ?? '',
                'badge_en' => $heroData['badge_en'] ?? '',
                'title1_fr' => $heroData['title1_fr'] ?? '',
                'title1_en' => $heroData['title1_en'] ?? '',
                'title2_fr' => $heroData['title2_fr'] ?? '',
                'title2_en' => $heroData['title2_en'] ?? '',
                'subtitle_fr' => $heroData['subtitle_fr'] ?? '',
                'subtitle_en' => $heroData['subtitle_en'] ?? '',
            ],
            'logo' => SiteSection::getValue('logo', 'path'),
            'aboutImage' => SiteSection::getValue('about', 'image_path'),
            'services' => $services,
            'galleryItems' => LandingGalleryItem::orderBy('sort_order')->get(),
        ]);
    }

    /** Generic image upload — returns the public URL */
    public function uploadImage(Request $request, string $section): JsonResponse
    {
        $request->validate(['image' => 'required|image|max:8192']);

        $path = $request->file('image')->store("landing/{$section}", 'public');

        return response()->json(['url' => '/storage/'.$path]);
    }

    /** Save hero images (with category tags) + text labels in one POST */
    public function saveHeroContent(Request $request): RedirectResponse
    {
        $request->validate([
            'images' => 'array|max:6',
            'images.*.url' => 'required|string',
            'images.*.cat' => 'required|in:charpente,transport,froid,batiment',
            'images.*.title_fr' => 'nullable|string|max:200',
            'images.*.title_en' => 'nullable|string|max:200',
            'images.*.desc_fr' => 'nullable|string|max:300',
            'images.*.desc_en' => 'nullable|string|max:300',
            'labels' => 'array',
        ]);

        SiteSection::setValue('hero', 'images', json_encode($request->input('images', [])));

        foreach ($request->input('labels', []) as $key => $value) {
            if (in_array($key, ['badge_fr', 'badge_en', 'title1_fr', 'title1_en', 'title2_fr', 'title2_en', 'subtitle_fr', 'subtitle_en'])) {
                SiteSection::setValue('hero', $key, $value);
            }
        }

        return back()->with('success', 'Hero sauvegardé.');
    }

    public function saveLogo(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|image|max:4096']);

        $url = '/storage/'.$request->file('image')->store('landing/logo', 'public');
        SiteSection::setValue('logo', 'path', $url);

        return response()->json(['url' => $url]);
    }

    public function saveAboutImage(Request $request): JsonResponse
    {
        $request->validate(['image' => 'required|image|max:8192']);

        $url = '/storage/'.$request->file('image')->store('landing/about', 'public');
        SiteSection::setValue('about', 'image_path', $url);

        return response()->json(['url' => $url]);
    }

    /** Save one service: images + all text labels in one POST */
    public function saveServiceContent(Request $request, string $service): RedirectResponse
    {
        abort_unless(in_array($service, self::SERVICES), 404);

        $request->validate([
            'images' => 'array',
            'images.*' => 'string',
            'title_fr' => 'nullable|string|max:200',
            'title_en' => 'nullable|string|max:200',
            'short_fr' => 'nullable|string|max:200',
            'short_en' => 'nullable|string|max:200',
            'desc_fr' => 'nullable|string|max:1000',
            'desc_en' => 'nullable|string|max:1000',
            'features_fr' => 'array|max:6',
            'features_fr.*' => 'nullable|string|max:100',
            'features_en' => 'array|max:6',
            'features_en.*' => 'nullable|string|max:100',
        ]);

        SiteSection::setValue('services', $service, json_encode([
            'images' => $request->input('images', []),
            'title_fr' => $request->title_fr ?? '',
            'title_en' => $request->title_en ?? '',
            'short_fr' => $request->short_fr ?? '',
            'short_en' => $request->short_en ?? '',
            'desc_fr' => $request->desc_fr ?? '',
            'desc_en' => $request->desc_en ?? '',
            'features_fr' => $request->input('features_fr', []),
            'features_en' => $request->input('features_en', []),
        ]));

        return back()->with('success', 'Service sauvegardé.');
    }

    public function storeGalleryItem(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => 'required|image|max:8192',
            'cat' => 'required|in:charpente,transport,froid,batiment',
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $max = LandingGalleryItem::max('sort_order') ?? 0;

        LandingGalleryItem::create([
            'cat' => $request->cat,
            'title' => $request->title,
            'location' => $request->location,
            'image_path' => '/storage/'.$request->file('image')->store('landing/gallery', 'public'),
            'sort_order' => $max + 1,
        ]);

        return back()->with('success', 'Photo ajoutée.');
    }

    public function updateGalleryItem(Request $request, LandingGalleryItem $item): RedirectResponse
    {
        $request->validate([
            'cat' => 'required|in:charpente,transport,froid,batiment',
            'title' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $item->update($request->only('cat', 'title', 'location', 'is_active'));

        return back()->with('success', 'Photo mise à jour.');
    }

    public function destroyGalleryItem(LandingGalleryItem $item): RedirectResponse
    {
        Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $item->image_path), '/'));
        $item->delete();

        return back()->with('success', 'Photo supprimée.');
    }

    public function reorderGalleryItems(Request $request): JsonResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);

        foreach ($request->ids as $order => $id) {
            LandingGalleryItem::where('id', $id)->update(['sort_order' => $order]);
        }

        return response()->json(['ok' => true]);
    }
}
