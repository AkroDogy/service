<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Appointments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ManageAppointmentsController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'PENDING');
        $appointments = Appointments::with(['car', 'location'])
            ->when($status, fn($q) => $q->where('status', $status))
            ->get();
        $success = session('success');
        $error = session('error');
        return Inertia::render('dashboard/appointments', [
            'appointments' => $appointments,
            'status' => $status,
            'success' => $success,
            'error' => $error,
        ]);
    }

    public function setStatus(Request $request, $id): RedirectResponse
    {
        $user = Auth::user();
        $appointment = Appointments::findOrFail($id);
        $status = $request->input('status');
        $validStatuses = ['PENDING', 'PROGRESS', 'REJECTED', 'DONE', 'COMPLETED'];
        if (!in_array($status, $validStatuses)) {
            return redirect()->back()->with('error', 'Invalid status.');
        }
        $canSetStatus = $user->permissions()->pluck('name')->contains('dashboard.appointments.setstatus');
        $canSetStatusAdmin = $user->permissions()->pluck('name')->contains('dashboard.appointments.setstatus.admin');
        if ($canSetStatusAdmin) {
            $oldStatus = $appointment->status;
            if ($status === 'COMPLETED') {
                $attachment = $request->input('attachment_path');
                if (!$attachment) {
                    return redirect()->back()->with('error', 'Attachment required.');
                }
                $appointment->attachment_path = $attachment;
            }
            if ($status === 'REJECTED') {
                $rejectedDescription = $request->input('rejected_description');
                if (!$rejectedDescription) {
                    return redirect()->back()->with('error', 'Rejected reason required.');
                }
                $appointment->rejected_description = $rejectedDescription;
            }
            $appointment->status = $status;
            $appointment->save();
            return redirect()->back()->with('success', 'Status updated (admin override).');
        }
        if ($canSetStatus) {
            $transitions = [
                'PENDING' => ['PROGRESS', 'REJECTED'],
                'PROGRESS' => ['DONE', 'REJECTED'],
                'DONE' => ['PROGRESS', 'COMPLETED'],
                'REJECTED' => ['PROGRESS', 'DONE'],
                'COMPLETED' => [],
            ];
            $current = $appointment->status;
            if (!isset($transitions[$current]) || !in_array($status, $transitions[$current])) {
                return redirect()->back()->with('error', 'Invalid transition.');
            }
            if ($status === 'COMPLETED') {
                $attachment = $request->input('attachment_path');
                if (!$attachment) {
                    return redirect()->back()->with('error', 'Attachment required.');
                }
                $appointment->attachment_path = $attachment;
            }
            if ($status === 'REJECTED') {
                $rejectedDescription = $request->input('rejected_description');
                if (!$rejectedDescription) {
                    return redirect()->back()->with('error', 'Rejected reason required.');
                }
                $appointment->rejected_description = $rejectedDescription;
            }
            $appointment->status = $status;
            $appointment->save();
            return redirect()->back()->with('success', 'Status updated.');
        }
        return redirect()->back()->with('error', 'Unauthorized.');
    }
}
