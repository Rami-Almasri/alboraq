<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // A few demo reviewers
        $reviewers = [];
        foreach ([
            ['name' => 'أحمد خالد', 'email' => 'ahmad@example.com'],
            ['name' => 'ليلى حسن', 'email' => 'laila@example.com'],
            ['name' => 'محمد العلي', 'email' => 'mohammad@example.com'],
        ] as $r) {
            $user = User::updateOrCreate(
                ['email' => $r['email']],
                ['name' => $r['name'], 'password' => Hash::make('password')]
            );
            $user->syncRoles(['customer']);
            $reviewers[] = $user;
        }

        $comments = [
            5 => 'منتج رائع وجودة ممتازة، أنصح به بشدة!',
            4 => 'جيد جداً وسعر مناسب، التوصيل كان سريعاً.',
            5 => 'تجربة شراء ممتازة من البراق، شكراً لكم.',
            4 => 'المنتج مطابق للوصف تماماً والخدمة محترمة.',
            5 => 'أفضل من توقعاتي، سأكرر التعامل معكم.',
        ];

        // Review the featured products
        $products = Product::where('is_featured', true)->take(10)->get();

        foreach ($products as $i => $product) {
            foreach ($reviewers as $j => $reviewer) {
                // not every reviewer reviews every product
                if (($i + $j) % 3 === 0 && $j > 0) {
                    continue;
                }
                $rating = [5, 4, 5][$j % 3];
                Review::updateOrCreate(
                    ['product_id' => $product->id, 'user_id' => $reviewer->id],
                    ['rating' => $rating, 'comment' => $comments[array_rand($comments)]]
                );
            }

            // refresh aggregate rating
            $avg = $product->reviews()->avg('rating');
            if ($avg) {
                $product->update(['rating' => round((float) $avg, 1)]);
            }
        }
    }
}
