<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\LocationGroup;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationGroupController extends Controller
{
    public function index(): Response
    {
        $groups = LocationGroup::with('locations')->get();
        $locations = Location::all();
        return Inertia::render('dashboard/location-groups', [
            'groups' => $groups,
            'locations' => $locations,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'locations' => 'array',
            'locations.*' => 'exists:locations,id',
        ]);
        $group = LocationGroup::create($request->only('name'));
        $group->locations()->sync($request->input('locations', []));
        return redirect()->back()->with('success', 'Location group added.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'locations' => 'array',
            'locations.*' => 'exists:locations,id',
        ]);
        $group = LocationGroup::findOrFail($id);
        $group->update($request->only('name'));
        $group->locations()->sync($request->input('locations', []));
        return redirect()->back()->with('success', 'Location group updated.');
    }

    public function destroy($id)
    {
        $group = LocationGroup::findOrFail($id);
        $group->locations()->detach();
        $group->delete();
        return redirect()->back()->with('success', 'Location group deleted.');
    }
}
