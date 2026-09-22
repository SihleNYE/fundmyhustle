<?php

namespace Database\Factories;

use App\Models\Campaign;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Campaign> */
class CampaignFactory extends Factory
{
    protected $model = Campaign::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(6)),
            'story' => fake()->paragraph(3),
            'creator_name' => fake()->name(),
            'creator_email' => fake()->unique()->safeEmail(),
            'category' => fake()->randomElement(['Business', 'Community', 'Education', 'Creative']),
            'goal_amount' => 10000,
            'raised_amount' => 0,
            'donor_count' => 0,
            'status' => 'approved',
            'image_url' => null,
            'ends_at' => now()->addMonth(),
        ];
    }
}
