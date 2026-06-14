<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'old_price' => $this->old_price,
            'image' => $this->image,
            'images' => $this->images ?? [],
            'brand' => $this->brand,
            'stock' => $this->stock,
            'rating' => $this->rating,
            'is_featured' => $this->is_featured,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'reviews_count' => $this->whenCounted('reviews'),
            'reviews_avg' => $this->when(
                isset($this->reviews_avg_rating),
                fn () => round((float) $this->reviews_avg_rating, 1)
            ),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'created_at' => $this->created_at,
        ];
    }
}
