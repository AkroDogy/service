<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class ManageMessagesController extends Controller
{
    public function setStatus(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        if (!$user->hasPermission('dashboard.messages.setstatus')) {
            return redirect()->back()->with('error', 'Unauthorized.');
        }
        $message = Contact::findOrFail($id);
        $newStatus = $request->input('status', 'DONE');
        if (!in_array($newStatus, ['DONE', 'PENDING'])) {
            return redirect()->back()->with('error', 'Invalid status.');
        }
        if ($message->status === $newStatus) {
            return redirect()->back()->with('error', 'Already marked as ' . $newStatus . '.');
        }
        $message->status = $newStatus;
        $message->save();
        return redirect()->back()->with('success', 'Message marked as ' . $newStatus . '.');
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $message = Contact::findOrFail($id);
        if ($user->role && $user->role->name === 'user') {
            return redirect()->back()->with('error', 'User role cannot delete messages.');
        }
        $message->delete();
        return redirect()->back()->with('success', 'Message deleted.');
    }
}
