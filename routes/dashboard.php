<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Dashboard\ViewDashboardController;
use App\Http\Controllers\Dashboard\ViewUsersController;
use App\Http\Controllers\Dashboard\ViewMessagesController;
use App\Http\Controllers\Dashboard\ViewReviewsController;
use App\Http\Controllers\Dashboard\ViewAppointmentsController;
use App\Http\Controllers\Dashboard\ManageAppointmentsController;
use App\Http\Controllers\Dashboard\RolePermissionController;
use Inertia\Inertia;

Route::middleware(['auth', 'permission:dashboard'])->group(function () {
    Route::get('dashboard', [ViewDashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/contact-messages', [ViewMessagesController::class, 'index'])->middleware('permission:dashboard.messages')->name('dashboard.messages');
    Route::get('dashboard/reviews', [ViewReviewsController::class, 'index'])->middleware('permission:dashboard.reviews')->name('dashboard.reviews');
    Route::get('dashboard/appointments', [ManageAppointmentsController::class, 'index'])->middleware('permission:dashboard.appointments')->name('dashboard.appointments');
    Route::post('dashboard/appointments/{id}/status', [ManageAppointmentsController::class, 'setStatus'])->middleware('permission:dashboard.appointments.setstatus')->name('dashboard.appointments.setStatus');
    Route::post('dashboard/contact-messages/{id}/status', [\App\Http\Controllers\Dashboard\ManageMessagesController::class, 'setStatus'])->middleware('permission:dashboard.messages.setstatus')->name('dashboard.messages.setStatus');
});

Route::middleware(['auth', 'permission:dashboard.users'])->group(function () {
    Route::get('dashboard/users', [ViewUsersController::class, 'index'])->name('dashboard.users');
});

Route::middleware(['auth', 'permission:dashboard.roles'])->group(function () {
    Route::get('dashboard/roles', [RolePermissionController::class, 'index'])->name('dashboard.roles');
    Route::post('dashboard/roles', [RolePermissionController::class, 'storeRole'])->middleware('permission:dashboard.roles.create')->name('dashboard.roles.store');
    Route::post('dashboard/roles/{role}/permissions', [RolePermissionController::class, 'assignPermission'])->name('dashboard.roles.assignPermission');
    Route::delete('dashboard/roles/{id}', [RolePermissionController::class, 'deleteRole'])->name('dashboard.roles.delete');
});

Route::middleware(['auth', 'permission:dashboard.permissions'])->group(function () {
    Route::post('dashboard/permissions', [RolePermissionController::class, 'storePermission'])->name('dashboard.permissions.store');
});

Route::middleware(['auth', 'permission:dashboard.users.modify.rank'])->group(function () {
    Route::post('dashboard/users/{user}/role', [RolePermissionController::class, 'assignRoleToUser'])->name('dashboard.users.assignRole');
});

Route::middleware(['auth', 'permission:dashboard.locations'])->group(function () {
    Route::get('dashboard/locations', [\App\Http\Controllers\Dashboard\LocationController::class, 'index'])->name('dashboard.locations');
    Route::post('dashboard/locations', [\App\Http\Controllers\Dashboard\LocationController::class, 'store'])->middleware('permission:dashboard.locations.create')->name('dashboard.locations.store');
    Route::put('dashboard/locations/{id}', [\App\Http\Controllers\Dashboard\LocationController::class, 'update'])->middleware('permission:dashboard.locations.edit')->name('dashboard.locations.update');
    Route::delete('dashboard/locations/{id}', [\App\Http\Controllers\Dashboard\LocationController::class, 'destroy'])->middleware('permission:dashboard.locations.delete')->name('dashboard.locations.delete');
});

Route::middleware(['auth', 'permission:dashboard.stations'])->group(function () {
    Route::get('dashboard/stations', [\App\Http\Controllers\Dashboard\StationController::class, 'index'])->name('dashboard.stations');
    Route::post('dashboard/stations', [\App\Http\Controllers\Dashboard\StationController::class, 'store'])->middleware('permission:dashboard.stations.create')->name('dashboard.stations.store');
    Route::put('dashboard/stations/{id}', [\App\Http\Controllers\Dashboard\StationController::class, 'update'])->middleware('permission:dashboard.stations.edit')->name('dashboard.stations.update');
    Route::delete('dashboard/stations/{id}', [\App\Http\Controllers\Dashboard\StationController::class, 'destroy'])->middleware('permission:dashboard.stations.delete')->name('dashboard.stations.delete');
});

Route::middleware(['auth', 'permission:dashboard.locations'])->group(function () {
    Route::get('dashboard/location-groups', [\App\Http\Controllers\Dashboard\LocationGroupController::class, 'index'])->name('dashboard.location-groups');
    Route::post('dashboard/location-groups', [\App\Http\Controllers\Dashboard\LocationGroupController::class, 'store'])->name('dashboard.location-groups.store');
    Route::put('dashboard/location-groups/{id}', [\App\Http\Controllers\Dashboard\LocationGroupController::class, 'update'])->name('dashboard.location-groups.update');
    Route::delete('dashboard/location-groups/{id}', [\App\Http\Controllers\Dashboard\LocationGroupController::class, 'destroy'])->name('dashboard.location-groups.delete');
});
