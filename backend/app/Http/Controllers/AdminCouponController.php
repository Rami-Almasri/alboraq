<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Resources\AdminCouponResource;
use App\Models\Coupon;

class AdminCouponController extends Controller
{
    public function index()
    {
        try {
            $coupons = Coupon::latest()->get();

            return ResponseHelper::SuccessResponse(
                AdminCouponResource::collection($coupons),
                'Admin Coupon List',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(StoreCouponRequest $request)
    {
        try {
            $coupon = Coupon::create($request->validated());

            return ResponseHelper::SuccessResponse(
                AdminCouponResource::make($coupon),
                'Coupon created',
                201
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(StoreCouponRequest $request, Coupon $coupon)
    {
        try {
            $coupon->update($request->validated());

            return ResponseHelper::SuccessResponse(
                AdminCouponResource::make($coupon),
                'Coupon updated',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Coupon $coupon)
    {
        try {
            $coupon->delete();

            return ResponseHelper::SuccessResponse(null, 'Coupon deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
