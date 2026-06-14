<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'الهواتف الذكية',
                'slug' => 'mobiles',
                'image' => '/products/smartphone.svg',
                'description' => 'أحدث هواتف Samsung Galaxy',
                'sort_order' => 1,
            ],
            [
                'name' => 'التلفزيونات',
                'slug' => 'tv',
                'image' => '/products/tv.svg',
                'description' => 'تلفزيونات Neo QLED و OLED',
                'sort_order' => 2,
            ],
            [
                'name' => 'الأجهزة المنزلية',
                'slug' => 'appliances',
                'image' => '/products/fridge.svg',
                'description' => 'ثلاجات، غسالات، ومكيفات',
                'sort_order' => 3,
            ],
            [
                'name' => 'الإكسسوارات',
                'slug' => 'accessories',
                'image' => '/products/watch.svg',
                'description' => 'سماعات، ساعات، وملحقات',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
