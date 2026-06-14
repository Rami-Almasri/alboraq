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
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-s928bzkcmea/gallery/levant-ar-galaxy-s24-ultra-s928-sm-s928bzkcmea-thumb-539573043',
                'description' => 'أحدث هواتف Samsung Galaxy',
                'sort_order' => 1,
            ],
            [
                'name' => 'التلفزيونات',
                'slug' => 'tv',
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/qa65qn90dauxsa/gallery/levant-ar-neo-qled-qn90d-qa65qn90dauxsa-thumb-540163289',
                'description' => 'تلفزيونات Neo QLED و OLED',
                'sort_order' => 2,
            ],
            [
                'name' => 'الأجهزة المنزلية',
                'slug' => 'appliances',
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/rt53k6540s8-mr/gallery/levant-ar-top-mount-freezer-rt53k6540s8mr-thumb-303757049',
                'description' => 'ثلاجات، غسالات، ومكيفات',
                'sort_order' => 3,
            ],
            [
                'name' => 'الإكسسوارات',
                'slug' => 'accessories',
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-r630nzaamea/gallery/levant-ar-galaxy-buds-fe-r630-sm-r630nzaamea-thumb-538358057',
                'description' => 'سماعات، ساعات، وملحقات',
                'sort_order' => 4,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
