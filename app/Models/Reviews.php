<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reviews extends Model
{
    protected $fillable = [
        'fname',
        'lname',
        'stars',
        'occupation',
        'status',
        'description',
    ];
}
