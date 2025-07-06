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
        'location_id',
    ];

    public function car()
    {
        return $this->belongsTo(Cars::class, 'cars_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
