<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $locations = Location::with('stations')->get();
        return Inertia::render('dashboard/locations', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);
        Location::create($request->only('name'));
        return redirect()->back()->with('success', 'Location added.');
    }

    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required|string|max:255']);
        $location = Location::findOrFail($id);
        $location->update($request->only('name'));
        return redirect()->back()->with('success', 'Location updated.');
    }

    public function destroy($id)
    {
        $location = Location::withCount('stations')->findOrFail($id);
        if ($location->stations_count > 0) {
            return redirect()->back()->with('error', 'Cannot delete location with stations assigned.');
        }
        $location->delete();
        return redirect()->back()->with('success', 'Location deleted.');
    }
}
