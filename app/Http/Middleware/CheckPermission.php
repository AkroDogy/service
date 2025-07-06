<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, $permission)
    {
        $user = Auth::user();
        if (!$user) {
            abort(403);
        }
        if ($user->role && strtoupper($user->role->name) === 'admin') {
            return $next($request);
        }
        if ($user->hasPermission('dashboard.administrator')) {
            return $next($request);
        }
        if (!$user->hasPermission($permission)) {
            abort(403);
        }
        return $next($request);
    }
}
