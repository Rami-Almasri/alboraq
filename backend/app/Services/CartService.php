<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class CartService
{
    public function index()
    {
        return CartItem::query()
            ->where('user_id', Auth::id())
            ->with('product.category')
            ->latest()
            ->get();
    }

    public function store($productId, int $quantity = 1)
    {
        $product = Product::findOrFail($productId);

        $item = CartItem::firstOrNew([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
        ]);

        $item->quantity = ($item->exists ? $item->quantity : 0) + $quantity;
        $item->save();

        return $item->load('product.category');
    }

    public function update($productId, int $quantity)
    {
        $item = CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->firstOrFail();

        $item->update(['quantity' => $quantity]);

        return $item->load('product.category');
    }

    public function destroy($productId): void
    {
        CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->delete();
    }

    public function clear(): void
    {
        CartItem::where('user_id', Auth::id())->delete();
    }
}
