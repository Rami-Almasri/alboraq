<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '0999999999',
                'password' => Hash::make('password'),
            ]
        );

        $this->call([
            RolePermissionSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CouponSeeder::class,
            ReviewSeeder::class,
            DemoSeeder::class,
        ]);
    }
}
