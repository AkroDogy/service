<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'lname',
        'fname',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the cars for the user.
     */
    public function cars()
    {
        return $this->hasMany(Cars::class);
    }

    /**
     * Get all appointments for the user through their cars.
     */
    public function appointments()
    {
        return $this->hasManyThrough(Appointments::class, Cars::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function permissions()
    {
        if ($this->role && $this->role->name === 'admin') {
            return \App\Models\Permission::all();
        }
        if ($this->role) {
            return $this->role->permissions;
        }
        return collect();
    }

    public function hasPermission($permissionName)
    {
        if ($this->role && $this->role->name === 'admin') {
            return true;
        }
        return $this->permissions()->where('name', $permissionName)->isNotEmpty();
    }
}
