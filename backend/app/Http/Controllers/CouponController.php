<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\ValidateCouponRequest;
use App\Services\CouponService;

class CouponController extends Controller
{
    private $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    /**
     * Validate a coupon code and return the resulting discount.
     */
    public function validateCoupon(ValidateCouponRequest $request)
    {
        try {
            $total = (float) $request->input('total');
            $result = $this->couponService->validateCode($request->input('code'), $total);

            $data = [
                'code' => $result['coupon']->code,
                'type' => $result['coupon']->type,
                'value' => $result['coupon']->value,
                'discount' => $result['discount'],
                'new_total' => max(0, $total - $result['discount']),
            ];

            return ResponseHelper::SuccessResponse($data, 'Coupon Applied', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
