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
        $appointments = Appointments::with('car')
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
        $role = $user->role ?? null;
        $status = $request->input('status');
        if (!in_array($status, ['PENDING', 'PROGRESS', 'REJECTED', 'DONE', 'COMPLETED'])) {
            return redirect()->back()->with('error', 'Invalid status.');
        }
        if ($role === 'WORKER') {
            if ($appointment->status === 'PENDING' && in_array($status, ['REJECTED', 'PROGRESS'])) {
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
            if ($appointment->status === 'PROGRESS' && $status === 'DONE') {
                $appointment->status = 'DONE';
                $appointment->save();
                return redirect()->back()->with('success', 'Set to DONE. Please add attachment to complete.');
            }
            if ($appointment->status === 'DONE' && $status === 'COMPLETED') {
                $attachment = $request->input('attachment_path');
                if (!$attachment) {
                    return redirect()->back()->with('error', 'Attachment required.');
                }
                $appointment->attachment_path = $attachment;
                $appointment->status = 'COMPLETED';
                $appointment->save();
                return redirect()->back()->with('success', 'Appointment completed.');
            }
            if (in_array($appointment->status, ['DONE', 'REJECTED']) && in_array($status, ['PROGRESS', 'PENDING', 'REJECTED', 'DONE'])) {
                if ($status === 'REJECTED') {
                    $rejectedDescription = $request->input('rejected_description');
                    if (!$rejectedDescription) {
                        return redirect()->back()->with('error', 'Rejected reason required.');
                    }
                    $appointment->rejected_description = $rejectedDescription;
                }
                $appointment->status = $status;
                $appointment->save();
                return redirect()->back()->with('success', 'Status rolled back.');
            }
            return redirect()->back()->with('error', 'Invalid transition.');
        }
        if ($role === 'ADMIN') {
            if ($appointment->status === 'PENDING' && $status === 'COMPLETED') {
                $attachment = $request->input('attachment_path');
                if (!$attachment) {
                    return redirect()->back()->with('error', 'Attachment required.');
                }
                $appointment->attachment_path = $attachment;
                $appointment->status = 'COMPLETED';
                $appointment->save();
                return redirect()->back()->with('success', 'Appointment completed by admin.');
            }
            if ($appointment->status === 'PENDING' && in_array($status, ['REJECTED', 'PROGRESS'])) {
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
            if ($appointment->status === 'PROGRESS' && $status === 'DONE') {
                $appointment->status = 'DONE';
                $appointment->save();
                return redirect()->back()->with('success', 'Set to DONE. Please add attachment to complete.');
            }
            if ($appointment->status === 'DONE' && $status === 'COMPLETED') {
                $attachment = $request->input('attachment_path');
                if (!$attachment) {
                    return redirect()->back()->with('error', 'Attachment required.');
                }
                $appointment->attachment_path = $attachment;
                $appointment->status = 'COMPLETED';
                $appointment->save();
                return redirect()->back()->with('success', 'Appointment completed.');
            }
            // Rollback allowed from DONE or REJECTED
            if (in_array($appointment->status, ['DONE', 'REJECTED']) && in_array($status, ['PROGRESS', 'PENDING', 'REJECTED', 'DONE'])) {
                if ($status === 'REJECTED') {
                    $rejectedDescription = $request->input('rejected_description');
                    if (!$rejectedDescription) {
                        return redirect()->back()->with('error', 'Rejected reason required.');
                    }
                    $appointment->rejected_description = $rejectedDescription;
                }
                $appointment->status = $status;
                $appointment->save();
                return redirect()->back()->with('success', 'Status rolled back.');
            }
            return redirect()->back()->with('error', 'Invalid transition.');
        }
        return redirect()->back()->with('error', 'Unauthorized.');
    }
}
