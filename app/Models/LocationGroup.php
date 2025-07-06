<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LocationGroup extends Model
{
    protected $fillable = ['name'];

    public function locations()
    {
        return $this->belongsToMany(Location::class, 'location_group_location');
    }
}
