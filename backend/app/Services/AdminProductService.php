<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminProductService
{
    /**
     * Full product listing for the admin dashboard — includes inactive
     * products and supports search, unlike the public catalogue.
     */
    public function index(Request $request)
    {
        $query = Product::query()
            ->with('category')
            ->withCount('reviews');

        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('brand', 'like', "%{$term}%");
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->input('category')));
        }

        return $query->latest()->paginate((int) $request->input('per_page', 20));
    }

    public function store(array $data): Product
    {
        $data['slug'] = $this->uniqueSlug($data['name']);

        // Keep the gallery in sync with the main image when none supplied.
        if (! empty($data['image']) && empty($data['images'])) {
            $data['images'] = [$data['image']];
        }

        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        // Regenerate the slug only when the name actually changes.
        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        if (! empty($data['image'])) {
            $data['images'] = [$data['image']];
        }

        $product->update($data);

        return $product->fresh('category');
    }

    public function destroy(Product $product): void
    {
        $product->delete();
    }

    /**
     * Build a URL-safe, unique slug. Falls back to a random token when the
     * name is non-latin (e.g. Arabic) and Str::slug yields an empty string.
     */
    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'product-'.Str::lower(Str::random(6));
        }

        $slug = $base;
        $i = 2;
        while (Product::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
