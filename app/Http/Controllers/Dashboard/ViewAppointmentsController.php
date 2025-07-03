<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use App\Models\Appointments;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewAppointmentsController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard/appointments', [
            'appointments' => Appointments::all(),
        ]);
    }
}
