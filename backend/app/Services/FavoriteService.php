<?php

namespace App\Services;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class FavoriteService
{
    public function index()
    {
        return Favorite::query()
            ->where('user_id', Auth::id())
            ->with('product.category')
            ->latest()
            ->get();
    }

    /**
     * Toggle a product in the authenticated user's favorites.
     * Returns the favorite when added, or null when removed.
     */
    public function store($productId)
    {
        $product = Product::findOrFail($productId);

        $existing = Favorite::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return null;
        }

        $favorite = Favorite::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        return $favorite->load('product.category');
    }

    public function destroy($productId): void
    {
        Favorite::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();
    }
}
