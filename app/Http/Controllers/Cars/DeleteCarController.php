<?php
namespace App\Http\Controllers\Cars;

use App\Http\Controllers\Controller;
use App\Models\Cars;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DeleteCarController extends Controller
{
    public function delete(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        $car = Cars::where('id', $id)->firstOrFail();

        if ($car->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Forbidden');
        }

        if ($car->appointments()->count() > 0) {
            return redirect()->back()->with('error', 'Car cannot be deleted because it has appointments.');
        }

        $car->delete();

        return redirect()->back()->with('success', 'Car deleted successfully!');
    }
}
