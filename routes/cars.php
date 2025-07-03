<?php 

use App\Http\Controllers\Cars\AddCarController;
use App\Http\Controllers\Cars\ViewCarController;
use App\Http\Controllers\Cars\EditCarController;
use App\Http\Controllers\Cars\DeleteCarController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('cars/view', [ViewCarController::class, 'view'])->name('cars.view');
    Route::get('cars/create', [AddCarController::class, 'create'])->name('cars.create');
    Route::post('cars', [AddCarController::class, 'store'])->name('cars.store');
    Route::get('cars/edit/{id}', [EditCarController::class, 'edit'])->name('cars.edit');
    Route::put('cars/edit/{id}', [EditCarController::class, 'update'])->name('cars.update');
    Route::delete('cars/delete/{id}', [DeleteCarController::class, 'delete'])->name('cars.delete');
});
