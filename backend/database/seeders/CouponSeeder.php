<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            ['code' => 'WELCOME10', 'type' => 'percent', 'value' => 10, 'min_total' => 0, 'usage_limit' => null],
            ['code' => 'EID20', 'type' => 'percent', 'value' => 20, 'min_total' => 5000000, 'usage_limit' => 100],
            ['code' => 'SAVE50K', 'type' => 'fixed', 'value' => 500000, 'min_total' => 2000000, 'usage_limit' => null],
        ];

        foreach ($coupons as $coupon) {
            Coupon::updateOrCreate(
                ['code' => $coupon['code']],
                array_merge($coupon, ['is_active' => true])
            );
        }
    }
}
