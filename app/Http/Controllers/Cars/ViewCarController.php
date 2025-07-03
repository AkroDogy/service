<?php

namespace App\Http\Controllers\Cars;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ViewCarController extends Controller
{
    public function view(): Response
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in to view your cars.');
        }
        $cars = $user->cars()->get();
        $success = session('success');
        $error = session('error');
        return Inertia::render('cars/view', [
            'cars' => $cars,
            'success' => $success,
            'error' => $error,
        ]);
    }
}
