<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // User::factory()->create([
        //     'fname' => 'Test',
        //     'lname' => 'User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call(RolesAndPermissionsSeeder::class);
    }
}
