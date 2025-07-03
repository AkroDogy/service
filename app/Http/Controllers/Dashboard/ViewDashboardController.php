<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ViewDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('dashboard');
    }
}
