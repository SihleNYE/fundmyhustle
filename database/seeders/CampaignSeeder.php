<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['title' => 'A kitchen for Nondyebo Preschool', 'creator_name' => 'Nomsa Dlamini', 'creator_email' => 'nomsa@example.com', 'category' => 'Community', 'goal_amount' => 35000, 'raised_amount' => 21800, 'donor_count' => 74, 'story' => 'We are building a safe, equipped kitchen so that young learners in our community can receive a warm meal every school day.', 'image_url' => 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80'],
            ['title' => 'Taking township fashion to market', 'creator_name' => 'Siyabonga Mokoena', 'creator_email' => 'siya@example.com', 'category' => 'Business', 'goal_amount' => 50000, 'raised_amount' => 12600, 'donor_count' => 41, 'story' => 'Help us buy our first production run and showcase locally designed streetwear at markets across the Eastern Cape.', 'image_url' => 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=80'],
            ['title' => 'Coding club laptops for young makers', 'creator_name' => 'Lutho Jacobs', 'creator_email' => 'lutho@example.com', 'category' => 'Education', 'goal_amount' => 65000, 'raised_amount' => 39750, 'donor_count' => 93, 'story' => 'Our Saturday coding club needs refurbished laptops, data, and a projector to help more young people build practical digital skills.', 'image_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'],
        ] as $data) {
            Campaign::create($data + ['status' => 'approved', 'ends_at' => now()->addDays(45)]);
        }
    }
}
