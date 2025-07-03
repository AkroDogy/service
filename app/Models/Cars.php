<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cars extends Model
{
    protected $fillable = [
        'user_id',
        'brand',
        'model',
        'year',
        'color',
        'license_plate',
        'vin',
    ];

    /**
     * Get the user that owns the car.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the appointments for the car.
     */
    public function appointments()
    {
        return $this->hasMany(Appointments::class, 'cars_id');
    }
}
