<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    private $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(Product $product)
    {
        try {
            $reviews = $this->reviewService->forProduct($product);
            $result = ReviewResource::collection($reviews);

            return ResponseHelper::SuccessResponse($result, 'Reviews List', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse($e->getMessage());
        }
    }

    public function store(StoreReviewRequest $request, Product $product)
    {
        try {
            $review = $this->reviewService->store($product, $request->validated());
            $result = ReviewResource::make($review);

            return ResponseHelper::SuccessResponse($result, 'Review Saved', 201);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }
}
