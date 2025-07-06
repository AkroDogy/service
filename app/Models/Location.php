<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name'];

    public function stations()
    {
        return $this->hasMany(Station::class);
    }

    public function groups()
    {
        return $this->belongsToMany(LocationGroup::class, 'location_group_location');
    }
}
