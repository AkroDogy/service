<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\ViewDashboardController;
use App\Http\Controllers\Dashboard\ViewUsersController;
use App\Http\Controllers\Dashboard\ViewMessagesController;
use App\Http\Controllers\Dashboard\ViewReviewsController;
use App\Http\Controllers\Dashboard\ViewAppointmentsController;
use App\Http\Controllers\Dashboard\ManageAppointmentsController;
use Inertia\Inertia;

Route::middleware(['auth', 'worker'])->group(function () {
    Route::get('dashboard', [ViewDashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/contact-messages', [ViewMessagesController::class, 'index'])->name('dashboard.messages');
    Route::get('dashboard/reviews', [ViewReviewsController::class, 'index'])->name('dashboard.reviews');
    Route::get('dashboard/appointments', [ManageAppointmentsController::class, 'index'])->name('dashboard.appointments');
    Route::post('dashboard/appointments/{id}/status', [ManageAppointmentsController::class, 'setStatus'])->name('dashboard.appointments.setStatus');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('dashboard/users', [ViewUsersController::class, 'index'])->name('dashboard.users');
    Route::get('dashboard/appointments', [ManageAppointmentsController::class, 'index'])->name('dashboard.appointments');
    Route::post('dashboard/appointments/{id}/status', [ManageAppointmentsController::class, 'setStatus'])->name('dashboard.appointments.setStatus');
});
