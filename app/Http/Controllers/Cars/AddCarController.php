<?php

namespace App\Http\Controllers\Cars;

use App\Http\Controllers\Controller;
use App\Models\Cars;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AddCarController extends Controller
{
    public function create(): Response
    {
        $success = session('success');
        $error = session('error');
        return Inertia::render('cars/create', compact('success', 'error'));
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in to add a car.');
        }

        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1886|max:' . date('Y'),
            'color' => 'required|string|max:50',
            'license_plate' => 'required|string|max:20|unique:cars,license_plate',
            'vin' => 'required|string|max:17|unique:cars,vin',
        ]);

        $validated['user_id'] = $user->id;

        Cars::create($validated);

        return redirect()->route('cars.view')->with('success', 'Car added successfully!');
    }
}
