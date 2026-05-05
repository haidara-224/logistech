<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $locale = $request->validate(['locale' => 'required|in:fr,en'])['locale'];

        return back()->withCookie(cookie()->forever('locale', $locale));
    }
}
