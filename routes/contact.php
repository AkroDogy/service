<?php 

use App\Http\Controllers\Contact\ViewContactController;
use Illuminate\Support\Facades\Route;

Route::get('contact', [ViewContactController::class, 'view'])->name('contact');
Route::post('contact', [ViewContactController::class, 'store'])->name('contact.store');