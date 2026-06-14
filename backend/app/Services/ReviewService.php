<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewService
{
    public function forProduct(Product $product)
    {
        return $product->reviews()->with('user')->latest()->get();
    }

    /**
     * Create or update the current user's review, then refresh the
     * product's aggregate rating.
     */
    public function store(Product $product, array $data): Review
    {
        $review = Review::updateOrCreate(
            ['product_id' => $product->id, 'user_id' => Auth::id()],
            ['rating' => $data['rating'], 'comment' => $data['comment'] ?? null]
        );

        $average = $product->reviews()->avg('rating');
        $product->update(['rating' => round((float) $average, 1)]);

        return $review->load('user');
    }
}
