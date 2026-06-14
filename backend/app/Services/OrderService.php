<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    const SHIPPING_FEE = 25000;

    public function index()
    {
        return Order::query()
            ->where('user_id', Auth::id())
            ->with('items')
            ->latest()
            ->get();
    }

    public function show(Order $order): Order
    {
        return $order->load('items');
    }

    /**
     * Create an order from the authenticated user's cart.
     */
    public function store(array $data): Order
    {
        $cartItems = CartItem::where('user_id', Auth::id())
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            throw new \Exception('السلة فارغة، لا يمكن إنشاء طلب');
        }

        return DB::transaction(function () use ($cartItems, $data) {
            $subtotal = $cartItems->sum(
                fn ($item) => $item->quantity * (float) $item->product->price
            );

            $order = Order::create([
                'user_id' => Auth::id(),
                'reference' => 'ORD-' . strtoupper(Str::random(8)),
                'subtotal' => $subtotal,
                'shipping' => self::SHIPPING_FEE,
                'total' => $subtotal + self::SHIPPING_FEE,
                'status' => 'pending',
                'customer_name' => $data['customer_name'] ?? Auth::user()->name,
                'phone' => $data['phone'] ?? Auth::user()->phone,
                'address' => $data['address'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($cartItems as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'price' => $item->product->price,
                    'quantity' => $item->quantity,
                    'line_total' => $item->quantity * (float) $item->product->price,
                ]);
            }

            // Empty the cart after a successful order
            CartItem::where('user_id', Auth::id())->delete();

            return $order->load('items');
        });
    }
}
