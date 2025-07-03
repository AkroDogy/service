<?php

namespace App\Http\Controllers\Cars;

use App\Http\Controllers\Controller;
use App\Models\Cars;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EditCarController extends Controller
{
    public function edit($id): Response
    {
        $user = Auth::user();
        $car = Cars::where('id', $id)->firstOrFail();
        if ($car->user_id !== $user->id) {
            return redirect()->route('cars.view')->with('error', 'Forbidden');
        }
        $success = session('success');
        $error = session('error');
        return Inertia::render('cars/edit', [
            'car' => $car,
            'success' => $success,
            'error' => $error,
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        $car = Cars::where('id', $id)->firstOrFail();
        if ($car->user_id !== $user->id) {
            return redirect()->route('cars.view')->with('error', 'Forbidden');
        }
        $validated = $request->validate([
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1886|max:' . date('Y'),
            'color' => 'required|string|max:50',
            'license_plate' => 'required|string|max:20|unique:cars,license_plate,' . $car->id,
            'vin' => 'required|string|max:17|unique:cars,vin,' . $car->id,
        ]);
        $car->update($validated);
        return redirect()->route('cars.view')->with('success', 'Car updated successfully!');
    }
}
