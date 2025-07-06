<?php

namespace App\Http\Controllers;

use App\Models\Location;
use \App\Models\LocationGroup;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function index(): Response
    {
        $groups = LocationGroup::with(['locations.stations'])->get();
        return Inertia::render('welcome', [
            'locationGroups' => $groups,
        ]);
    }
}
