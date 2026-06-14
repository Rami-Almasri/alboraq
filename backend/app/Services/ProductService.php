<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductService
{
    public function index(Request $request)
    {
        $query = Product::query()
            ->with('category')
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->where('is_active', true);

        // Filter by category slug
        if ($request->filled('category')) {
            $slug = $request->input('category');
            $query->whereHas('category', function ($q) use ($slug) {
                $q->where('slug', $slug)
                    ->orWhereHas('parent', fn ($p) => $p->where('slug', $slug));
            });
        }

        // Search
        if ($request->filled('search')) {
            $term = $request->input('search');
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%");
            });
        }

        // Featured only
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        match ($request->input('sort')) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            default => $query->latest(),
        };

        return $query->paginate((int) $request->input('per_page', 12));
    }

    public function show(Product $product): Product
    {
        return $product
            ->load(['category', 'reviews.user'])
            ->loadCount('reviews')
            ->loadAvg('reviews', 'rating');
    }
}
