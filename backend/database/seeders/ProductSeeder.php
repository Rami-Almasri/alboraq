<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $cats = Category::pluck('id', 'slug');

        $products = [
            // ===== Mobiles =====
            [
                'category' => 'mobiles',
                'name' => 'Samsung Galaxy S24 Ultra 256GB',
                'price' => 12500000, 'old_price' => 13800000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-s928bzkcmea/gallery/levant-ar-galaxy-s24-ultra-s928-sm-s928bzkcmea-thumb-539573043',
                'stock' => 18, 'rating' => 4.9, 'is_featured' => true,
                'description' => 'هاتف Galaxy S24 Ultra بشاشة Dynamic AMOLED 2X مقاس 6.8 إنش، معالج Snapdragon 8 Gen 3، وكاميرا 200 ميجابكسل مع قلم S Pen مدمج.',
            ],
            [
                'category' => 'mobiles',
                'name' => 'Samsung Galaxy Z Fold6 512GB',
                'price' => 18900000, 'old_price' => null,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-f956bzknmea/gallery/levant-ar-galaxy-z-fold6-f956-sm-f956bzknmea-thumb-542471299',
                'stock' => 7, 'rating' => 4.8, 'is_featured' => true,
                'description' => 'هاتف قابل للطي بشاشة داخلية 7.6 إنش، مثالي للإنتاجية والترفيه مع أداء استثنائي.',
            ],
            [
                'category' => 'mobiles',
                'name' => 'Samsung Galaxy A55 5G 128GB',
                'price' => 4200000, 'old_price' => 4800000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-a556elbcmea/gallery/levant-ar-galaxy-a55-5g-sm-a556-sm-a556elbcmea-thumb-541257818',
                'stock' => 40, 'rating' => 4.6, 'is_featured' => true,
                'description' => 'هاتف Galaxy A55 5G بتصميم أنيق، شاشة Super AMOLED، وبطارية تدوم طوال اليوم.',
            ],
            [
                'category' => 'mobiles',
                'name' => 'Samsung Galaxy A15 128GB',
                'price' => 2300000, 'old_price' => 2600000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-a155fzkgmea/gallery/levant-ar-galaxy-a15-sm-a155-sm-a155fzkgmea-thumb-539178843',
                'stock' => 55, 'rating' => 4.4, 'is_featured' => false,
                'description' => 'هاتف اقتصادي بمواصفات ممتازة وشاشة كبيرة وبطارية قوية بسعر مناسب.',
            ],
            [
                'category' => 'mobiles',
                'name' => 'Samsung Galaxy Tab S9 FE',
                'price' => 5600000, 'old_price' => 6100000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-x510nzaamea/gallery/levant-ar-galaxy-tab-s9-fe-sm-x510-sm-x510nzaamea-thumb-538175547',
                'stock' => 22, 'rating' => 4.7, 'is_featured' => false,
                'description' => 'تابلت Galaxy Tab S9 FE بشاشة 10.9 إنش مقاومة للماء مع قلم S Pen مرفق.',
            ],

            // ===== TVs =====
            [
                'category' => 'tv',
                'name' => 'Samsung Neo QLED 4K 65" QN90D',
                'price' => 15800000, 'old_price' => 17500000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/qa65qn90dauxsa/gallery/levant-ar-neo-qled-qn90d-qa65qn90dauxsa-thumb-540163289',
                'stock' => 12, 'rating' => 4.9, 'is_featured' => true,
                'description' => 'تلفزيون Neo QLED 4K بتقنية Quantum Matrix ومعالج Neural Quantum 4K لصورة فائقة الوضوح.',
            ],
            [
                'category' => 'tv',
                'name' => 'Samsung OLED 4K 55" S90D',
                'price' => 13200000, 'old_price' => null,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/qa55s90dauxsa/gallery/levant-ar-oled-s90d-qa55s90dauxsa-thumb-540164547',
                'stock' => 9, 'rating' => 4.8, 'is_featured' => true,
                'description' => 'تلفزيون OLED بألوان نقية وتباين لا متناهٍ وتصميم رفيع للغاية.',
            ],
            [
                'category' => 'tv',
                'name' => 'Samsung Crystal UHD 4K 50" DU8000',
                'price' => 6400000, 'old_price' => 7200000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/ua50du8000uxsa/gallery/levant-ar-crystal-uhd-du8000-ua50du8000uxsa-thumb-541665849',
                'stock' => 30, 'rating' => 4.5, 'is_featured' => false,
                'description' => 'تلفزيون Crystal UHD بدقة 4K وألوان نقية ومعالج Crystal 4K المتطور.',
            ],
            [
                'category' => 'tv',
                'name' => 'Samsung Sound Bar Q-Series HW-Q800D',
                'price' => 4900000, 'old_price' => 5500000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/hw-q800d-zn/gallery/levant-ar-q-series-soundbar-hw-q800d-hw-q800d-zn-thumb-541999999',
                'stock' => 16, 'rating' => 4.6, 'is_featured' => false,
                'description' => 'مكبر صوت Soundbar بتقنية Dolby Atmos وصوت محيطي غامر بقوة 5.1.2 قناة.',
            ],

            // ===== Appliances =====
            [
                'category' => 'appliances',
                'name' => 'ثلاجة Samsung بابين No Frost 530 لتر',
                'price' => 9800000, 'old_price' => 11000000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/rt53k6540s8-mr/gallery/levant-ar-top-mount-freezer-rt53k6540s8mr-thumb-303757049',
                'stock' => 14, 'rating' => 4.7, 'is_featured' => true,
                'description' => 'ثلاجة بتقنية Twin Cooling Plus وتبريد متطور يحافظ على نضارة الطعام لفترة أطول.',
            ],
            [
                'category' => 'appliances',
                'name' => 'غسالة Samsung أوتوماتيك 9 كغ EcoBubble',
                'price' => 5700000, 'old_price' => 6300000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/ww90t554dax-fh/gallery/levant-ar-front-load-washer-ww90t554dax-ww90t554daxfh-thumb-431843477',
                'stock' => 20, 'rating' => 4.6, 'is_featured' => true,
                'description' => 'غسالة بتقنية EcoBubble التي تذيب المنظف بالماء لتنظيف أعمق وحماية للأقمشة.',
            ],
            [
                'category' => 'appliances',
                'name' => 'مكيف Samsung WindFree 18000 BTU',
                'price' => 7300000, 'old_price' => null,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/ar18bxhqasinsg/gallery/levant-ar-wind-free-ar18bxhqasinsg-thumb-535905217',
                'stock' => 25, 'rating' => 4.8, 'is_featured' => false,
                'description' => 'مكيف بتقنية WindFree الذي يوزع الهواء البارد بلطف دون تيارات هواء مباشرة.',
            ],
            [
                'category' => 'appliances',
                'name' => 'مكنسة Samsung Jet 75 Robot',
                'price' => 4100000, 'old_price' => 4700000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/vr30t80313w-sg/gallery/levant-ar-jetbot-vr30t80313w-thumb-431843599',
                'stock' => 18, 'rating' => 4.5, 'is_featured' => false,
                'description' => 'مكنسة روبوت ذكية تنظف منزلك تلقائياً مع تحكم عبر تطبيق SmartThings.',
            ],

            // ===== Accessories =====
            [
                'category' => 'accessories',
                'name' => 'Samsung Galaxy Watch7 44mm',
                'price' => 3400000, 'old_price' => 3900000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-l310nzgamea/gallery/levant-ar-galaxy-watch7-l310-sm-l310nzgamea-thumb-542476547',
                'stock' => 28, 'rating' => 4.7, 'is_featured' => true,
                'description' => 'ساعة ذكية بمستشعرات صحية متقدمة وتصميم أنيق ومقاومة للماء.',
            ],
            [
                'category' => 'accessories',
                'name' => 'Samsung Galaxy Buds FE',
                'price' => 1200000, 'old_price' => 1450000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/sm-r630nzaamea/gallery/levant-ar-galaxy-buds-fe-r630-sm-r630nzaamea-thumb-538358057',
                'stock' => 45, 'rating' => 4.5, 'is_featured' => false,
                'description' => 'سماعات لاسلكية بخاصية إلغاء الضوضاء النشط وصوت نقي وجودة عالية.',
            ],
            [
                'category' => 'accessories',
                'name' => 'Samsung 25W Super Fast Charger',
                'price' => 320000, 'old_price' => 400000,
                'image' => 'https://images.samsung.com/is/image/samsung/p6pim/levant_ar/ep-ta800nbegww/gallery/levant-ar-25w-power-adapter-ep-ta800-ep-ta800nbegww-thumb-241039619',
                'stock' => 80, 'rating' => 4.6, 'is_featured' => false,
                'description' => 'شاحن سريع بقوة 25 واط يدعم الشحن فائق السرعة لهواتف Galaxy.',
            ],
        ];

        foreach ($products as $data) {
            $categoryId = $cats[$data['category']] ?? null;
            if (! $categoryId) {
                continue;
            }

            Product::updateOrCreate(
                ['slug' => Str::slug($data['name'])],
                [
                    'category_id' => $categoryId,
                    'name' => $data['name'],
                    'slug' => Str::slug($data['name']),
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'old_price' => $data['old_price'],
                    'image' => $data['image'],
                    'images' => [$data['image']],
                    'brand' => 'Samsung',
                    'stock' => $data['stock'],
                    'rating' => $data['rating'],
                    'is_featured' => $data['is_featured'],
                    'is_active' => true,
                ]
            );
        }
    }
}
