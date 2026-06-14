<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreCartRequest;
use App\Http\Requests\UpdateCartRequest;
use App\Http\Resources\CartResource;
use App\Services\CartService;

class CartController extends Controller
{
    private $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function index()
    {
        try {
            $items = $this->cartService->index();
            $result = CartResource::collection($items);

            return ResponseHelper::SuccessResponse($result, 'Cart List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    public function store(StoreCartRequest $request, $productId)
    {
        try {
            $item = $this->cartService->store($productId, (int) $request->input('quantity', 1));
            $result = CartResource::make($item);

            return ResponseHelper::SuccessResponse($result, 'Added to Cart', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(UpdateCartRequest $request, $productId)
    {
        try {
            $item = $this->cartService->update($productId, (int) $request->input('quantity'));
            $result = CartResource::make($item);

            return ResponseHelper::SuccessResponse($result, 'Cart Updated', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy($productId)
    {
        try {
            $this->cartService->destroy($productId);

            return ResponseHelper::SuccessResponse(null, 'Removed from Cart', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
