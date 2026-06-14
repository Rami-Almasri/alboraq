<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_total',
        'usage_limit',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_total' => 'decimal:2',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Compute the discount this coupon yields for a given subtotal.
     */
    public function discountFor(float $subtotal): float
    {
        $discount = $this->type === 'percent'
            ? $subtotal * ((float) $this->value / 100)
            : (float) $this->value;

        return (float) min($discount, $subtotal);
    }

    public function isValidFor(float $subtotal): bool
    {
        if (! $this->is_active) {
            return false;
        }
        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }
        if (! is_null($this->usage_limit) && $this->used_count >= $this->usage_limit) {
            return false;
        }
        if ($subtotal < (float) $this->min_total) {
            return false;
        }

        return true;
    }
}
