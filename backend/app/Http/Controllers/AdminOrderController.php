<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends Controller
{
    public const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    public function index(Request $request)
    {
        try {
            $orders = Order::query()
                ->with(['user', 'items'])
                ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
                ->when($request->filled('search'), function ($q) use ($request) {
                    $term = $request->input('search');
                    $q->where(function ($w) use ($term) {
                        $w->where('reference', 'like', "%{$term}%")
                            ->orWhere('customer_name', 'like', "%{$term}%")
                            ->orWhere('phone', 'like', "%{$term}%");
                    });
                })
                ->latest()
                ->paginate((int) $request->input('per_page', 30));

            return ResponseHelper::SuccessResponse(
                OrderResource::collection($orders),
                'Admin Order List',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function show(Order $order)
    {
        try {
            $order->load(['user', 'items.product']);

            return ResponseHelper::SuccessResponse(
                OrderResource::make($order),
                'Order Details',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(Request $request, Order $order)
    {
        try {
            $data = $request->validate([
                'status' => ['required', Rule::in(self::STATUSES)],
            ]);

            $order->update($data);

            return ResponseHelper::SuccessResponse(
                OrderResource::make($order->load(['user', 'items'])),
                'Order status updated',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Order $order)
    {
        try {
            $order->delete();

            return ResponseHelper::SuccessResponse(null, 'Order deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
