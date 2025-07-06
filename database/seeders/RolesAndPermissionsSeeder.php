<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'dashboard' => [
                'dashboard' => 'Access dashboard',
                'dashboard.administrator' => 'Full admin access',
            ],
            'users' => [
                'dashboard.users' => 'View users',
                'dashboard.users.modify.rank' => 'Modify user rank',
            ],
            'appointments' => [
                'dashboard.appointments' => 'View appointments',
                'dashboard.appointments.setstatus' => 'Set appointment status (normal transitions)',
                'dashboard.appointments.setstatus.admin' => 'Set appointment status (any transition)',
            ],
            'reviews' => [
                'dashboard.reviews' => 'View reviews',
                'dashboard.reviews.change.status' => 'Change review status',
            ],
            'locations' => [
                'dashboard.locations' => 'View locations',
                'dashboard.locations.create' => 'Create location',
                'dashboard.locations.edit' => 'Edit location',
                'dashboard.locations.delete' => 'Delete location',
            ],
            'stations' => [
                'dashboard.stations' => 'View stations',
                'dashboard.stations.create' => 'Create station',
                'dashboard.stations.edit' => 'Edit station',
                'dashboard.stations.delete' => 'Delete station',
            ],
            'logs' => [
                'dashboard.logs' => 'View logs',
            ],
            'roles' => [
                'dashboard.roles' => 'View roles',
                'dashboard.roles.create' => 'Create roles',
                'dashboard.roles.edit' => 'Edit roles',
                'dashboard.roles.delete' => 'Delete roles',
            ],
            'messages' => [
                'dashboard.messages' => 'View messages',
                'dashboard.messages.setstatus' => 'Set message status to DONE',
            ],
        ];

        foreach ($permissions as $category => $perms) {
            foreach ($perms as $name => $desc) {
                Permission::firstOrCreate([
                    'name' => $name
                ], [
                    'description' => $desc,
                    'category' => $category
                ]);
            }
        }

        $admin = Role::firstOrCreate([
            'name' => 'admin'
        ], [
            'description' => 'Administrator'
        ]);
        $worker = Role::firstOrCreate([
            'name' => 'worker'
        ], [
            'description' => 'Worker'
        ]);
        $user = Role::firstOrCreate([
            'name' => 'user'
        ], [
            'description' => 'User'
        ]);

        $admin->permissions()->sync(Permission::pluck('id')->toArray());
        $workerPerms = Permission::whereIn('name', [
            'dashboard',
            'dashboard.appointments',
            'dashboard.appointments.setstatus',
            'dashboard.reviews',
            'dashboard.reviews.change.status',
            'dashboard.locations',
            'dashboard.stations',
            'dashboard.messages',
        ])->pluck('id')->toArray();
        $worker->permissions()->sync($workerPerms);
        $user->permissions()->sync([]);
        $user->setAttribute('undeletable', true);
        $user->setAttribute('is_default', true);
        $user->save();
        $admin->setAttribute('undeletable', true);
        $admin->save();
        $worker->setAttribute('undeletable', true);
        $worker->save();
    }
}
