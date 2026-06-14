<?php

namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\Favorite;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoSeeder extends Seeder
{
    const SHIPPING = 25000;

    /**
     * Pre-load the demo account with realistic data so the storefront
     * looks alive during a presentation (favorites, cart, past orders).
     */
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();
        if (! $user) {
            return;
        }

        // ---- Favorites (wishlist) ----
        $favSlugs = [
            'samsung-galaxy-s24-ultra-256gb',
            'samsung-galaxy-z-flip6-256gb',
            'samsung-neo-qled-4k-65-qn90d',
            'samsung-galaxy-watch7-44mm',
            'samsung-galaxy-buds3-pro',
        ];
        foreach (Product::whereIn('slug', $favSlugs)->get() as $product) {
            Favorite::firstOrCreate(['user_id' => $user->id, 'product_id' => $product->id]);
        }

        // ---- Active cart ----
        $cart = [
            'samsung-galaxy-a55-5g-128gb' => 1,
            'samsung-galaxy-buds-fe' => 2,
        ];
        foreach ($cart as $slug => $qty) {
            $product = Product::where('slug', $slug)->first();
            if ($product) {
                CartItem::updateOrCreate(
                    ['user_id' => $user->id, 'product_id' => $product->id],
                    ['quantity' => $qty]
                );
            }
        }

        // ---- Past orders ----
        $orders = [
            [
                'status' => 'delivered',
                'days_ago' => 12,
                'items' => ['samsung-galaxy-s23-fe-128gb' => 1, 'samsung-25w-super-fast-charger' => 1],
            ],
            [
                'status' => 'shipped',
                'days_ago' => 3,
                'items' => ['samsung-crystal-uhd-4k-50-du8000' => 1, 'samsung-sound-bar-q-series-hw-q800d' => 1],
            ],
            [
                'status' => 'pending',
                'days_ago' => 1,
                'items' => ['samsung-galaxy-tab-s9-fe' => 1],
            ],
        ];

        foreach ($orders as $data) {
            $products = Product::whereIn('slug', array_keys($data['items']))->get()->keyBy('slug');
            if ($products->isEmpty()) {
                continue;
            }

            $subtotal = 0;
            foreach ($data['items'] as $slug => $qty) {
                if (isset($products[$slug])) {
                    $subtotal += $qty * (float) $products[$slug]->price;
                }
            }

            $date = now()->subDays($data['days_ago']);
            $order = Order::create([
                'user_id' => $user->id,
                'reference' => 'ORD-' . strtoupper(Str::random(8)),
                'subtotal' => $subtotal,
                'shipping' => self::SHIPPING,
                'total' => $subtotal + self::SHIPPING,
                'status' => $data['status'],
                'customer_name' => $user->name,
                'phone' => $user->phone,
                'address' => 'دمشق - المزة - شارع الجلاء',
                'created_at' => $date,
                'updated_at' => $date,
            ]);

            foreach ($data['items'] as $slug => $qty) {
                if (! isset($products[$slug])) {
                    continue;
                }
                $product = $products[$slug];
                $order->items()->create([
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $qty,
                    'line_total' => $qty * (float) $product->price,
                ]);
            }
        }
    }
}
