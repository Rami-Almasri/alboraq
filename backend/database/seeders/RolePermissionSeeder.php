<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Permissions
        $permissions = [
            'manage products',
            'manage orders',
            'reply chat',
            'view dashboard',
        ];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Roles
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $support = Role::firstOrCreate(['name' => 'support']);
        $customer = Role::firstOrCreate(['name' => 'customer']);

        $admin->syncPermissions($permissions);
        $support->syncPermissions(['reply chat', 'view dashboard']);

        // Staff users
        $adminUser = User::updateOrCreate(
            ['email' => 'admin@alboraq.com'],
            ['name' => 'مدير البراق', 'phone' => '0930000000', 'password' => Hash::make('password')]
        );
        $adminUser->syncRoles(['admin']);

        $supportUser = User::updateOrCreate(
            ['email' => 'support@alboraq.com'],
            ['name' => 'فريق الدعم', 'phone' => '0931111111', 'password' => Hash::make('password')]
        );
        $supportUser->syncRoles(['support']);
    }
}
