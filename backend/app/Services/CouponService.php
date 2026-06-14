<?php

namespace App\Services;

use App\Models\Coupon;

class CouponService
{
    /**
     * Validate a coupon code against a subtotal.
     *
     * @return array{coupon: Coupon, discount: float}
     *
     * @throws \Exception when the coupon is missing or not applicable.
     */
    public function validateCode(string $code, float $total): array
    {
        $coupon = Coupon::whereRaw('UPPER(code) = ?', [strtoupper(trim($code))])->first();

        if (! $coupon) {
            throw new \Exception('كود الخصم غير صحيح');
        }

        if (! $coupon->isValidFor($total)) {
            throw new \Exception('كود الخصم غير صالح أو لا ينطبق على طلبك');
        }

        return [
            'coupon' => $coupon,
            'discount' => $coupon->discountFor($total),
        ];
    }
}
