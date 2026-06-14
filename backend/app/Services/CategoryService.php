<?php

namespace App\Services;

use App\Models\Category;

class CategoryService
{
    public function index()
    {
        return Category::query()
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->withCount('products')
            ->with('children')
            ->orderBy('sort_order')
            ->get();
    }

    public function show(Category $category): Category
    {
        return $category->loadCount('products')->load('children');
    }
}
