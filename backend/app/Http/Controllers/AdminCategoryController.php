<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseHelper;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Resources\AdminCategoryResource;
use App\Models\Category;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::query()
                ->withCount('products')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get();

            return ResponseHelper::SuccessResponse(
                AdminCategoryResource::collection($categories),
                'Admin Category List',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['slug'] = $this->uniqueSlug($data['name']);

            $category = Category::create($data);

            return ResponseHelper::SuccessResponse(
                AdminCategoryResource::make($category),
                'Category created',
                201
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        try {
            $data = $request->validated();

            if ($data['name'] !== $category->name) {
                $data['slug'] = $this->uniqueSlug($data['name'], $category->id);
            }

            // A category cannot be its own parent.
            if (($data['parent_id'] ?? null) == $category->id) {
                $data['parent_id'] = null;
            }

            $category->update($data);

            return ResponseHelper::SuccessResponse(
                AdminCategoryResource::make($category->loadCount('products')),
                'Category updated',
                200
            );
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            // Block deletion while products still reference the category.
            if ($category->products()->exists()) {
                return ResponseHelper::FailureResponse(
                    null,
                    'لا يمكن حذف فئة تحتوي على منتجات. انقل المنتجات أو احذفها أولاً.',
                    422
                );
            }

            $category->delete();

            return ResponseHelper::SuccessResponse(null, 'Category deleted', 200);
        } catch (\Exception $e) {
            return ResponseHelper::FailureResponse(null, $e->getMessage());
        }
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        if ($base === '') {
            $base = 'cat-'.Str::lower(Str::random(6));
        }

        $slug = $base;
        $i = 2;
        while (Category::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
