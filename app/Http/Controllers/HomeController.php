<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $isAdmin = $user?->hasRole('admin');
        $isSuperAdmin = $user?->hasRole('super admin');


        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'isAdmin'=>$isAdmin,
            'isSuperAdmin'=>$isSuperAdmin
        ]);
    }
}