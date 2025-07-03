<?php

namespace App\Http\Controllers\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CreateAppointmentController extends Controller
{
    public function create(Request $request): Response
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in to create an appointment');
        }
        $cars = $user->cars()->get();
        $appointments = $user->appointments()->with('car')->get();

        return Inertia::render('appointments/create', [
            'cars' => $cars,
            'appointments' => $appointments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login')->with('error', 'You must be logged in');
        }

        $validated = $request->validate([
            'description' => 'required|string|max:1000',
            'cars_id' => 'required|exists:cars,id',
            'estimated_date' => 'nullable|date|after:today',
        ]);
        $car = $user->cars()->find($validated['cars_id']);
        if (!$car) {
            return redirect()->route('appointments.create')->with('error', 'You do not have permission to create an appointment for this car.');
        }
        Appointments::create([
            'cars_id' => $validated['cars_id'],
            'description' => $validated['description'],
            'estimated_date' => $validated['estimated_date'] ?? null,
            'status' => 'PENDING',
        ]);

        return redirect()->route('appointments.create')->with('success', 'Appointment created successfully!');
    }
}
