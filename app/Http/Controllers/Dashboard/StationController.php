<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Station;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StationController extends Controller
{
    public function index(): Response
    {
        $stations = Station::with('location')->get();
        $locations = Location::all();
        return Inertia::render('dashboard/stations', [
            'stations' => $stations,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location_id' => 'required|exists:locations,id',
        ]);
        Station::create($request->only('name', 'location_id'));
        return redirect()->back()->with('success', 'Station added.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location_id' => 'required|exists:locations,id',
        ]);
        $station = Station::findOrFail($id);
        $station->update($request->only('name', 'location_id'));
        return redirect()->back()->with('success', 'Station updated.');
    }

    public function destroy($id)
    {
        $station = Station::findOrFail($id);
        $station->delete();
        return redirect()->back()->with('success', 'Station deleted.');
    }
}
