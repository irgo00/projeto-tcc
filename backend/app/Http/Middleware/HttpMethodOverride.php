<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HttpMethodOverride
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('POST')) {
            $override = $request->headers->get('X-HTTP-Method-Override');
            if (in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
                $request->setMethod($override);
            }
        }

        return $next($request);
    }
}
