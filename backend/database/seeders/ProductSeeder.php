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

        // [category, name, price, old_price, image, stock, rating, featured, description]
        $rows = [
            // ===================== Mobiles =====================
            ['mobiles', 'Samsung Galaxy S24 Ultra 256GB', 12500000, 13800000, 'smartphone', 18, 4.9, true,
                'هاتف Galaxy S24 Ultra بشاشة Dynamic AMOLED 2X مقاس 6.8 إنش، معالج Snapdragon 8 Gen 3، وكاميرا 200 ميجابكسل مع قلم S Pen مدمج وذكاء Galaxy AI.'],
            ['mobiles', 'Samsung Galaxy S24+ 256GB', 9900000, 10800000, 'smartphone', 24, 4.8, true,
                'هاتف Galaxy S24+ بشاشة 6.7 إنش بدقة QHD+ وبطارية 4900 مللي أمبير وأداء فائق مع ميزات Galaxy AI.'],
            ['mobiles', 'Samsung Galaxy S24 128GB', 8200000, null, 'smartphone', 30, 4.7, false,
                'هاتف Galaxy S24 المدمج بحجم مثالي وأداء قوي وكاميرا احترافية وشاشة ساطعة.'],
            ['mobiles', 'Samsung Galaxy S23 FE 128GB', 5400000, 6100000, 'smartphone', 26, 4.5, false,
                'إصدار Fan Edition بمواصفات رائدة وسعر مناسب وكاميرا 50 ميجابكسل.'],
            ['mobiles', 'Samsung Galaxy Z Fold6 512GB', 18900000, null, 'foldable', 7, 4.8, true,
                'هاتف قابل للطي بشاشة داخلية 7.6 إنش، مثالي للإنتاجية والترفيه مع أداء استثنائي.'],
            ['mobiles', 'Samsung Galaxy Z Flip6 256GB', 11200000, 12500000, 'foldable', 11, 4.7, true,
                'هاتف Flip أنيق قابل للطي بشاشة خارجية ذكية وتصميم عصري يناسب الجيب.'],
            ['mobiles', 'Samsung Galaxy A55 5G 128GB', 4200000, 4800000, 'smartphone', 40, 4.6, true,
                'هاتف Galaxy A55 5G بتصميم أنيق، شاشة Super AMOLED، وبطارية تدوم طوال اليوم.'],
            ['mobiles', 'Samsung Galaxy A35 5G 128GB', 3300000, 3700000, 'smartphone', 38, 4.5, false,
                'هاتف متوسط الفئة بكاميرا ممتازة وشاشة سلسة 120 هرتز وتصميم مقاوم للماء.'],
            ['mobiles', 'Samsung Galaxy A25 5G 128GB', 2700000, null, 'smartphone', 44, 4.4, false,
                'هاتف اقتصادي بدعم 5G وشاشة Super AMOLED وبطارية كبيرة.'],
            ['mobiles', 'Samsung Galaxy A15 128GB', 2300000, 2600000, 'smartphone', 55, 4.4, false,
                'هاتف اقتصادي بمواصفات ممتازة وشاشة كبيرة وبطارية قوية بسعر مناسب.'],
            ['mobiles', 'Samsung Galaxy A05s 64GB', 1500000, 1750000, 'smartphone', 60, 4.2, false,
                'هاتف بسعر منخفض وأداء جيد للاستخدام اليومي وبطارية 5000 مللي أمبير.'],
            ['mobiles', 'Samsung Galaxy Tab S9 Ultra', 11800000, 12900000, 'tablet', 9, 4.8, true,
                'تابلت بشاشة عملاقة 14.6 إنش AMOLED وأداء احترافي مع قلم S Pen.'],
            ['mobiles', 'Samsung Galaxy Tab S9 FE', 5600000, 6100000, 'tablet', 22, 4.7, false,
                'تابلت Galaxy Tab S9 FE بشاشة 10.9 إنش مقاومة للماء مع قلم S Pen مرفق.'],
            ['mobiles', 'Samsung Galaxy Tab A9+', 2900000, 3300000, 'tablet', 33, 4.3, false,
                'تابلت اقتصادي بشاشة كبيرة وصوت ستيريو رباعي مثالي للترفيه.'],

            // ===================== TVs & Audio =====================
            ['tv', 'Samsung Neo QLED 8K 85" QN900D', 48000000, 52000000, 'tv', 4, 5.0, true,
                'تلفزيون 8K الرائد بتقنية Quantum Matrix Pro ومعالج Neural Quantum 8K وصورة مذهلة.'],
            ['tv', 'Samsung Neo QLED 4K 65" QN90D', 15800000, 17500000, 'tv', 12, 4.9, true,
                'تلفزيون Neo QLED 4K بتقنية Quantum Matrix ومعالج Neural Quantum 4K لصورة فائقة الوضوح.'],
            ['tv', 'Samsung Neo QLED 4K 55" QN85D', 12400000, null, 'tv', 14, 4.7, false,
                'تلفزيون Neo QLED بإضاءة خلفية دقيقة وألوان نابضة وتجربة مشاهدة غامرة.'],
            ['tv', 'Samsung OLED 4K 65" S95D', 19500000, 21000000, 'tv', 6, 4.9, true,
                'تلفزيون OLED الرائد بطبقة مضادة للانعكاس وسطوع استثنائي وألوان نقية.'],
            ['tv', 'Samsung OLED 4K 55" S90D', 13200000, null, 'tv', 9, 4.8, true,
                'تلفزيون OLED بألوان نقية وتباين لا متناهٍ وتصميم رفيع للغاية.'],
            ['tv', 'Samsung QLED 4K 65" Q80D', 9800000, 11000000, 'tv', 16, 4.6, false,
                'تلفزيون QLED بألوان Quantum Dot نقية ومعالج 4K قوي وتصميم نحيف.'],
            ['tv', 'Samsung The Frame 55"', 11500000, 12600000, 'tv', 10, 4.7, true,
                'تلفزيون فني يتحول إلى لوحة فنية عند إيقافه، بتصميم أنيق يناسب ديكور منزلك.'],
            ['tv', 'Samsung Crystal UHD 4K 75" DU8000', 12900000, 14200000, 'tv', 8, 4.6, false,
                'شاشة عملاقة 75 إنش بدقة 4K وألوان نقية ومعالج Crystal 4K.'],
            ['tv', 'Samsung Crystal UHD 4K 50" DU8000', 6400000, 7200000, 'tv', 30, 4.5, false,
                'تلفزيون Crystal UHD بدقة 4K وألوان نقية ومعالج Crystal 4K المتطور.'],
            ['tv', 'Samsung Sound Bar Q-Series HW-Q990D', 8900000, 9900000, 'soundbar', 12, 4.8, true,
                'نظام صوت 11.1.4 قناة بتقنية Dolby Atmos لتجربة سينمائية غامرة في منزلك.'],
            ['tv', 'Samsung Sound Bar Q-Series HW-Q800D', 4900000, 5500000, 'soundbar', 16, 4.6, false,
                'مكبر صوت Soundbar بتقنية Dolby Atmos وصوت محيطي غامر بقوة 5.1.2 قناة.'],
            ['tv', 'Samsung The Freestyle Projector', 7600000, 8400000, 'projector', 13, 4.6, false,
                'بروجكتور محمول ذكي يعرض حتى 100 إنش مع نظام تشغيل ذكي وصوت 360 درجة.'],

            // ===================== Home Appliances =====================
            ['appliances', 'ثلاجة Samsung French Door 630 لتر', 16500000, 18200000, 'fridge', 8, 4.8, true,
                'ثلاجة فاخرة بأربعة أبواب وتقنية Twin Cooling Plus وموزع مياه وثلج.'],
            ['appliances', 'ثلاجة Samsung Side by Side 660 لتر', 13900000, 15100000, 'fridge', 10, 4.7, true,
                'ثلاجة جنباً إلى جنب بسعة كبيرة وتقنية SpaceMax وموزع مياه خارجي.'],
            ['appliances', 'ثلاجة Samsung بابين No Frost 530 لتر', 9800000, 11000000, 'fridge', 14, 4.7, true,
                'ثلاجة بتقنية Twin Cooling Plus وتبريد متطور يحافظ على نضارة الطعام لفترة أطول.'],
            ['appliances', 'غسالة Samsung أوتوماتيك 9 كغ EcoBubble', 5700000, 6300000, 'washer', 20, 4.6, true,
                'غسالة بتقنية EcoBubble التي تذيب المنظف بالماء لتنظيف أعمق وحماية للأقمشة.'],
            ['appliances', 'غسالة Samsung تحميل علوي 12 كغ', 4800000, 5400000, 'washer', 18, 4.5, false,
                'غسالة بتحميل علوي وسعة كبيرة وتقنية Wobble لحماية ألياف الملابس.'],
            ['appliances', 'نشافة Samsung 8 كغ Heat Pump', 6900000, 7600000, 'washer', 12, 4.6, false,
                'نشافة موفرة للطاقة بتقنية المضخة الحرارية وعناية فائقة بالملابس.'],
            ['appliances', 'مكيف Samsung WindFree 18000 BTU', 7300000, null, 'ac', 25, 4.8, true,
                'مكيف بتقنية WindFree الذي يوزع الهواء البارد بلطف دون تيارات هواء مباشرة.'],
            ['appliances', 'مكيف Samsung WindFree 24000 BTU', 9200000, 10100000, 'ac', 19, 4.7, false,
                'مكيف بقدرة تبريد عالية وتقنية WindFree وكفاءة طاقة ممتازة.'],
            ['appliances', 'ميكروويف Samsung 28 لتر Convection', 2400000, 2800000, 'microwave', 28, 4.5, false,
                'فرن ميكروويف بخاصية الحمل الحراري وطهي متعدد الوظائف وتنظيف سهل.'],
            ['appliances', 'غسالة صحون Samsung 14 مكان', 6100000, 6800000, 'dishwasher', 15, 4.6, true,
                'غسالة صحون بسعة كبيرة وتقنية WaterWall وبرامج غسيل متعددة وتشغيل هادئ.'],
            ['appliances', 'مكنسة Samsung Jet 75 Stick', 4100000, 4700000, 'vacuum', 18, 4.5, false,
                'مكنسة عصوية لاسلكية بقوة شفط عالية وبطارية قابلة للتبديل وفلتر متعدد الطبقات.'],
            ['appliances', 'مكنسة Samsung Jet Bot Robot', 5600000, 6200000, 'vacuum', 13, 4.6, true,
                'مكنسة روبوت ذكية تنظف منزلك تلقائياً مع تحكم عبر تطبيق SmartThings.'],

            // ===================== Accessories =====================
            ['accessories', 'Samsung Galaxy Watch Ultra', 6900000, 7500000, 'watch', 14, 4.8, true,
                'ساعة ذكية متينة للمغامرات بمستشعرات صحية متقدمة وبطارية طويلة العمر.'],
            ['accessories', 'Samsung Galaxy Watch7 44mm', 3400000, 3900000, 'watch', 28, 4.7, true,
                'ساعة ذكية بمستشعرات صحية متقدمة وتصميم أنيق ومقاومة للماء.'],
            ['accessories', 'Samsung Galaxy Buds3 Pro', 2200000, 2500000, 'buds', 30, 4.7, true,
                'سماعات احترافية بخاصية إلغاء ضوضاء ذكية وصوت Hi-Fi نقي وتصميم مريح.'],
            ['accessories', 'Samsung Galaxy Buds FE', 1200000, 1450000, 'buds', 45, 4.5, false,
                'سماعات لاسلكية بخاصية إلغاء الضوضاء النشط وصوت نقي وجودة عالية.'],
            ['accessories', 'Samsung 45W Super Fast Charger', 520000, 650000, 'charger', 70, 4.7, false,
                'شاحن فائق السرعة بقوة 45 واط لشحن أجهزتك بأقصى سرعة ممكنة.'],
            ['accessories', 'Samsung 25W Super Fast Charger', 320000, 400000, 'charger', 80, 4.6, false,
                'شاحن سريع بقوة 25 واط يدعم الشحن فائق السرعة لهواتف Galaxy.'],
            ['accessories', 'Samsung Wireless Charger Duo', 780000, 900000, 'charger', 40, 4.5, false,
                'شاحن لاسلكي مزدوج يشحن هاتفك وساعتك أو سماعاتك في آن واحد.'],
        ];

        foreach ($rows as $r) {
            [$cat, $name, $price, $old, $img, $stock, $rating, $featured, $desc] = $r;
            $categoryId = $cats[$cat] ?? null;
            if (! $categoryId) {
                continue;
            }

            Product::updateOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'category_id' => $categoryId,
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => $desc,
                    'price' => $price,
                    'old_price' => $old,
                    'image' => "/products/{$img}.svg",
                    'images' => ["/products/{$img}.svg"],
                    'brand' => 'Samsung',
                    'stock' => $stock,
                    'rating' => $rating,
                    'is_featured' => $featured,
                    'is_active' => true,
                ]
            );
        }
    }
}
