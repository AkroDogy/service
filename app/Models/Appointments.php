<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointments extends Model
{
    protected $fillable = [
        'attachment_path',
        'estimated_date',
        'description',
        'status',
        'cars_id',
    ];

    /**
     * Get the car that owns the appointment.
     */
    public function car()
    {
        return $this->belongsTo(Cars::class, 'cars_id');
    }
}
