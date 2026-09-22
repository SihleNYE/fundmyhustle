<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'slug', 'story', 'creator_name', 'creator_email', 'category',
        'goal_amount', 'raised_amount', 'donor_count', 'status', 'image_url', 'ends_at',
    ];

    protected function casts(): array
    {
        return [
            'goal_amount' => 'decimal:2',
            'raised_amount' => 'decimal:2',
            'ends_at' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Campaign $campaign): void {
            $campaign->slug ??= Str::slug($campaign->title).'-'.Str::lower(Str::random(6));
        });
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function getProgressAttribute(): int
    {
        if ((float) $this->goal_amount === 0.0) {
            return 0;
        }

        return min(100, (int) round(((float) $this->raised_amount / (float) $this->goal_amount) * 100));
    }
}
