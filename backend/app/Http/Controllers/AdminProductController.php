<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\AdminProductService;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    private $productService;

    public function __construct(AdminProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        try {
            $products = $this->productService->index($request);
            $result = ProductResource::collection($products);

            return ResponseHelper::SuccessResponse($result, 'Admin Product List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = $this->productService->store($request->validated());
            $result = ProductResource::make($product->load('category'));

            return ResponseHelper::SuccessResponse($result, 'Product created', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $product = $this->productService->update($product, $request->validated());
            $result = ProductResource::make($product);

            return ResponseHelper::SuccessResponse($result, 'Product updated', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        try {
            $this->productService->destroy($product);

            return ResponseHelper::SuccessResponse(null, 'Product deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
