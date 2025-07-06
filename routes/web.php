<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WelcomeController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/appointments.php';
require __DIR__.'/cars.php';
require __DIR__.'/contact.php';
require __DIR__.'/dashboard.php';

