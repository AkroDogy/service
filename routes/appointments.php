<?php 

use App\Http\Controllers\appointments\CreateAppointmentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {

    //View+send de la user
    Route::get('appointments', [CreateAppointmentController::class, 'create'])->name('appointments.create');
    Route::post('appointments', [CreateAppointmentController::class, 'store'])->name('appointments.store');

    //View+send de la admin/worker
});
