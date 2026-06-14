<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'type' => $this->type,
            'value' => $this->value,
            'min_total' => $this->min_total,
            'discount' => $this->additional['discount'] ?? null,
        ];
    }
}
