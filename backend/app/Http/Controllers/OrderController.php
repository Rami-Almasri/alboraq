<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;

class OrderController extends Controller
{
    private $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index()
    {
        try {
            $orders = $this->orderService->index();
            $result = OrderResource::collection($orders);

            return ResponseHelper::SuccessResponse($result, 'Order List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->store($request->validated());
            $result = OrderResource::make($order);

            return ResponseHelper::SuccessResponse($result, 'Order Created', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function show(Order $order)
    {
        try {
            // Ensure the order belongs to the authenticated user
            if ($order->user_id !== auth()->id()) {
                return ResponseHelper::FailureResponse(null, 'Unauthorized', 403);
            }

            $result = OrderResource::make($this->orderService->show($order));

            return ResponseHelper::SuccessResponse($result, 'Order Details', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
