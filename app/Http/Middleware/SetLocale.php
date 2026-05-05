<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->cookie('locale', config('app.locale', 'fr'));

        if (in_array($locale, ['fr', 'en'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}
