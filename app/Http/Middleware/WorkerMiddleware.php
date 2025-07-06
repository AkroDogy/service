<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class WorkerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'You must be logged in to access this area.');
        }
        $user = Auth::user();
        if (strtoupper(optional($user->role)->name) === 'worker' || strtoupper(optional($user->role)->name) === 'admin') {
            return $next($request);
        }
        return redirect()->route('home')->with('error', 'You do not have permission to access this area.');
    }
}
