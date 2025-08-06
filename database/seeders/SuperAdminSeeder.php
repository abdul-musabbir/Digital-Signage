<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Abdul Musabbir',
            'email' => 'musabbir.io@gmail.com',
            'password' => Hash::make('12345678'),
        ])->assignRole('superadmin');
    }
}
