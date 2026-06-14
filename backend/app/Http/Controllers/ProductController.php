<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        try {
            $products = $this->productService->index($request);
            $result = ProductResource::collection($products);

            return ResponseHelper::SuccessResponse($result, 'Product List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    public function show(Product $product)
    {
        try {
            $result = ProductResource::make($this->productService->show($product));

            return ResponseHelper::SuccessResponse($result, 'Product Details', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
